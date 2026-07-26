from fastapi import APIRouter, HTTPException, Header, Depends
from typing import Optional
from pydantic import BaseModel
import httpx
from src.config import settings
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class UpdateUserRequest(BaseModel):
    password: Optional[str] = None
    email: Optional[str] = None
    user_metadata: Optional[dict] = None

@router.patch("/users/{user_id}")
async def update_user(
    user_id: str,
    update_data: UpdateUserRequest,
    authorization: Optional[str] = Header(None)
):
    """
    Actualiza un usuario en Supabase Auth (contraseña, email, metadata).
    Requiere service_role key.
    """
    logger.info(f"Intentando actualizar usuario: {user_id}")
    
    if not authorization:
        raise HTTPException(status_code=401, detail="No autorizado")
    
    service_role_key = settings.SUPABASE_SERVICE_ROLE_KEY
    
    if not service_role_key:
        raise HTTPException(
            status_code=500, 
            detail="Service role key no configurada en el backend"
        )
    
    # Preparar datos para actualizar
    update_payload = {}
    if update_data.password:
        update_payload["password"] = update_data.password
    if update_data.email:
        update_payload["email"] = update_data.email
    if update_data.user_metadata:
        update_payload["user_metadata"] = update_data.user_metadata
    
    if not update_payload:
        raise HTTPException(status_code=400, detail="No hay datos para actualizar")
    
    url = f"{settings.SUPABASE_URL}/auth/v1/admin/users/{user_id}"
    headers = {
        "apikey": service_role_key,
        "Authorization": f"Bearer {service_role_key}",
        "Content-Type": "application/json"
    }
    
    logger.info(f"Actualizando usuario: PUT {url}")
    logger.info(f"Datos: {update_payload}")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.put(url, json=update_payload, headers=headers, timeout=10.0)
            
            logger.info(f"Respuesta: {response.status_code}")
            
            if response.status_code == 200:
                return {"message": "Usuario actualizado exitosamente", "user_id": user_id}
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Error al actualizar usuario: {response.text}"
                )
    except httpx.HTTPError as e:
        logger.error(f"Error HTTP: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error de conexión: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error inesperado: {str(e)}")


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    authorization: Optional[str] = Header(None)
):
    """
    Elimina un usuario completamente de Supabase Auth.
    Si el usuario no existe en auth.users pero sí en profiles, elimina el perfil.
    """
    logger.info(f"Intentando eliminar usuario: {user_id}")
    
    if not authorization:
        raise HTTPException(status_code=401, detail="No autorizado")
    
    service_role_key = settings.SUPABASE_SERVICE_ROLE_KEY
    
    if not service_role_key:
        raise HTTPException(
            status_code=500, 
            detail="Service role key no configurada en el backend"
        )
    
    # Intentar eliminar de auth.users primero
    url = f"{settings.SUPABASE_URL}/auth/v1/admin/users/{user_id}"
    headers = {
        "apikey": service_role_key,
        "Authorization": f"Bearer {service_role_key}",
        "Content-Type": "application/json"
    }
    
    logger.info(f"Llamando a Supabase: DELETE {url}")
    
    try:
        async with httpx.AsyncClient() as client:
            # Intentar eliminar de auth.users
            response = await client.delete(url, headers=headers, timeout=10.0)
            
            logger.info(f"Respuesta de Supabase Auth: {response.status_code}")
            
            if response.status_code == 200 or response.status_code == 204:
                # Usuario eliminado exitosamente de auth.users
                # El perfil se eliminará automáticamente por CASCADE
                return {"message": "Usuario eliminado exitosamente", "user_id": user_id}
            
            elif response.status_code == 404 or "Database error loading user" in response.text:
                # Usuario no existe en auth.users, pero puede existir perfil huérfano
                logger.warning(f"Usuario no encontrado en auth.users, eliminando perfil huérfano si existe")
                
                # Eliminar perfil huérfano usando REST API de Supabase
                profile_url = f"{settings.SUPABASE_URL}/rest/v1/profiles?id=eq.{user_id}"
                profile_headers = {
                    "apikey": service_role_key,
                    "Authorization": f"Bearer {service_role_key}",
                    "Content-Type": "application/json"
                }
                
                profile_response = await client.delete(profile_url, headers=profile_headers)
                
                if profile_response.status_code in [200, 204]:
                    return {
                        "message": "Perfil huérfano eliminado exitosamente", 
                        "user_id": user_id,
                        "orphaned": True
                    }
                else:
                    raise HTTPException(
                        status_code=404,
                        detail="Usuario no encontrado en auth.users ni en profiles"
                    )
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Error al eliminar usuario: {response.text}"
                )
                
    except httpx.HTTPError as e:
        logger.error(f"Error HTTP: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error de conexión: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error inesperado: {str(e)}")
