from fastapi import Depends, HTTPException, Header
from jose import jwt, JWTError
from app.core.config import settings
from app.db import SessionLocal
from app.models import User, Role

# For dev: if no Authorization header, use the first user (or create one)
def get_current_user(authorization: str | None = Header(default=None)):
    db = SessionLocal()
    try:
        if authorization and authorization.lower().startswith("bearer "):
            token = authorization.split(" ",1)[1]
            try:
                payload = jwt.decode(token, settings.APP_SECRET, algorithms=["HS256"])
                uid = int(payload.get("sub"))
                user = db.query(User).get(uid)
                if user: return user
            except JWTError:
                pass
        user = db.query(User).first()
        if user: return user
        # bootstrap a dev user
        user = User(email="dev@example.com", role=Role.DEVELOPER)
        db.add(user); db.commit(); db.refresh(user)
        return user
    finally:
        db.close()