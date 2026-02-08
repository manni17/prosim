import json
from pathlib import Path
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class ContentOption(BaseModel):
    label: str
    action_id: str
    impact_hint: str = "Unknown"
    requires_prediction: bool = False

class EventTrigger(BaseModel):
    min_turn: Optional[int] = 0
    max_turn: Optional[int] = 999
    min_revenue: Optional[float] = 0.0
    max_health: Optional[float] = 1.0
    required_focus: Optional[str] = None

class NarrativeContent(BaseModel):
    id: str
    type: str
    sender: str
    subject: str
    body: str
    options: List[ContentOption]
    trigger: Optional[EventTrigger] = Field(default_factory=EventTrigger)

class Intervention(BaseModel):
    id: str
    label: str
    category: str # Engineering, Product, Comms
    description: str
    cost: Dict[str, float] # e.g. {"morale": 0.1}
    efficacy: Dict[str, float] # e.g. {"memory_leak": 1.0}

class ContentManager:
    def __init__(self, level: int = 1):
        self.level = level
        self.emails: List[NarrativeContent] = []
        self.chats: List[NarrativeContent] = []
        self.interventions: List[Intervention] = []
        self.wiki: Dict[str, Any] = {}
        self._load_content()

    def _load_content(self):
        suffix = "" if self.level == 1 else f"_lvl{self.level}"
        self.emails = self._load_file(f"data/content/emails{suffix}.json")
        self.chats = self._load_file(f"data/content/chats{suffix}.json")
        self.interventions = self._load_interventions_file("data/content/interventions.json")
        
        wiki_path = Path("data/content/wiki.json")
        if wiki_path.exists():
            with open(wiki_path, 'r', encoding='utf-8') as f:
                self.wiki = json.load(f)

    def _load_file(self, filepath: str) -> List[NarrativeContent]:
        path = Path(filepath)
        if not path.exists():
            return []
        
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        return [NarrativeContent(**item) for item in data]

    def _load_interventions_file(self, filepath: str) -> List[Intervention]:
        path = Path(filepath)
        if not path.exists():
            return []
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return [Intervention(**item) for item in data]

    def get_content_by_type(self, content_type: str) -> List[NarrativeContent]:
        all_content = self.emails + self.chats
        return [c for c in all_content if c.type == content_type]

    def get_emails(self) -> List[NarrativeContent]:
        return self.emails

    def get_chats(self) -> List[NarrativeContent]:
        return self.chats

    def load_analytics(self, strategy_id: str) -> Dict[str, Any]:
        """Loads the pre-calculated analytics dataset for a specific strategy."""
        path = Path(f"data/analytics/analytics_{strategy_id}.json")
        if not path.exists():
            path = Path("data/analytics/analytics_default.json")
        
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def load_time_series(self, scenario_id: str) -> Dict[str, Any]:
        """Loads a high-resolution time-series dataset."""
        path = Path(f"data/analytics/series_{scenario_id}.json")
        if not path.exists():
            # For now, default to the leak scenario for testing
            path = Path("data/analytics/series_leak.json")
        
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
