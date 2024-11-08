from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, Integer, String

DATABASE_URL = "postgresql+psycopg2://logic_user:12345678@localhost/logic_gate_app"

engine = create_engine(DATABASE_URL) #Declaration of db
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


#Allowing the user to use the DB and finally closing it after user is done.
def get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

