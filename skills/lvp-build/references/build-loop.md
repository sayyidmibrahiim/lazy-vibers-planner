# Build Loop Reference

Companion to `/lvp-build`. The bundle is the contract; the build loop is the proof. A milestone is done only when its recorded verification procedure passes with captured output.

## 1. Preflight

Before the first milestone:

- [ ] `state.json` parses; `pipeline.sections.S8` and `S9` are done; scope is locked.
- [ ] Every entry of `state.milestones[]` has an id that also exists in `MILESTONES.md`.
- [ ] Every milestone in `MILESTONES.md` has a matching procedure in `VERIFICATION.md`.
- [ ] `AGENTS.md`, `DECISIONS.md`, `CODE_STYLE.md`, `SECURITY.md`, and `HANDOVER.md` exist and are non-empty.
- [ ] No open blocking finding from the latest `.lvp/recheck/RECHECK-*.md`.

A failed preflight item is a `build_blocked` with the owning skill named. Do not start coding around a broken plan.

## 2. Milestone selection

1. Read `state.milestones[]` in order.
2. Select the first entry where `verified` is not `true`.
3. Never re-run a verified milestone. Never reorder milestones.
4. If every milestone is verified: verify deployment once more, then close `build_done` and point at `/lvp-personal-brand`.

## 3. Verification protocol

For the selected milestone:

1. Read its goal, deliverables, acceptance criteria, and verification procedure.
2. Implement the deliverables in the project folder, following `CODE_STYLE.md` and `SECURITY.md`. Never edit bundle documents to make a check pass.
3. Run the procedure exactly as written: same command, same working directory, same environment. No substitutions.
4. Capture, per command:
   - the exact command line;
   - exit code;
   - full stdout/stderr (trim only repeated noise, never the failing lines);
   - timestamp.
5. Compare with the expected output. A partial match, a skipped assertion, or "it probably works" is a failure.

If the recorded procedure is wrong or impossible (for example the command does not exist on this stack), do not invent a replacement. Mark the milestone `blocked`, report the procedure defect, and recommend `/lvp-recheck-plan` (R3.3) — a wrong verification is a bundle finding, not a build decision.

## 4. Failure ladder

1. First failure → fix the cause inside the milestone's scope, re-run the same procedure. Journal `milestone_failed` with the attempt number and the decisive output line.
2. Second failure → inspect the assumption that might be wrong before editing again. If the plan itself is wrong, stop.
3. Third attempt is not allowed. Journal `build_blocked`, keep the milestone unverified, and stop the build loop with a plain report: what failed, the exact command, the output, the suspected cause, and the next owner (`user`, `/lvp-recheck-plan`, or `/lvp-add-feature`).

Never weaken a check, delete an assertion, or mark a partial pass to move on.

## 5. Recording results

Append to `VERIFICATION.md`; never rewrite earlier entries.

~~~~markdown
## Build log — <YYYY-MM-DDTHH:MM:SSZ>

### M<n> — <name> — PASS | FAIL
- Attempt: <n>
- Command: `<exact command>`
- Exit code: <n>
- Output:
```text
<captured output>
```
- Result: <which acceptance criteria passed/failed>
- State: verified at <ts> | blocked, owner <skill/user>
~~~~

Then, on PASS only: set `state.milestones[i].verified = true` and `verified_at`, journal `milestone_verified`, regenerate nothing else. `blueprint.json` stays derived; `/lvp-handoff` refreshes it at the end.

## 6. Deployment milestone

The milestone that deploys the product ends with a live check:

- Open the deployed URL; require the expected HTTP status (usually 200).
- Check one user-visible fact from the milestone's acceptance criteria (expected text, a working API response, a rendered page element).
- Record the URL, status, and captured evidence in `VERIFICATION.md`.
- On pass: set `state.deployment = { "status": "live", "url": "<url>", "verified_at": "<ts>" }`, journal `deployment_verified`.
- A deployment that cannot be checked (no public URL, auth wall) is not live: mark `pending` and say exactly what evidence is missing.

## 7. Anti-cheating rules

- The verification command is part of the contract; changing it to pass is a failure.
- Test fixtures may be added; assertions and expected outputs may not be weakened.
- A green build with a modified verification procedure is worse than a red build with the original procedure.
- `.lvp/` writes are limited to `milestones[].verified`, `verified_at`, `deployment`, and journal appends. Everything else is read-only.
