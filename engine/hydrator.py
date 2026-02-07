import json
from pathlib import Path
from typing import List, Dict, Tuple
from pydantic import BaseModel

class ActionCost(BaseModel):
    health: List[float] = [] # [min, max]
    morale: List[float] = []
    trust: List[float] = []
    traffic: List[int] = []
    conversion_rate: List[float] = []
    average_order_value: List[float] = []
    cart_rate: List[float] = []
    checkout_rate: List[float] = []
    payment_rate: List[float] = []

class ActionReward(BaseModel):
    score: List[int] = [] # [min, max]
    morale: List[float] = []
    trust: List[float] = []
    traffic: List[int] = []
    conversion_rate: List[float] = []
    average_order_value: List[float] = []
    cart_rate: List[float] = []
    checkout_rate: List[float] = []
    payment_rate: List[float] = []

class ScenarioAction(BaseModel):
    id: str
    label: str
    cost: ActionCost
    reward: ActionReward
    description: str

class Scenario(BaseModel):
    phase_id: int
    title: str
    description: str
    actions: List[ScenarioAction]

from engine.content import ContentManager

def load_content() -> ContentManager:
    """Initializes and returns the ContentManager with loaded narratives."""
    return ContentManager()

def load_scenario(phase: int) -> Scenario:
    path = Path(f"data/scenarios/phase_{phase}.json")
    if not path.exists():
        raise FileNotFoundError(f"Scenario for phase {phase} not found at {path}")
    
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    return Scenario(**data)
