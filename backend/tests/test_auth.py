import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, ensure_db_schema

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    ensure_db_schema()
    yield

def test_register_and_login():
    client = TestClient(app)
    
    # Register
    reg_res = client.post("/api/auth/register", json={
        "email": "testuser@example.com",
        "name": "Alex Tech",
        "password": "SecretPassword123!",
        "preferred_mode": "beginner"
    })
    assert reg_res.status_code in [200, 400]  # 400 if user already exists
    
    # Login
    login_res = client.post("/api/auth/login", json={
        "email": "testuser@example.com",
        "password": "SecretPassword123!"
    })
    assert login_res.status_code == 200
    data = login_res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "testuser@example.com"
    assert data["user"]["name"] == "Alex Tech"

def test_login_invalid_password():
    client = TestClient(app)
    res = client.post("/api/auth/login", json={
        "email": "testuser@example.com",
        "password": "WrongPassword!"
    })
    assert res.status_code == 401

def test_otp_flow():
    client = TestClient(app)
    # 1. Send OTP
    send_res = client.post("/api/auth/otp/send", json={"email": "otpuser@example.com"})
    assert send_res.status_code == 200
    otp_data = send_res.json()
    code = otp_data["code_preview"]
    assert len(code) == 6

    # 2. Verify with wrong code
    fail_res = client.post("/api/auth/otp/verify", json={
        "email": "otpuser@example.com",
        "code": "000000"
    })
    assert fail_res.status_code == 400

    # 3. Verify with valid code
    success_res = client.post("/api/auth/otp/verify", json={
        "email": "otpuser@example.com",
        "code": code,
        "name": "OTP User"
    })
    assert success_res.status_code == 200
    user_data = success_res.json()
    assert "access_token" in user_data
    assert user_data["user"]["email"] == "otpuser@example.com"

def test_google_auth_flow():
    client = TestClient(app)
    res = client.post("/api/auth/google", json={
        "email": "googleuser@gmail.com",
        "name": "Google User",
        "google_id": "google-123456",
        "avatar_url": "https://lh3.googleusercontent.com/test.jpg"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "googleuser@gmail.com"
    assert data["user"]["auth_provider"] == "google"
