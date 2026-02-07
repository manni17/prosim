# App Integration Guide: proSIM OS

This guide explains how to add a new high-fidelity application to the proSIM interface, following the "Steller Glass" architecture pattern detected in the `stellar-glass-desk-main` codebase.

## How to Add a New App (e.g., "BudgetTracker")

### 1. The Component (The App Content)
* **File to Create:** `src/components/apps/BudgetTracker.tsx`
* **Style Pattern:** Use `glass-card` for internal containers and standard Tailwind `text-display`/`text-body` classes for typography.

### 2. The Icon (Dock)
* **File to Modify:** `src/components/os/Dock.tsx`
* **Code Pattern:**
  Add a new entry to the `dockItems` array:
  ```typescript
  import { WalletIcon } from "lucide-react"; // Import appropriate icon

  const dockItems = [
    // ... existing items
    { id: "budget", icon: WalletIcon, label: "Budget" },
  ];
  ```

### 3. The Registration (Window Manager)
* **File to Modify:** `src/pages/Index.tsx`
* **Code Pattern:**
  1. Import your component.
  2. Add it to the `apps` record:
  ```typescript
  import { BudgetTracker } from "@/components/apps/BudgetTracker";

  const apps: Record<string, { title: string; component: React.ReactNode }> = {
    // ... existing apps
    budget: { title: "Budget Tracker", component: <BudgetTracker /> },
  };
  ```

### 4. Styling Tokens (Reference)
When building the app UI, use the following core classes to maintain consistency:
* **Backgrounds:** `bg-[hsl(var(--glass-card))]`
* **Hover States:** `bg-[hsl(var(--glass-hover))]`
* **Borders:** `border-[hsl(var(--glass-border-subtle))]`
* **Typography:** 
  - Primary: `text-[hsl(var(--text-primary))]`
  - Secondary: `text-[hsl(var(--text-secondary))]`
  - Inverse: `text-[hsl(var(--text-inverse))]`
