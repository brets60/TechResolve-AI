import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
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
