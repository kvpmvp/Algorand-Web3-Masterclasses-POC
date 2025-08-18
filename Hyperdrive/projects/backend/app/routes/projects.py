from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import select, func, or_
from datetime import datetime
from uuid import UUID

from slowapi import Limiter
from slowapi.util import get_remote_address

from app.db import SessionLocal
from app.models import Project, ProjectStatus, User, Role
from app.schemas import ProjectCreate, ProjectUpdate, ProjectOut
from app.utils.text import split_links

# Rate limiter instance (used by decorators and wired into app.state in main.py)
limiter = Limiter(key_func=get_remote_address)

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(db: Session = Depends(get_db)):
    """
    DEV stub: returns the first user or creates a default developer user.
    Replace with real JWT/OIDC or wallet challenge later.
    """
    user = db.query(User).first()
    if not user:
        user = User(email="dev@example.com", role=Role.DEVELOPER)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


@router.post("", response_model=ProjectOut)
@limiter.limit("5/day")
def create_project(
    request: Request,
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    p = Project(
        owner_user_id=user.id,
        name=payload.name.strip(),
        category=payload.category.strip(),
        purpose=payload.purpose.strip(),
        problem=payload.problem.strip(),
        solution=payload.solution.strip(),
        target_market=payload.targetMarket.strip(),
        business_model=payload.businessModel.strip(),
        team=payload.team.strip(),
        contact=payload.contact.strip(),
        links_json=split_links(payload.links or ""),
        status=ProjectStatus.DRAFT,
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return ProjectOut(**p.__dict__, links=p.links_json)


@router.get("", response_model=dict)
def list_projects(
    db: Session = Depends(get_db),
    q: str | None = None,
    category: str | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=50),
):
    stmt = select(Project).where(Project.status == ProjectStatus.PUBLISHED)
    if category:
        stmt = stmt.where(Project.category == category)
    if q:
        pattern = f"%{q.strip().lower()}%"
        stmt = stmt.where(
            or_(
                func.lower(Project.name).like(pattern),
                func.lower(Project.purpose).like(pattern),
                func.lower(Project.problem).like(pattern),
                func.lower(Project.solution).like(pattern),
                func.lower(Project.team).like(pattern),
            )
        )
    total = db.execute(select(func.count()).select_from(stmt.subquery())).scalar()
    rows = (
        db.execute(
            stmt.order_by(Project.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        .scalars()
        .all()
    )
    items = [ProjectOut(**r.__dict__, links=r.links_json) for r in rows]
    return {"items": items, "total": total or 0, "page": page, "page_size": page_size}


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(
    project_id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    p = db.get(Project, project_id)
    if not p:
        raise HTTPException(404, "Not found")
    if p.status != ProjectStatus.PUBLISHED and p.owner_user_id != user.id:
        raise HTTPException(404, "Not found")
    return ProjectOut(**p.__dict__, links=p.links_json)


@router.patch("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: UUID,
    payload: ProjectUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    p = db.get(Project, project_id)
    if not p:
        raise HTTPException(404, "Not found")
    if p.owner_user_id != user.id:
        raise HTTPException(403, "Forbidden")

    mapping = {
        "name": "name",
        "category": "category",
        "purpose": "purpose",
        "problem": "problem",
        "solution": "solution",
        "targetMarket": "target_market",
        "businessModel": "business_model",
        "team": "team",
        "contact": "contact",
    }
    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        if k == "links":
            p.links_json = split_links(v or "")
        else:
            setattr(p, mapping[k], v.strip())
    p.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(p)
    return ProjectOut(**p.__dict__, links=p.links_json)


@router.post("/{project_id}/publish")
def publish_project(
    project_id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    p = db.get(Project, project_id)
    if not p:
        raise HTTPException(404, "Not found")
    if p.owner_user_id != user.id:
        raise HTTPException(403, "Forbidden")
    p.status = ProjectStatus.PUBLISHED
    p.updated_at = datetime.utcnow()
    db.commit()
    return {"ok": True, "status": p.status}


@router.post("/{project_id}/unpublish")
def unpublish_project(
    project_id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    p = db.get(Project, project_id)
    if not p:
        raise HTTPException(404, "Not found")
    if p.owner_user_id != user.id:
        raise HTTPException(403, "Forbidden")
    p.status = ProjectStatus.DRAFT
    p.updated_at = datetime.utcnow()
    db.commit()
    return {"ok": True, "status": p.status}


@router.post("/{project_id}/view")
def add_view(project_id: UUID, db: Session = Depends(get_db)):
    p = db.get(Project, project_id)
    if not p or p.status != ProjectStatus.PUBLISHED:
        raise HTTPException(404, "Not found")
    p.views_count += 1
    db.commit()
    return {"ok": True}


@router.post("/{project_id}/report")
@limiter.limit("20/day")
def report_project(
    request: Request,
    project_id: UUID,
    reason: str = "",
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    p = db.get(Project, project_id)
    if not p:
        raise HTTPException(404, "Not found")
    # We just count reports on the project for now (simple abuse control).
    p.reports_count += 1
    # Optional auto-hide could go here if you’ve set a threshold in settings.
    db.commit()
    return {"ok": True, "reports_count": p.reports_count}
