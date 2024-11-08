# Here we define the Schemas , not to be confused with SQL schemas , this is where we check how the data is structured and validated 
# only ensuring that valid data passes thruogh (cleaning data)

from typing import List
from pydantic import BaseModel


################################# Create logic gate template ####################################

class LogicGateBase(BaseModel): #This will also act like the blue print to create the other logic gate objects
    name: str # The name that users choose to identify their logic gate , (e.g. G1, G2)
    type: str # The actual type of the logic gate, (e.g. AND , OR , NOT )
    inputs: List[str] # The inputs of the current logic gate
    output: str # The outputs of the current logic gate

class LogicGateCreate(LogicGateBase): # Create the logic gate object with the blueprint (LogicGateBase) as reference.
    pass

class LogicGate(LogicGateBase): #Create a clone of the blue print (LogicGateBase) to edit with a id attribute added to track it
        id: int

        class Config:
            from_attributes = True 

