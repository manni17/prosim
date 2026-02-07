import sys
import traceback
from pathlib import Path
import click
from rich.console import Console
from rich.layout import Layout
from rich.panel import Panel
from rich.table import Table
from rich.text import Text
from rich.align import Align

# Ensure engine is in path
sys.path.append(str(Path(__file__).parent))

from engine.state import load_game
from engine.controller import SimulationController
from engine.hydrator import load_scenario
from engine.logger import TelemetryLogger

console = Console()

@click.group()
def cli():
    """proSIM CLI: Professional Simulation Engine"""
    pass

@cli.command()
def init():
    """Reset the game state."""
    state_file = Path("data/state.json")
    if state_file.exists():
        state_file.unlink()
    console.print("[green]Game state reset.[/green]")

@cli.command()
def status():
    """Display current game state in a 4-Quadrant Grid."""
    try:
        state = load_game()
        scenario = load_scenario(state.phase)
        
        # Create Layout
        layout = Layout()
        layout.split_column(
            Layout(name="header", size=3),
            Layout(name="grid", size=10),
            Layout(name="history")
        )
        
        # Header
        header_text = f"[bold cyan]proSIM OS - {scenario.title} (Phase {state.phase})[/bold cyan]"
        if state.status != 'ACTIVE':
            header_text = f"[bold red]GAME OVER: {state.status}[/bold red]"
            
        layout["header"].update(
            Panel(Align.center(header_text), style="cyan" if state.status == 'ACTIVE' else "red")
        )
        
        # 4-Quadrant Grid
        grid = layout["grid"]
        grid.split_row(
            Layout(name="left"),
            Layout(name="right")
        )
        grid["left"].split_column(
            Layout(name="q2", ratio=1), # Top Left
            Layout(name="q3", ratio=1)  # Bottom Left
        )
        grid["right"].split_column(
            Layout(name="q1", ratio=1), # Top Right
            Layout(name="q4", ratio=1)  # Bottom Right
        )
        
        def make_metric_panel(title, value, color):
            return Panel(
                Align.center(f"[bold {color}]{value:.2f}[/bold {color}]", vertical="middle"),
                title=f"[{color}]{title}[/{color}]",
                border_style=color
            )
        
        # Q2 Top Left: Morale (Blue)
        grid["left"]["q2"].update(make_metric_panel("MORALE (Chat)", state.morale, "blue"))
        # Q1 Top Right: Health (Green)
        grid["right"]["q1"].update(make_metric_panel("HEALTH (System)", state.health, "green"))
        # Q3 Bottom Left: Trust (Magenta)
        grid["left"]["q3"].update(make_metric_panel("TRUST (Inbox)", state.trust, "magenta"))
        # Q4 Bottom Right: Score (Yellow) - Cast to float for consistency
        grid["right"]["q4"].update(make_metric_panel("SCORE (KPIs)", float(state.points.get("score", 0)), "yellow"))

        # History Log
        history_table = Table(title="Action History", box=None, expand=True)
        history_table.add_column("Turn", justify="right", style="dim")
        history_table.add_column("Timestamp", style="dim")
        history_table.add_column("Action", style="bold")
        history_table.add_column("Delta (H/M/T/S)")
        
        # Show last 10 entries
        for entry in state.history[-10:]:
             # Handle backward compatibility
            if isinstance(entry, str):
                history_table.add_row("?", "?", entry, "?")
            else:
                m = entry.metrics
                delta_str = (
                    f"H:{m.get('health_delta', 0):+.2f} "
                    f"M:{m.get('morale_delta', 0):+.2f} "
                    f"T:{m.get('trust_delta', 0):+.2f} "
                    f"S:{m.get('score_delta', 0):+.0f}"
                )
                history_table.add_row(
                    str(entry.turn_index),
                    entry.timestamp.split("T")[1][:8],
                    entry.action_id.upper(),
                    delta_str
                )

        layout["history"].update(Panel(history_table, title="Telemetry Log", border_style="dim"))
        
        console.print(layout)
        
        # Available Actions Footer
        actions_text = Text("\nAvailable Commands: ", style="bold")
        for action in scenario.actions:
            actions_text.append(f"prosim turn --type {action.id}", style="cyan")
            actions_text.append(" | ")
        console.print(actions_text)
        
    except Exception as e:
        console.print(f"[bold red]Error loading status:[/bold red] {e}")
        traceback.print_exc()

@cli.command()
@click.option('--type', 'action_type', required=True, help="Type of action to perform.")
def turn(action_type):
    """Execute a game turn."""
    try:
        state = load_game()
        
        if state.status != 'ACTIVE':
            console.print(Panel(Align.center(f"[bold red]COMMAND BLOCKED: Game is {state.status}[/bold red]"), title="System Error", style="red"))
            sys.exit(1)
        
        # Validate action against scenario BEFORE initializing controller or attempting turn
        scenario = load_scenario(state.phase)
        valid_actions = [a.id for a in scenario.actions]
        
        if action_type not in valid_actions:
             console.print(f"[bold red]Invalid action:[/bold red] '{action_type}'. Valid actions: {', '.join(valid_actions)}")
             sys.exit(1)

        controller = SimulationController(state)
        controller.execute_turn({"type": action_type})
        
        # Show brief status update
        console.print(f"[green]Turn executed: {action_type.upper()}[/green]")
        console.print(f"Health: {state.health:.2f} | Score: {state.points.get('score', 0)}")
        
    except Exception as e:
        console.print(f"[bold red]Execution failed:[/bold red] {e}")
        sys.exit(1)

if __name__ == "__main__":
    cli()
