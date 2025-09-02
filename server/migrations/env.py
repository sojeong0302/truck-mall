import logging
from logging.config import fileConfig

from flask import current_app
from alembic import context

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


# --- ✅ 모델 강제 import: 오토제너레이트가 모델을 로드하도록 보장 ---
def _import_models():
    """
    프로젝트의 모델 모듈을 여기서 import 해서
    Alembic autogenerate가 메타데이터를 인식하도록 한다.
    실제 경로/파일명에 맞게 수정해도 됨.
    """
    try:
        import server.models.sale  # ← 예: server/models/sale.py
        import server.models.performance_model  # ← 예: server/models/performance_model.py
    except ModuleNotFoundError:
        # 대안 경로(필요 시 추가/수정)
        try:
            import models.sale
            import models.performance_model
        except ModuleNotFoundError:
            # 그래도 실패하면 여기서 경로를 네 프로젝트 구조에 맞게 수정해줘.
            pass


# SQLAlchemy URL 주입
config.set_main_option("sqlalchemy.url", get_engine_url())
target_db = current_app.extensions["migrate"].db


def get_metadata():
    # Flask-Migrate가 multi-bind를 쓸 때 대응
    if hasattr(target_db, "metadatas"):
        return target_db.metadatas[None]
    return target_db.metadata


def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")

    # ✅ 모델 로드
    _import_models()

    context.configure(
        url=url,
        target_metadata=get_metadata(),
        literal_binds=True,
        compare_type=True,
        compare_server_default=True,
        render_as_batch=True,  # SQLite 안전
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode'."""

    # 자동 생성 시 변경 없을 때 리비전 생성을 막는 콜백
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
        # ✅ 모델 로드
        _import_models()

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
