from sqlalchemy import Column, Integer, String, JSON
from .database import Base

#Create the table 
class LogicGate(Base):
        __tablename__ = "logic_gates"

        id = Column(Integer, primary_key=True, index=True)
        name = Column(String, index=True)
        type = Column(String, index=True)
        inputs = Column(JSON)
        output = Column(String)
        svg_data = Column(String) # Meta data to help recreate the SVG