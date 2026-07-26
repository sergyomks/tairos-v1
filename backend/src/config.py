from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/tairos_db"
    REDIS_URL: str = "redis://localhost:6379/0"
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "passwordpassword"
    OPENAI_API_KEY: str = "mock-key"
    SUPABASE_URL: str = "https://your-project.supabase.co"
    SUPABASE_KEY: str = "your-anon-key"
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    
    class Config:
        env_file = ".env"

settings = Settings()
