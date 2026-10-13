import random
import logging
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, OtpCode
from app.schemas import (
    UserCreate, 
    UserLogin, 
    UserResponse, 
    Token, 
    UserUpdate,
    OtpRequest,
    OtpResponse,
    OtpVerify,
    GoogleAuthRequest
)
from app.auth import get_password_hash, verify_password, create_access_token, get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    
    user = User(
        email=user_in.email.lower(),
        name=user_in.name,
        hashed_password=get_password_hash(user_in.password),
        auth_provider="local",
        preferred_mode=user_in.preferred_mode or "beginner"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.post("/login", response_model=Token)
def login(creds: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == creds.email.lower()).first()
    if not user or not verify_password(creds.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )
    
    token = create_access_token({"sub": str(user.id), "email": user.email})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.post("/otp/send", response_model=OtpResponse)
def send_otp(req: OtpRequest, db: Session = Depends(get_db)):
    email = req.email.strip().lower()
    code = f"{random.randint(100000, 999999)}"
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
    
    # Invalidate old unused codes
    db.query(OtpCode).filter(OtpCode.email == email, OtpCode.used == False).update({"used": True})
    
    otp_record = OtpCode(
        email=email,
        code=code,
        purpose=req.purpose or "login_register",
        expires_at=expires_at,
        used=False
    )
    db.add(otp_record)
    db.commit()
    
    logger.info(f"Generated One-Time Code for {email}: {code}")
    
    return OtpResponse(
        message=f"One-time verification code generated for {email}",
        email=email,
        code_preview=code
    )

@router.post("/otp/verify", response_model=Token)
def verify_otp(req: OtpVerify, db: Session = Depends(get_db)):
    email = req.email.strip().lower()
    code = req.code.strip()
    
    now = datetime.now(timezone.utc)
    otp_record = db.query(OtpCode).filter(
        OtpCode.email == email,
        OtpCode.code == code,
        OtpCode.used == False,
        OtpCode.expires_at > now
    ).first()
    
    if not otp_record:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired verification code. Please request a new one."
        )
    
    otp_record.used = True
    db.commit()
    
    # Check if user already exists
    user = db.query(User).filter(User.email == email).first()
    if not user:
        name = req.name.strip() if req.name else email.split("@")[0].capitalize()
        user = User(
            email=email,
            name=name,
            hashed_password="",
            auth_provider="otp",
            preferred_mode=req.preferred_mode or "beginner"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    token = create_access_token({"sub": str(user.id), "email": user.email})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.post("/google", response_model=Token)
async def google_auth(req: GoogleAuthRequest, db: Session = Depends(get_db)):
    email: Optional[str] = None
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    google_id: Optional[str] = None
    
    if req.credential:
        try:
            import httpx
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={req.credential}")
                if res.status_code == 200:
                    data = res.json()
                    email = data.get("email")
                    name = data.get("name")
                    avatar_url = data.get("picture")
                    google_id = data.get("sub")
                else:
                    raise HTTPException(status_code=400, detail="Google token verification failed.")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error during Google token validation: {e}")
            raise HTTPException(status_code=400, detail="Unable to contact Google verification service.")
    else:
        email = req.email
        name = req.name
        avatar_url = req.avatar_url
        google_id = req.google_id
    
    if not email or "@" not in str(email) or "." not in str(email):
        raise HTTPException(status_code=400, detail="A valid registered email address is required for Google Sign-In.")
    
    email = str(email).strip().lower()
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        user = User(
            email=email,
            name=name or email.split("@")[0].capitalize(),
            hashed_password="",
            avatar_url=avatar_url,
            auth_provider="google",
            google_id=google_id,
            preferred_mode="beginner"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        if avatar_url and not user.avatar_url:
            user.avatar_url = avatar_url
        if google_id and not user.google_id:
            user.google_id = google_id
        db.commit()
        db.refresh(user)
    
    token = create_access_token({"sub": str(user.id), "email": user.email})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/mode", response_model=UserResponse)
def update_mode(mode: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if mode not in ["beginner", "pro"]:
        raise HTTPException(status_code=400, detail="Mode must be 'beginner' or 'pro'")
    current_user.preferred_mode = mode
    db.commit()
    db.refresh(current_user)
    return current_user
