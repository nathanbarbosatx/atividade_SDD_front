# Tasks: Pomodoro Progress Ring

Phase 1: Implementation (only tasks required for the green responsive ring and validation)

- [ ] T001 [US1] Implement SVG progress ring inside src/components/TimerDisplay.jsx that visually represents secondsRestantes / (25*60). The ring must use viewBox="0 0 100 100", two circles (track + progress), be rotated -90deg so it starts at the top, and the progress circle must set stroke-dasharray and stroke-dashoffset based on circumference to show fraction = secondsRestantes / (25*60). Do not change any timer logic or props; read only the existing segundosRestantes prop.
- [ ] T002 [US1] Add CSS rules in src/App.css to style the ring: responsive sizing (container scales with viewport), track color #e5e7eb, progress color #16a34a, stroke-linecap: round, and transition: stroke-dashoffset 0.3s linear for smooth per-second updates. Ensure the SVG scales and the ring remains centered around the time text.
- [ ] T003 [US1] Center the formatted time text inside src/components/TimerDisplay.jsx over the SVG ring (use absolute positioning or grid) and ensure the font-size is responsive (use clamp() or relative units) in src/App.css. Keep the existing time formatting and do not modify timer behaviour.
- [ ] T004 [US1] Add a single-line code comment in src/components/TimerDisplay.jsx near the visual calculation indicating the ring uses segundosRestantes for visual only and does not affect timer/state logic.

Phase 2: Validation (mobile and desktop)

- [ ] T005 [US1] Manual validation (desktop): Verify that at 25:00 the ring is fully filled, the ring decreases smoothly each second (0.3s transition), at 00:00 the ring is empty, and when the user triggers desist/reset the ring returns to full. Record any visual regressions.
- [ ] T006 [US1] Manual validation (mobile): Repeat the same checks on a narrow viewport (<420px). Verify the time remains centered, legible, and the ring scales without clipping. Record screenshots if any issue.

Dependencies

- All implementation tasks (T001-T004) must complete before manual validation tasks T005 and T006.

Notes

- Use the existing segundosRestantes prop provided by src/components/TimerDisplay.jsx — do not add new props or modify timer logic, API calls, ranking, or other features.
- Place all style changes only in src/App.css as requested.
