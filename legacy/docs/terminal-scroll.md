# xterm touch scrollback — 2026-10-24 UTC

The user reported that touch could move the terminal window by its bar, but
swiping terminal text did not scroll history. A trusted Chrome touch gesture
against the live b109 release reproduced the failure: the actual xterm buffer's
viewport did not move. The retained reproduction is
`.build/checks/terminal-scroll-public-before.log`.

Installed xterm 6 uses `SmoothScrollableElement` for its virtual viewport. Its
screen/viewport source has no touch-panning handler; the old `.xterm-viewport`
CSS does not make that virtual container scroll. The Terminal app now translates
one-finger vertical pointer gestures on `.xterm-screen` through public
`Terminal.scrollLines()`. Distances use the displayed row height, including
desktop scaling, with fractional rows carried only for the current gesture.
There is no transcript parser, guest arrow-key injection, polling or timer.

Single-finger dragging down reveals older output; dragging up moves toward newer
output. A 6px threshold preserves taps. Horizontal gestures, cancellation,
capture loss or another finger end the gesture. A completed vertical swipe
suppresses its compatibility click so it does not unexpectedly focus the input.
Pinch zoom remains browser-controlled. Desktop mouse/wheel behavior, title-bar
dragging, keyboard mode and existing command keys are retained. Owned listeners
and pointer capture are released on view disposal. Full-screen apps continue
to interpret their own keys; this feature scrolls xterm history.

The immutable candidate is
`.build/releases/connected-terminal-scroll-r2`, native16 manifest
`3071d17fa17666e2d9317e96e2e9a79d629e2a16be2e44b9afb0ed9947efd211`.
Terminal bundle is
`4a68bfe57a64a01efb97d99d4d4a4d0b5f025da5dd3f99f3597069e053b57fa9`.
The generic app merger accepts an explicitly pinned base so every prior public
asset is retained. R2 derives from live b109; the first unused assembly R1
derived from older R8 and was superseded before staging. All 53 native/security
files, 24 network modules and six other app entries are identical. Only the
terminal app and its catalog/loader/cache graph change. No guest image,
account/file service, egress policy, endpoint or hosting change is included.

Installed private VM acceptance passes 38 real Chrome/v86/xterm checks, including
actual nano save/Enter/exit, independent PTYs, flow-control saturation, Unicode
input/IME, sizing, trusted touch swipes both ways, stationary window/page,
keyboard-mode preservation, cancellation and subsequent gestures. The incoming
output check writes through the actual xterm renderer while scrolled back; it
does not claim a network outage or physical Android microphone test. A first
assertion incorrectly compared numeric buffer indices at the 2,000-line cap;
the corrected check requires the same visible text as trimming shifts indices.
The failure log/diagnostic is retained with `-before-` timestamps.

The 13-check lifecycle stress also passes 182 app opens/closes, with all 26
closed shell PIDs absent and no sustained tracked resource growth. Existing
keys/accounts/cookie/private files and monotonic usage survived the installed
code upgrade. Receipts: terminal-scroll-{vm,lifecycle,equivalence}-result.json,
terminal-scroll-vm-upgrade.log, terminal-scroll-app-build-result.json and
terminal-scroll-native-build-r2-result.json under `.build/checks/`.

Actual VM process-death recovery, rollback to b109 and re-upgrade also pass:
`terminal-scroll-vm-rollout-result.json`. The same signing/account state,
private files, file-worker PIDs and monotonic usage survive; no data restore.
The protected production staging helper pins b109 as its prior/rollback release
and requires unchanged retained public assets as well as the active app graph.

Source/live acceptance is recorded below when available.
The full root/blog and networking goal remains active. `/desktop/` stays the
separate backend-free prototype. Existing desktop tabs use the previous public
cache until all such tabs close; save/download RAM-only work before reopening.
Automated phone touch/viewport checks do not replace physical S25 feedback.

## Live activation

Source commit `73f6a01ec82eb07b888d05d172a16ec12d78f5ef` and the immutable
candidate were pushed, pulled under the hosting lock and all 346 declared
candidate/proof files verified. Source-proof package `terminal-scroll-r1` has
manifest `e91be39d5f875d3f5a516f477cb9a9d31487a93be189a8ebbae9db40312f8f6d`.
Plan/install and protected native rollout passed. Activation receipt:
`/srv/codi-connected/routed-native-upgrade-1792829544632813817-result.json`.
Existing 35 accounts, keys/authority and guest cookie were preserved; no data
was restored. The active release is
`/srv/codi-connected/releases/native16-3071d17fa17666e2`, config SHA
`39d88cd8fd56d223d88efaa8291cbf0693f0105660f937e9c022765b136d2c51`;
issuer/steward/guest PIDs1243423/1243425/1243426 remain disabled for boot.

`terminal-scroll-live-health-result.json` verifies all 321 native release files,
all 133 prototype files, unchanged homepage/hosting/Caddy, no pending rollout or
maintenance, active unprivileged/capability-free native roles, and all ten hosted
sites. Three active public metadata/index/worker assets match the immutable
candidate using ordinary TLS. The health check itself restarts no services.
Public terminal acceptance is recorded separately below after completion.

Public default-trusted Chrome now passes all 38 terminal checks in
`terminal-scroll-public-result.json`, with the same harness SHA as the VM run.
Trusted CDP touch gestures act on the real public xterm text, including both
directions, cancellation, stable visible text during incoming renderer output,
keyboard mode, stationary desktop/page and existing nano/PTY/IME behavior.
This is automated Chrome phone emulation, not a physical S25 test.

Final public proof package `tools/codiserver/terminal-scroll-public-r1` manifest
`6602e8064799352845ff0164b4d7ff22e8ec3cfd571580b7d97e552351e15d57`
is pushed and verified in clean webhost source commit
`cfca777963b2d3281b5ccb8fa23db82408ad99f7` (13 files; source-only).
