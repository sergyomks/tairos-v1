from fastapi import APIRouter
from pydantic import BaseModel
from src.orchestration.application.use_cases import OrchestrateTaskUseCase
from src.orchestration.domain.services import LLMRouterService

router = APIRouter()
router_service = LLMRouterService()

class TaskDTO(BaseModel):
    description: str

@router.post("/run")
async def run_orchestration(dto: TaskDTO):
    use_case = OrchestrateTaskUseCase(router_service)
    result = use_case.execute(dto.description)
    return result
