from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas # Import the models.py and schemas.py python files
from .database import engine, get_db #Import the engine and get_db function from database.py
import app.db_init
from .db_init import initialize_database
import json

# Run virtual environment before running Swagger UI 

#Initialize the database 
initialize_database()

app = FastAPI()

@app.post("/logicgates/", response_model=schemas.LogicGate) # POST request using FAST API
# define the function called create_logic_gate where the perimeter is gate and the database is session
def create_logic_gate(gate: schemas.LogicGateCreate, db: Session = Depends(get_db)): 

    # Check if inputs is a list as inputs expect a List of Strings
    if not isinstance(gate.inputs, list):
        raise HTTPException(status_code=400, detail="Inputs must be a list")

    db_gate = models.LogicGate(
        name=gate.name,
        type=gate.type,
        inputs=gate.inputs,  # Inputs is already a list, so this is fine
        output=gate.output
    )
    db.add(db_gate) #Adding the logic gate to the database
    db.commit() # commit after done creating
    db.refresh(db_gate) 
    return db_gate

@app.get("/logicgates/{gate_id}", response_model=schemas.LogicGate) # GET request using FAST API
# Define the function to read the specific logic gate defined by gate_id 
def read_logic_gate(gate_id: int, db: Session = Depends(get_db)):
    db_gate = db.query(models.LogicGateModel).filter(models.LogicGateModel.id == gate_id).first() 
    if db_gate is None: 
        raise HTTPException(status_code=404, detail="Logic gate not found") 
    if isinstance(db_gate.inputs, str):
        try:
            db_gate.inputs = json.loads(db_gate.inputs)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Failed to parse inputs JSON")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Logic Gate API!"}
