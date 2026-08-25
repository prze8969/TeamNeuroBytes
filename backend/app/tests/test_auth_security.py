import unittest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app.main import app
from app.db.engine import get_session
from app.models.database import User
from app.core.security import verify_password, get_password_hash, create_access_token

class TestAuthSecurity(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine(
            "sqlite:///:memory:",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        SQLModel.metadata.create_all(self.engine)
        self.session = Session(self.engine)

        farmer_pw = get_password_hash("farmer123")
        self.farmer = User(
            id=1,
            email="farmer@kisansetu.in",
            full_name="Ramesh Patil",
            role="FARMER",
            district="Nashik",
            state="Maharashtra",
            hashed_password=farmer_pw,
            kyc_verified=True
        )
        admin_pw = get_password_hash("admin123")
        self.admin = User(
            id=2,
            email="admin@kisansetu.in",
            full_name="Ministry Admin",
            role="ADMIN",
            district="New Delhi",
            state="Delhi",
            hashed_password=admin_pw,
            kyc_verified=True
        )
        self.session.add(self.farmer)
        self.session.add(self.admin)
        self.session.commit()

        def get_session_override():
            return self.session

        app.dependency_overrides[get_session] = get_session_override
        self.client = TestClient(app)

    def tearDown(self):
        app.dependency_overrides.clear()
        self.session.close()

    def test_verify_password_rejects_plaintext(self):
        """Asserts that verify_password strictly rejects plaintext password matching."""
        plaintext_stored = "mypassword123"
        self.assertFalse(verify_password("mypassword123", plaintext_stored))
        self.assertFalse(verify_password("anything", "anything"))
        self.assertFalse(verify_password("", ""))

    def test_verify_password_valid_bcrypt(self):
        """Asserts that properly bcrypt-hashed passwords authenticate successfully."""
        hashed = get_password_hash("securepass2026")
        self.assertTrue(verify_password("securepass2026", hashed))
        self.assertFalse(verify_password("wrongpass", hashed))

    def test_get_users_unauthenticated_fails(self):
        """Asserts that GET /api/auth/users requires authentication."""
        response = self.client.get("/api/auth/users")
        self.assertEqual(response.status_code, 401)

    def test_get_users_non_admin_forbidden(self):
        """Asserts that non-admin stakeholders cannot access GET /api/auth/users."""
        farmer_token = create_access_token(subject="farmer@kisansetu.in", role="FARMER", user_id=1)
        response = self.client.get(
            "/api/auth/users",
            headers={"Authorization": f"Bearer {farmer_token}"}
        )
        self.assertEqual(response.status_code, 403)
        self.assertIn("Admin privileges required", response.json()["detail"])

    def test_get_users_admin_succeeds_and_strips_passwords(self):
        """Asserts that ADMIN can fetch users and hashed_password is NOT leaked."""
        admin_token = create_access_token(subject="admin@kisansetu.in", role="ADMIN", user_id=2)
        response = self.client.get(
            "/api/auth/users",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        self.assertEqual(response.status_code, 200)
        users = response.json()
        self.assertGreaterEqual(len(users), 2)
        for u in users:
            self.assertNotIn("hashed_password", u)
            self.assertIn("email", u)
            self.assertIn("role", u)

    def test_kyc_verification_ownership_guard(self):
        """Asserts that user 1 cannot verify user 2's KYC."""
        farmer_token = create_access_token(subject="farmer@kisansetu.in", role="FARMER", user_id=1)
        response = self.client.post(
            "/api/auth/kyc/2",
            json={"aadhaar_number": "1234-5678-9999", "consent_agreed": True},
            headers={"Authorization": f"Bearer {farmer_token}"}
        )
        self.assertEqual(response.status_code, 403)

    def test_kyc_verification_owner_succeeds(self):
        """Asserts that account owner can verify their own KYC."""
        farmer_token = create_access_token(subject="farmer@kisansetu.in", role="FARMER", user_id=1)
        response = self.client.post(
            "/api/auth/kyc/1",
            json={"aadhaar_number": "1234-5678-9999", "consent_agreed": True},
            headers={"Authorization": f"Bearer {farmer_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["kyc_verified"])

if __name__ == "__main__":
    unittest.main()
