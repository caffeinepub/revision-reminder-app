# Specification

## Summary
**Goal:** Update spaced repetition intervals to 1-day, 3-day, 7-day, 1-month, 3-month and display due dates alongside each reminder in the UI.

**Planned changes:**
- Update backend interval set from (1-day, 3-day, 30-day, 3-month) to (1-day, 3-day, 7-day, 1-month, 3-month), including all scheduling logic and label strings in `backend/main.mo`
- Update the DueReminders frontend component to show the new interval badges and a human-readable due date/time label per reminder (e.g., "Due today", "Overdue by 1 day", "Due in 3 days")
- Update the TopicManager component and any other frontend sections that list intervals to show all five intervals with their formatted scheduled due dates
- Remove all references to the old "30-day" interval from both backend and frontend

**User-visible outcome:** Users see five reminder intervals (1-day, 3-day, 7-day, 1-month, 3-month) throughout the app, and each reminder card clearly shows when it is due or how overdue it is.
