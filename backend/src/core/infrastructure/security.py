# Placeholders para autenticación (Keycloak / JWT)
def verify_token(token: str):
    return {"sub": "mock_user_id", "roles": ["user"]}
