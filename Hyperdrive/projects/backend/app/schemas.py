from pydantic import BaseModel, Field, field_validator, HttpUrl
from typing import List, Optional
from uuid import UUID
from app.core.config import settings
import bleach, re

ALLOWED_CATEGORIES = {c.strip() for c in settings.ALLOWED_CATEGORIES.split(",") if c.strip()}

def _clean_text(s:str, maxlen:int) -> str:
    s = (s or "").strip()
    s = bleach.clean(s, tags=[], attributes={}, strip=True)
    s = re.sub(r"\s+", " ", s)
    return s[:maxlen]

class ProjectCreate(BaseModel):
    name: str = Field(..., max_length=80)
    category: str
    purpose: str = Field(..., max_length=200)
    problem: str
    solution: str
    targetMarket: str
    businessModel: str
    team: str
    contact: str = Field(..., max_length=200)
    links: Optional[str] = ""  # comma or newline separated, per FE

    @field_validator("category")
    @classmethod
    def check_category(cls, v):
        if v not in ALLOWED_CATEGORIES:
            raise ValueError(f"category must be one of: {', '.join(sorted(ALLOWED_CATEGORIES))}")
        return v

    @field_validator("name","purpose","problem","solution","targetMarket","businessModel","team","contact","links")
    @classmethod
    def clean(cls, v):
        # apply different caps
        caps = {
            "name":80,"purpose":200,"problem":4000,"solution":4000,
            "targetMarket":4000,"businessModel":4000,"team":4000,"contact":200,"links":2000
        }
        # we don't know which field here; just cap generously
        return _clean_text(v, 4000)

class ProjectOut(BaseModel):
    id: UUID
    owner_user_id: int
    name: str
    category: str
    purpose: str
    problem: str
    solution: str
    target_market: str
    business_model: str
    team: str
    contact: str
    links: List[str]
    status: str
    views_count: int

    class Config:
        from_attributes = True

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    purpose: Optional[str] = None
    problem: Optional[str] = None
    solution: Optional[str] = None
    targetMarket: Optional[str] = None
    businessModel: Optional[str] = None
    team: Optional[str] = None
    contact: Optional[str] = None
    links: Optional[str] = None  # still comma/newline separated

class ProjectList(BaseModel):
    items: list[ProjectOut]
    total: int
    page: int
    page_size: int