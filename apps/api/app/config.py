from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_env: str = "development"
    database_url: str
    allowed_origins: str = "http://localhost:3000"
    resend_api_key: str = ""
    contact_recipient_email: str = ""
    smtp_host: str = "localhost"
    smtp_port: int = 1025
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_use_tls: bool = False
    smtp_from_email: str = "portfolio@vicenteflores.dev"
    api_port: int = 8000
    redis_url: str = "redis://localhost:6380"
    github_username: str = "Vicente28CF"

    @property
    def allowed_origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
