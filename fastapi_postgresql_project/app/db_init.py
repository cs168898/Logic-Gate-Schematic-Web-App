from .database import Base, engine
from . import models


def initialize_database():
    Base.metadata.create_all(bind=engine)
