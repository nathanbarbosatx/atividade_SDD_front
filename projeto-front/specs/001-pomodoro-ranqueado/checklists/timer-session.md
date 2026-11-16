# Timer & Session Requirements Quality Checklist: Pomodoro Ranqueado

**Purpose**: Lightweight pre-commit review of timer/session and interruption requirement quality
**Created**: 2026-11-16
**Feature**: specs/001-pomodoro-ranqueado/spec.md

**Review Ownership**: This checklist is a reviewer-owned requirements-quality review artifact. Mark an item `[x]` only when the reviewer determines the requirements-quality criterion is satisfied.
**Marker Semantics**: `[x]` means the criterion has been reviewed and satisfied for requirements quality. It does not mean implementation work is complete.

## Requirement Completeness

- [ ] CHK001 Are all preconditions for starting a focus session (e.g., valid participant name) fully specified? [Completeness, Spec §FR-001, §FR-002, User Story 1]
- [ ] CHK002 Are requirements defined for the timer’s initial state, running state, and end-of-session state? [Completeness, Spec §FR-003, User Story 1]
- [ ] CHK003 Are all user-visible outcomes of selecting "Desistir" during an active session explicitly documented? [Completeness, Spec §FR-004, §FR-005, User Story 3]
- [ ] CHK004 Are requirements specified for what happens to session state after interruption (e.g., return/reset behavior)? [Completeness, Gap, User Story 3]

## Requirement Clarity

- [ ] CHK005 Is "contagem regressiva de 25 minutos" defined with unambiguous start/end conditions and display expectations? [Clarity, Spec §FR-003]
- [ ] CHK006 Is the required desist feedback message specified as an exact, immutable string including context of when it must appear? [Clarity, Spec §FR-005, User Story 3]
- [ ] CHK007 Is the term "sessão em andamento" clearly bounded so start/stop eligibility is unambiguous? [Clarity, Spec §FR-004, Edge Cases]

## Requirement Consistency

- [ ] CHK008 Do interruption requirements consistently prohibit any partial-time persistence across stories, FRs, and edge cases? [Consistency, Spec §FR-006, User Story 3, SC-003]
- [ ] CHK009 Are name-validation requirements consistent between "Iniciar Foco" prevention and session-start preconditions? [Consistency, Spec §FR-002, User Story 1]

## Scenario & Edge Case Coverage

- [ ] CHK010 Are requirements defined for preventing or handling attempts to run more than one simultaneous session? [Coverage, Spec §Edge Cases]
- [ ] CHK011 Are requirements specified for user actions on timer controls when no session is active or after a session ends/is interrupted? [Coverage, Gap]
- [ ] CHK012 Are boundary/transition scenarios at timer completion (e.g., completion vs. desist at/near end) unambiguously addressed? [Coverage, Edge Case, Gap]

## Acceptance Criteria & Measurability

- [ ] CHK013 Can "o timer não é iniciado" on invalid name be objectively verified from specified UI/system outcomes? [Measurability, Spec §FR-002, User Story 1]
- [ ] CHK014 Are acceptance criteria sufficient to objectively confirm that an interrupted session produces no persistence side effects? [Measurability, Spec §FR-006, User Story 3, SC-003]

## Dependencies & Assumptions

- [ ] CHK015 Are assumptions about timer accuracy/continuity (e.g., foreground/tab behavior) documented or explicitly scoped out for this version? [Assumption, Gap]

## Notes

- Mark items `[x]` only after review confirms the requirement-quality criterion is satisfied
- Leave items unchecked when they still require clarification, correction, or reviewer evaluation
- `/speckit.implement` reads checklist checkbox state as a gate and must not modify markers
- Focus: timer/session behavior and interruption rules (Q1:C), lightweight author pass (Q2:A), no extra emphasis (Q3:none)
