# WEB-21: Exportable Credentials

## Goal
Enable students to save and share their simulation results as a tangible artifact ("Proof of Work").

## Technical Strategy
- **Library:** `html2canvas` (Client-side generation).
- **Target:** The main container of the `ReportCard` component.
- **Output:** A high-quality PNG image named `prosim_report_[date].png`.

## UI/UX
- **Button:** Add an "Export Record" button to the Report Card interface.
- **Styling:** Use a "Print/Download" icon style, distinct from the "Restart" primary action.
- **Feedback:** Show a temporary "Generating..." state or toast notification during canvas rendering.

## Implementation Details
1.  **Ref:** Use a React `useRef` to target the capture area.
2.  **Config:** Configure `html2canvas` to handle glassmorphism transparency (backgroundColor: null) and high pixel ratio.
3.  **Trigger:** Standard browser download trigger via a temporary `<a>` tag.
