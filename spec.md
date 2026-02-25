# Specification

## Summary
**Goal:** Build a Revision Reminder app with spaced repetition scheduling, due reminder tracking, and a study growth chart, styled as a calm study-focused UI.

**Planned changes:**
- Add a Motoko backend actor that stores topics with spaced repetition reminder schedules (1-day, 3-day, 30-day, 3-month intervals), tracks due/completed reminders, and logs revision sessions with timestamps and counts
- Expose backend API: `addTopic`, `getTopics`, `getDueReminders`, `markReminderDone`, `getStudyProgress`
- Build a topic management section with a text input and "Add Topic" button, displaying all added topics in a list
- Build a due reminders section showing each overdue topic and its interval label, with a "Mark as Revised" button per reminder and an empty-state message when none are due
- Build a cumulative study growth line chart sourced from `getStudyProgress`, updating after each revision, with a placeholder when no data exists
- Apply a warm parchment/cream background theme with forest green and amber accents, serif headings, sans-serif body text, and card-based layout with subtle shadows throughout

**User-visible outcome:** Users can add study topics, see which ones are due for revision based on spaced repetition intervals, mark them as revised, and track their cumulative study progress on a line chart — all in a calm, readable study-app interface.
