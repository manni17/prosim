import random
import copy
from typing import Any, Dict, Optional, List
from datetime import datetime
from engine.state import GameState, save_game
from engine.hydrator import load_scenario
from engine.logger import TelemetryLogger
from engine.content import ContentManager, NarrativeContent

class SimulationController:
    def __init__(self, state: GameState):
        self.state = state
        self.rng = random.Random(state.seed)
        self.scenario = load_scenario(state.phase)
        self.logger = TelemetryLogger(state)
        
        # Load Narrative Content based on Level
        self.content_manager = ContentManager(level=state.current_level)
        self.all_emails = self.content_manager.get_emails()
        self.all_chats = self.content_manager.get_chats()
        
        # Dynamic inbox/chats list
        self.inbox: List[NarrativeContent] = []
        self.chats: List[NarrativeContent] = []
        
        self._process_triggers()

    def advance_level(self) -> None:
        """Transitions the simulation to the next level."""
        self.state.current_level += 1
        self.state.status = "ACTIVE"
        
        # Reset temporal logs
        self.state.history = []
        self.state.events = []
        self.state.delivered_event_ids = []
        
        # Re-initialize content
        self.content_manager = ContentManager(level=self.state.current_level)
        self.all_emails = self.content_manager.get_emails()
        self.all_chats = self.content_manager.get_chats()
        self._process_triggers()
        
        save_game(self.state)

    def complete_tutorial(self) -> None:
        """Marks onboarding as complete."""
        self.state.tutorial_complete = True
        save_game(self.state)

    def commit_strategy(self, focus_id: str) -> None:
        """Applies quarterly focus modifiers and advances level."""
        if self.state.status != "REVIEW":
            raise ValueError("Strategy commitment only allowed during REVIEW phase.")

        self.state.quarterly_focus = focus_id
        mods = self.state.physics_modifiers

        if focus_id == "blitzscale":
            mods["traffic"] *= 1.3
            mods["cost"] *= 1.1 
        elif focus_id == "fortify":
            mods["cost"] *= 0.8 
            mods["traffic"] *= 0.9
        elif focus_id == "monetize":
            mods["aov"] *= 1.2
            mods["conv"] *= 0.95

        self.advance_level()
        print(f"Strategy {focus_id} committed. Level {self.state.current_level} active.")

    def _process_triggers(self) -> None:
        """Filters all narrative content against the current GameState."""
        turn_idx = len(self.state.history)
        
        def is_triggered(content: NarrativeContent) -> bool:
            t = content.trigger
            # Basic checks
            if turn_idx < t.min_turn or turn_idx > t.max_turn: return False
            if self.state.revenue < t.min_revenue: return False
            if self.state.health > t.max_health: return False
            if t.required_focus and t.required_focus != self.state.quarterly_focus: return False
            
            # Check if already acted upon
            acted_ids = [entry.action_id for entry in self.state.history]
            option_ids = [opt.action_id for opt in content.options]
            
            if len(option_ids) > 0 and any(oid in acted_ids for oid in option_ids):
                return False
                
            return True

        self.inbox = [e for e in self.all_emails if is_triggered(e)]
        self.chats = [c for c in self.all_chats if is_triggered(c)]

    def track(self, event_name: str, properties: Dict[str, Any]) -> None:
        """Appends a new event to the state event stream."""
        event = {
            "event_name": event_name,
            "timestamp": datetime.now().isoformat(),
            "properties": properties
        }
        self.state.events.append(event)

    def execute_turn(self, decision_data: Dict[str, Any]) -> None:
        if self.state.status != 'ACTIVE':
            raise ValueError(f"Turn blocked: Status is {self.state.status}")

        backup_state = copy.deepcopy(self.state)
        prediction = decision_data.get("prediction") # qualitative forecast
        
        try:
            action_id = decision_data.get("type")
            action_def = next((a for a in self.scenario.actions if a.id == action_id), None)
            if not action_def: raise ValueError(f"Unknown action: {action_id}")
            
            if action_id in ["floodgate", "velvet", "frictionless"]:
                self.state.strategy_archetype = action_id
            
            self.track("turn_start", {"action_id": action_id, "turn_index": len(self.state.history) + 1})

            # Capture baseline for prediction verification
            pre_revenue = self.state.revenue
            pre_trust = self.state.trust

            mods = self.state.physics_modifiers

            def get_val(rng_range: list[float], is_cost: bool) -> float:
                if not rng_range: return 0.0
                val = self.rng.uniform(rng_range[0], rng_range[1])
                if is_cost:
                    return -val * mods["cost"]
                return val

            def get_int_val(rng_range: list[int], multiplier: float = 1.0) -> int:
                if not rng_range: return 0
                return int(self.rng.randint(rng_range[0], rng_range[1]) * multiplier)

            health_delta = get_val(action_def.cost.health, is_cost=True)
            morale_delta = get_val(action_def.cost.morale, is_cost=True) + get_val(action_def.reward.morale, is_cost=False)
            trust_delta = get_val(action_def.cost.trust, is_cost=True) + get_val(action_def.reward.trust, is_cost=False)
            
            traffic_delta = get_int_val(action_def.reward.traffic, mods["traffic"]) - get_int_val(action_def.cost.traffic)
            aov_delta = get_val(action_def.reward.average_order_value, is_cost=False) * mods["aov"] - get_val(action_def.cost.average_order_value, is_cost=True)
            
            cart_delta = get_val(action_def.reward.cart_rate, is_cost=False) - get_val(action_def.cost.cart_rate, is_cost=True)
            checkout_delta = get_val(action_def.reward.checkout_rate, is_cost=False) - get_val(action_def.cost.checkout_rate, is_cost=True)
            payment_delta = get_val(action_def.reward.payment_rate, is_cost=False) - get_val(action_def.cost.payment_rate, is_cost=True)

            self.state.health = max(0.0, min(1.0, self.state.health + health_delta))
            self.state.morale = max(0.0, min(1.0, self.state.morale + morale_delta))
            self.state.trust = max(0.0, min(1.0, self.state.trust + trust_delta))
            self.state.traffic = max(0, self.state.traffic + traffic_delta)
            self.state.average_order_value = max(0.0, self.state.average_order_value + aov_delta)
            
            self.state.cart_rate = max(0.0, min(1.0, self.state.cart_rate + cart_delta))
            self.state.checkout_rate = max(0.0, min(1.0, self.state.checkout_rate + checkout_delta))
            self.state.payment_rate = max(0.0, min(1.0, self.state.payment_rate + payment_delta))
            
            self._calculate_churn()
            self._recalculate_revenue()
            
            # --- Prediction Verification (WEB-24) ---
            if prediction:
                results = {}
                score_gain = 0
                
                # Check Revenue
                rev_delta = self.state.revenue - pre_revenue
                rev_dir = "increase" if rev_delta > 0 else "decrease" if rev_delta < 0 else "neutral"
                if prediction.get("revenue") == rev_dir:
                    score_gain += 10
                    results["revenue"] = "CORRECT"
                else:
                    results["revenue"] = "INCORRECT"
                
                # Check Trust
                trust_delta = self.state.trust - pre_trust
                trust_dir = "increase" if trust_delta > 0.001 else "decrease" if trust_delta < -0.001 else "neutral"
                if prediction.get("trust") == trust_dir:
                    score_gain += 10
                    results["trust"] = "CORRECT"
                else:
                    results["trust"] = "INCORRECT"
                
                self.state.product_sense_score += score_gain
                self.state.last_prediction_results = {
                    "results": results,
                    "score_gain": score_gain,
                    "actual": {"revenue": rev_dir, "trust": trust_dir}
                }
            else:
                self.state.last_prediction_results = None

            self.logger.log_turn(action_id, {"health_delta": health_delta, "revenue": self.state.revenue})

            self._process_triggers()
            self.check_game_over()
            
            if len(self.state.history) >= 12 and self.state.status == "ACTIVE":
                self.state.status = "REVIEW"

            save_game(self.state)

        except Exception as e:
            print(f"Error executing turn: {e}")
            self.state = backup_state

    def _calculate_churn(self) -> None:
        """Calculates user churn and updates active user base (SYS-11)."""
        base_churn = 0.05
        # Penalty: Low trust causes high churn. Low health causes slight churn (neglect).
        dynamic_churn = base_churn + (1.0 - self.state.trust) * 0.15 + (1.0 - self.state.health) * 0.05
        self.state.churn_rate = max(0.0, min(1.0, dynamic_churn))
        
        lost_users = int(self.state.active_users * self.state.churn_rate)
        
        # New users come from current turn's traffic * conversion
        # (We use the pre-calculated conversion rate or a simplified one)
        new_users = int(self.state.traffic * self.state.conversion_rate)
        
        self.state.active_users = max(0, self.state.active_users - lost_users + new_users)

    def _recalculate_revenue(self) -> None:
        visitors = self.state.traffic
        conv_mult = self.state.physics_modifiers["conv"]
        carts = visitors * self.state.cart_rate
        checkouts = carts * self.state.checkout_rate
        purchases = checkouts * self.state.payment_rate * conv_mult
        
        if visitors > 0:
            self.state.conversion_rate = purchases / visitors
        else:
            self.state.conversion_rate = 0.0
            
        # Revenue = (Recurring from Active Users) + (Transactional from New Purchases)
        subscription_fee = 10.0 # Standard ARPU
        recurring_rev = self.state.active_users * subscription_fee
        transactional_rev = purchases * self.state.average_order_value
        
        self.state.revenue = recurring_rev + transactional_rev

    def check_game_over(self) -> None:
        if self.state.status != 'ACTIVE':
            return

        new_status = 'ACTIVE'
        reason = ""
        details = {}

        if self.state.revenue >= 100000:
            new_status = 'VICTORY'
            reason = "Target reached!"
            details = {
                "cause": "Mission Accomplished",
                "notes": "The board is impressed with your aggressive growth strategy. IPO discussions have begun."
            }
        elif self.state.health <= 0:
            new_status = 'GAME_OVER'
            reason = "Burnout."
            details = {
                "cause": "Medical Leave",
                "notes": "You have been found unresponsive at your desk. Burnout has reached critical levels requiring immediate hospitalization."
            }
        elif self.state.trust <= 0:
            new_status = 'GAME_OVER'
            reason = "Fired."
            details = {
                "cause": "Gross Negligence",
                "notes": "Stakeholder confidence has collapsed. The Board has voted 7-0 to terminate your contract immediately."
            }
        elif self.state.morale <= 0:
            new_status = 'GAME_OVER'
            reason = "Mutiny."
            details = {
                "cause": "Team Mutiny",
                "notes": "Your engineering team has resigned en masse. There is no one left to maintain the platform."
            }
            
        if new_status != 'ACTIVE':
            self.state.status = new_status
            self.state.termination_details = details
            
            system_msg = NarrativeContent(
                id=f"sys_{new_status.lower()}",
                type="system",
                sender="SYSTEM",
                subject=f"TERMINATION: {new_status}",
                body=f"Your simulation has concluded. Result: {new_status}. {reason}",
                options=[]
            )
            self.inbox.insert(0, system_msg)
            save_game(self.state)

    def execute_intervention(self, action_id: str) -> Dict[str, Any]:
        if self.state.status != 'ACTIVE':
            raise ValueError(f"Action blocked: Status is {self.state.status}")

        intervention = next((i for i in self.content_manager.interventions if i.id == action_id), None)
        if not intervention: raise ValueError(f"Unknown intervention: {action_id}")
        
        max_efficacy = 0.0
        for risk in self.state.active_risks:
            eff = intervention.efficacy.get(risk, 0.0)
            if eff > max_efficacy: max_efficacy = eff

        costs = intervention.cost
        self.state.health = max(0.0, self.state.health - costs.get("health", 0.0) * self.state.physics_modifiers["cost"])
        self.state.morale = max(0.0, self.state.morale - costs.get("morale", 0.0) * self.state.physics_modifiers["cost"])
        self.state.trust = max(0.0, self.state.trust - costs.get("trust", 0.0) * self.state.physics_modifiers["cost"])
        self.state.revenue = max(0.0, self.state.revenue - costs.get("revenue", 0.0))

        if max_efficacy > 0.5:
            self.state.active_risks = [r for r in self.state.active_risks if intervention.efficacy.get(r, 0.0) <= 0.5]

        self.track("intervention", {"action_id": action_id, "efficacy": max_efficacy})
        self.check_game_over()
        save_game(self.state)
        return {"label": intervention.label, "efficacy": max_efficacy, "effectiveness": "HIGH" if max_efficacy > 0.7 else "NONE"}