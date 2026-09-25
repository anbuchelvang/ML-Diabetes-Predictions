import os
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def get_database_uri(base_dir):
    """
    Returns database URI. Defaults to SQLite for local ease-of-use,
    or picks up MYSQL_DATABASE_URI from environment variables if set.
    """
    mysql_uri = os.environ.get("MYSQL_DATABASE_URI")
    if mysql_uri:
        return mysql_uri
    
    db_dir = os.path.join(base_dir, "database")
    os.makedirs(db_dir, exist_ok=True)
    sqlite_path = os.path.join(db_dir, "diabetes_app.db")
    return f"sqlite:///{sqlite_path}"
