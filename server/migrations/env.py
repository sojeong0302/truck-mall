# migrations/env.py
from logging.config import fileConfig
from importlib import import_module

from flask import current_app
from alembic import context
import os
import sys
import logging


# Alembic Config
config = context.config

# Logging
fileConfig(config.config_file_name)
logger = logging.getLogger("alembic.env")


def get_engine():
    try:
        # Flask-SQLAlchemy < 3, Alchemical
        return current_app.extensions["migrate"].db.get_engine()
    except (TypeError, AttributeError):
        # Flask-SQLAlchemy >= 3
        return current_app.extensions["migrate"].db.engine


def get_engine_url():
    try:
        return get_engine().url.render_as_string(hide_password=False).replace("%", "%%")
    except AttributeError:
        return str(get_engine().url).replace("%", "%%")


def _import_models():
    """
    Alembic autogenerate가 모델을 인식하도록 프로젝트 모델을 강제로 import.
    패키지명은 현재 Flask 앱의 import_name을 기반으로 자동 계산한다.
    예: app 패키지가 'server'면  server.models.sale  등으로 import 시도.
    필요시 아래 candidates 에 네 실제 경로(파일명)를 추가해도 됨.
    """
    pkg = current_app.import_name  # 보통 'server'
    candidates = [
        f"{pkg}.models.sale",
        f"{pkg}.models.sale_model",
        f"{pkg}.models.performance_model",
        f"{pkg}.models",  # models/__init__.py 에서 전부 import 해주는 경우
    ]
    for mod in candidates:
        try:
            import_module(mod)
        except Exception:
            # 경로가 없거나 import 에러여도 계속 진행 (다음 후보 시도)
            pass

    # 안전장치: 프로젝트 루트를 sys.path에 추가 (상황에 따라 유용)
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    if root not in sys.path:
        sys.path.append(root)


# sqlalchemy.url을 동적으로 주입
config.set_main_option("sqlalchemy.url", get_engine_url())
target_db = current_app.extensions["migrate"].db


def get_metadata():
    # multi-bind 대응
    if hasattr(target_db, "metadatas"):
        return target_db.metadatas[None]
    return target_db.metadata


def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")

    _import_models()  # ✅ 모델 강제 로드

    context.configure(
        url=url,
        target_metadata=get_metadata(),
        literal_binds=True,
        compare_type=True,
        compare_server_default=True,
        render_as_batch=True,  # ✅ SQLite ALTER 대응
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode."""

    def process_revision_directives(context, revision, directives):
        if getattr(config.cmd_opts, "autogenerate", False):
            script = directives[0]
            if script.upgrade_ops.is_empty():
                directives[:] = []
                logger.info("No changes in schema detected.")

    conf_args = current_app.extensions["migrate"].configure_args
    if conf_args.get("process_revision_directives") is None:
        conf_args["process_revision_directives"] = process_revision_directives

    connectable = get_engine()

    with connectable.connect() as connection:
        _import_models()  # ✅ 모델 강제 로드

        context.configure(
            connection=connection,
            target_metadata=get_metadata(),
            compare_type=True,
            compare_server_default=True,
            render_as_batch=True,  # ✅ SQLite ALTER 대응
            **conf_args,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
