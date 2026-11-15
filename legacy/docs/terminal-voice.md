# On-device voice input


## R11 independent workspace panels — 2026-10-23 04:04 UTC

Latest user direction supersedes R8–R10 cross-workspace tasks. Each workspace
shows only its own app icons, counts and window picker; pins are per workspace.
Empty workspaces inherit no Files/Terminal/Text shortcuts. Applications opens
new instances in the current workspace. Minimize/restore/close affects only
that workspace's count; switching retains existing app DOM, drafts and cursor.
Multiple terminal windows still view the shared guest serial console; separate
PTYs/shells and separate filesystems are not added by this panel change.
Tap-to-start/stop voice, red stop icon, default voice keyboard policy, floating
keyboard toggle and draggable overlay remain included.

Live /hidden frontend R11: `d6b62247203795f680d549d8064a27c37f0ed12f25e3b8ead0b4b069eb4dbc4a`
Source/server checkout: `08c8af907a21f5805a317c6ad3d85c5a10a5908d`
Speech R3 remains df759266dbd1cc339c4cd96df8265e274b9b9042abef275d00fc0809deed1f3b.
Hosting generator: `b4d9a6045cbd10d94f083010b7b1995cd30a80df5234e3ce122da1591aeffcbf`
Manifest: `fc754d7910c986ebbd5c545094acd6f6fe8d6a7227439e83d5450f8c4b47de3d`
Derived Caddy: `3eec189f42a74ee4f9f7c3b9381f56c03b0917fcbe56bd08394b20c9d41536f1`
Root receipt: /srv/codi-connected/frontend-d6b62247203795f680d549d8064a27c37f0ed12f25e3b8ead0b4b069eb4dbc4a-activation-result.json.
Scoped rollback to R10, PRESERVING the new ninth Cardboard site, uses
/var/backups/webhost-sites/change-20261023T040429615138Z/common.py and
/var/backups/webhost-sites/change-20261023T040429615621Z/sites.toml through hosting controller lock/pins,
generated validation/application and all9-site/prototype checks. Older R10
rollback inputs predate Cardboard; do not restore those over the current site.
/desktop hashes, nativef2 services/PIDs/config/index/cookie and website release
remain unchanged. No ports/router/firewall/boot changes. Public TURN still OFF.
Caddy reload may close existing WebSockets despite unchanged native PIDs.

Local Chrome general voice/workspace and touch+desktop checks PASS. Workspace
checks exercise terminal counts3/2/4, no inherited app icons, local picker,
minimized restore, independent pinning, close count and preserved drafts/cursor.
Public general-voice/touch Chrome checks PASS with ordinary TLS trust. Current
touch/speech aggregates bind exact R11 served assets and all9-site/native health.
The relay aggregate also binds this current health; its relay remains source-only.
Automation covers touch emulation, not actual physical Android keyboard display.

## Previous release details

## Current tap voice and movable overlay — 2026-10-23 03:48 UTC

Frontend R10 `843731014475a1344f5191b9485dd2f7eb179b54d0c73d1edfb896576af14e0f` from source/server
`2af147b3f5a5be3de3916793b144f86c2b1b58a0`. Speech R3 remains
`df759266dbd1cc339c4cd96df8265e274b9b9042abef275d00fc0809deed1f3b`.
The user corrected the gesture: tap starts, a second tap stops and inserts the
finished transcript; holding is not required. Mic switches to a stop square
while recording, then returns to the mic. Pending loading/inference can be
cancelled by tapping. Dragging the mic moves the floating controls and never
starts/stops recording. No bottom strip is reserved; the overlay can sit over
an app and the user can move it. Normalized position is RAM-only and is clamped
on visualViewport resizing/rotation; its temporary message is clamped too.

Voice mode is the default. Editable fields receive inputmode=none, without
readonly/disabled changes, so cursor selection, dictation and hardware typing
remain available. The floating keyboard button restores each field's original
input mode and focuses the remembered field; toggling off blurs the current
field to dismiss an already-open keyboard. Starting voice also switches an
explicitly enabled keyboard back off. The terminal's existing Keyboard button
re-enables typing mode before focusing its native field. Existing and newly
created fields share this policy; preference stays in this browser session.

This uses the [standard inputmode none behavior](https://html.spec.whatwg.org/multipage/interaction.html#attr-inputmode-none).
Inputmode is a browser input hint; desktop Chrome automation verifies exact
attributes, enabled/focusable fields and toggling, not the physical phone OS
keyboard's visibility. S25/Chrome feedback is still needed for that last claim.
No browser-wide or other-site keyboard setting is changed.

Local general-voice-result.json PASS covers actual CPU Whisper from microphone
fixture capture with trusted touch taps in terminal/editor, changed recording
icon, previous focus/selection, default none mode and keyboard toggle, cancelled
inference, real drag with no new microphone stream, and viewport containment.
Touch-preview-result.json PASS covers all prior native terminal input, menu,
workspace/task/roll-up and desktop mouse/keyboard regressions. Public receipts
and aggregates bind the served assets separately. A first overlay resize check
asserted immediately after CDP metrics changed; the retained failure is
voice-overlay-resize-immediate-assumption-before-result.json. Waiting for the
actual resize event gives a clean PASS. No product change hid that failure.

Current hosting pins:
- generator `137f767bff1fe247b8cda574bc6710c63fc1a7d441064fbf6c00a3fc129cbd96`
- manifest `1a9db555d075a997c14273c04a05c359bfa482c3efaf5454f1aa5801b948203b`
- derived Caddy `f6f097d53683b67e8d216163ae10856c8b1a381ef65c2573f10321962de4f231`

Root receipt: /srv/codi-connected/frontend-843731014475a1344f5191b9485dd2f7eb179b54d0c73d1edfb896576af14e0f-activation-result.json.
Rollback to R9 (old hold gesture / no keyboard switch) uses
/var/backups/webhost-sites/change-20261023T034834237973Z/common.py and
/var/backups/webhost-sites/change-20261023T034834244049Z/sites.toml through the hosting controller lock,
pins, generated validation/application and all8-site/prototype checks. All native
PIDs/config/index/cookie, current website and /desktop remain unchanged.
Public TURN/shared ingress still OFF. Caddy reload can close WebSockets;
unchanged PIDs/RAM do not prove uninterrupted streams. Speech still runs on
the visitor CPU with no audio upload; full networking/identity goal unfinished.

## Historical R9 general voice deployment — 2026-10-23 03:31 UTC

Frontend R9 `51ae4707d020ff04885cdcfdc2b16c762c2bb156b6285122b2c5e63d8e578e1e` and speech R3
`df759266dbd1cc339c4cd96df8265e274b9b9042abef275d00fc0809deed1f3b` are live only at /hidden/.
Frontend source and server checkout: `f1f3933d2943cb3d7dc0f858f37216984227dce5`.
Speech R3 source remains `2ffb8b8a6ccf0525e1d1648835f029a6253973f7`.
The native services, index/cookie, website release, and /desktop prototype are
unchanged. Native roles/controller remain f2fbd4d with PIDs185140/185141/185562.

- A floating microphone button works with the previously focused enabled text
  field or terminal. Hold to record, release to transcribe and insert. The
  original input selection is replaced in the editor; input events update app
  drafts/dirty state. No automatic Enter, form submission or chat send.
- Model loading starts alongside Linux, without microphone permission/capture.
  Audio starts only after a gesture. CPU/WASM, English tiny.en and the repeat/
  low-energy guards remain. Text appears after release, not during speech.
- The shared client retains legacy toggleVoice for frontend rollback. The old
  per-terminal Voice button was removed; Keyboard/Ctrl+C/Tab/Esc/Enter remain
  at the bottom. The floating button has a phone bottom gutter and follows
  visualViewport resizing. Pointer capture, cancellation, visibility and blur
  handling prevent continued recording after a cancelled gesture.
- Workspace/minimize/panel changes retain existing app DOM, drafts and cursor
  positions. A different editor state/file path deliberately replaces only
  that app content. Removed windows are cleaned up.
- Editor/calculator/chat/rooms/help now have distinct SVG graphics in the menu,
  panel and window titles; the previous shared almost-blank icon is removed.
- Running task icons show a count even for one window and keep a running line
  when minimized; active highlighting follows focus. Task lists cover all
  workspaces, and choosing a task restores its original workspace.
- The phone window '^' roll-up control is restored. Applications → Terminal
  always opens another window. These windows still share the same guest serial
  console; independent per-window PTYs/shells are not implemented yet.
- Workspaces are removed from Applications; the top-bar computer icon retains
  the three-preview chooser, selection/outside dismissal, and no Close button.

Local tests: general-voice-result.json PASS with real microphone-file capture,
actual CPU Whisper in terminal and editor, trusted touch press/release, preserved
focus/selected range, another app's cancelled inference, workspace DOM/drafts,
additional terminal windows/counts, roll-up and cross-workspace task restore.
Current touch-preview-result.json PASS covers native keyboard/viewport/menu/
scrollback and desktop mouse regressions. Public versions also PASS in separate fresh
Chrome sessions using default TLS trust; touch and speech milestone receipts
bind the exact assets and current hosting health. Neither automation claims a physical phone microphone test.
User confirmed the previous CPU voice R2 worked on their S25; R9/R3 still needs
fresh-device feedback. Save/download ephemeral guest files before refreshing.

Current hosting pins:
- generator `137f767bff1fe247b8cda574bc6710c63fc1a7d441064fbf6c00a3fc129cbd96`
- manifest `5e56e78ea5f6a83a77650032d94304fe95b1f53d2b0394c767b0fd61beee0fb3`
- derived Caddy `e1b1ad42f6a80a3d0d27e167ea31d2bb654f264f20867f231f7870c608588199`

Root activation receipts are frontend-51ae4707d020ff04885cdcfdc2b16c762c2bb156b6285122b2c5e63d8e578e1e-activation-result.json
and speech-df759266dbd1cc339c4cd96df8265e274b9b9042abef275d00fc0809deed1f3b-activation-result.json under
/srv/codi-connected. Immutable assets are under frontends/<frontendSHA> and
speech/<speechSHA>. Frontend rollback to R8 while keeping R3 speech uses
/var/backups/webhost-sites/change-20261023T033136965701Z/common.py and
/var/backups/webhost-sites/change-20261023T033136966164Z/sites.toml. R8-to-R7 inputs remain
/var/backups/webhost-sites/change-20261023T032619588310Z/common.py and
/var/backups/webhost-sites/change-20261023T032619588759Z/sites.toml. The earlier speech rollback to R2 uses
/var/backups/webhost-sites/change-20261023T032537873812Z/common.py and
/var/backups/webhost-sites/change-20261023T032537874722Z/sites.toml. If fully reverting both, restore frontend
first then speech (the old frontend is compatible with R3). Use the controller
lock, exact pins, generated Caddy validation/application and all8-site/prototype
checks; never hand-edit Caddy. Caddy reload can close existing WebSockets.
No router, firewall, port, native code or boot-policy change. Public TURN OFF;
full networking/login roadmap remains unfinished. Earlier R2 details below are
historical; current receipt names for voice are general-voice-result.json and
general-voice-public-result.json, bound by speech-milestone-result.json.

## Historical R7 / speech R2 deployment

Live only at https://ksu.codes/hidden/. The desktop sizing prototype is unchanged.
Frontend R7: `53441112d3c594071ebb542012bdcf3fb5e2c20b61c496cd2258161891d6e8aa`,
source `867c7969a1fd94115c874edaec4f775b57d9b6e1`.
Speech R2: `108c2aa406e456841e360ea55efb5c8aeeba0f547c3be58561795cd7add1598b`,
source `94e9a3e9d79dc97b4b9768095227d5733ca06764`. Installed root-owned immutable speech directory:
`/srv/codi-connected/speech/108c2aa406e456841e360ea55efb5c8aeeba0f547c3be58561795cd7add1598b`. Source bundle is outside public/ in
`tools/codiserver/speech/108c2aa406e456841e360ea55efb5c8aeeba0f547c3be58561795cd7add1598b`.

The managed KSU-only codi_speech SHA selects exactly 22 public static files
under /hidden/assets/speech/*. No transcription API/server worker was added.
Codi_frontend still selects the same three R7 assets; native index/cookie/APIs,
guest relay and all other routes remain on the existing backends.

| Hosting input | Current SHA256 |
| --- | --- |
| ops/common.py | `137f767bff1fe247b8cda574bc6710c63fc1a7d441064fbf6c00a3fc129cbd96` |
| sites.toml | `0c2683cd386b56caac8af95d9897056e20a9f356134f9baf3bff42c9a683be54` |
| Derived Caddyfile | `89036ff6270db9b319cd1cc6bc44d6ecae479821b7e2a69832802241a090d0eb` |

## Behavior

Phone terminal keys are Keyboard, Ctrl+C, Tab, Esc, Voice, Enter. Arrow and Help
buttons were removed. All commands stay at the bottom and six keys fit widths
320/360/390 with 44px targets. Voice and Enter also work on desktop. Workspace
chooser on the computer icon has three previews and no Close button; network
information remains in the session-dot menu. Prior touch/viewport fixes remain.

Transformers.js3.8.1, matching ONNX Runtime1.22.0-dev.20250409-89f8206ba4,
English Whisper tiny.en q8 encoder/merged decoder. Model revision:
2575352d61be1bf7225cf8f8b268a4678025fc58. Archive integrity and individual static
file hashes are in provenance.json/speech.json; all three upstream licenses
are included. First use fetches approximately68MB of model/runtime assets.
Static model cache is allowed; microphone audio and transcripts are not stored
on the server. The recorder requests audio only, downmixes to mono16kHz and
transfers a bounded Float32Array to a module worker. Maximum recording15seconds,
blob2MiB, samples16seconds. Single-thread WASM works without origin isolation.

Voice loads the model then opens the microphone. Stop finishes recording;
Cancel during loading/inference terminates pending work without inserting text.
Closing the terminal or changing identity discards recordings and stops tracks.
Control/newline characters are removed, low-energy clips skipped, repeated
transcripts rejected before insertion, and repeated decoder4-grams disabled.
Inference is bounded by a120second timeout; initial model loading240seconds.
Text never sends Enter automatically. Enter remains an explicit user action.
These guards cannot guarantee recognition accuracy for shell commands.

## Reported failure and correction

Galaxy S25/Chrome user supplied Screenshot_20261022_225833_Chrome.jpg showing
repeated biasesVIDEO text filling the guest terminal after Voice. They reported
long Transcribing, nonsense such as proc bicy at fair twilight, and confusion
about Cancel. Screenshot is a local user attachment, not shipped or committed.
The old client automatically selected WebGPU when an adapter existed. A fresh
software-GPU Chrome diagnostic timed out after120seconds in Transcribing with
ONNX provider warnings. This is evidence that the previous automatic GPU path
was unsuitable; it does not establish the precise physical S25 driver failure.

R2 always uses the verified device CPU/WASM path, never requests a GPU adapter,
and rejects the reported repeating text. No server audio processing was added;
the user explicitly prefers recognition on their device. Physical S25 accuracy,
latency and microphone behavior still need the user's fresh-page feedback.
Existing pages must reload to replace their already-imported speech module;
save/download guest files first because VM RAM is ephemeral.

## Evidence

All current receipts are under .build/checks/:

- speech-result.json and speech-public-result.json PASS: actual Chrome
  getUserMedia/MediaRecorder with prerecorded speech, actual local Whisper
  inference and correct JFK transcript, even with WebGPU exposed. Worker ready
  and result both report WASM; adapter is never read. No automatic Enter,
  explicit Enter, permission-denial UI, microphone track cleanup, and closing
  the terminal stop recording. Observed speech requests are same-origin reads
  or local blob URLs. Physical microphone is not claimed.
- Cancellation during model load opens no microphone; restarting succeeds.
  A controlled withheld worker request proves cancelling pending transcription
  stops tracks/discards output; subsequent real loading/capture still works.
- Actual insertion sanitizer rejects biasesVIDEO repetition, repetition with
  the reported nonsense prefix, and unspaced repeating strings. It removes
  embedded controls from normal text. This is a deterministic guard test,
  separate from the actual speech-inference fixture.
- speech-activation-result.json: immutable file ownership/pins, all22 public
  asset hashes streamed and verified, actual Caddy validation/controller lock,
  backup/rollback, unchanged frontend/prototype/index/cookie/native config/PIDs
  and all8 sites PASS.
- preview-touch-live-health-result.json: installed frontend/speech pins,
  native role isolation, disabled boot state, ping policy and all8 site smoke.
- touch-public-result.json and touch-preview-result.json cover the unchanged
  R7 frontend's real guest commands, six touch keys, menus/workspaces, keyboard
  viewport behavior and desktop regressions. They predate speech R2; the updated
  touch aggregate binds their three assets through the speech-only activation.
- speech-milestone-result.json binds local/public speech receipts to the exact
  exported/installed bundle, live hosting/native health and touch aggregate.
- speech-gpu-diagnostic-public-result.json retains the previous GPU timeout.
  speech-r1-public-before-result.json retains earlier successful WASM proof.
  speech-cancel-vt100-test-assumption-before-result.json retains the first new
  public test failure: the assertion mistook a VT100 response ending in R for
  typed text. Corrected assertion permits only complete CSI replies; rerun PASS.

The public tests use ordinary certificate validation from the development
network. They do not prove independent WAN/NAT, public TURN, physical phone
recognition or uninterrupted existing WebSocket connections across Caddy reload.
No native services were restarted; PIDs185140/185141/185562 remain unchanged.
Full networking/login/identity goal is unfinished; public TURN remains OFF.

## Operations and rollback

Root speech receipt:
`/srv/codi-connected/speech-108c2aa406e456841e360ea55efb5c8aeeba0f547c3be58561795cd7add1598b-activation-result.json`.
Latest all8-site smoke: reports/private/codi-speech-assets-20261023.json.
Rollback to the previous speech bundle uses hosting input backups:
`/var/backups/webhost-sites/change-20261023T030909288225Z/common.py`
and `/var/backups/webhost-sites/change-20261023T030909289110Z/sites.toml`.
Use the hosting controller lock, validate source/manifest pins, restore the
reviewed inputs, regenerate/validate/apply Caddy and check all8 sites/prototype.
Do not hand-edit derived Caddy. The preceding speech bundle still selects GPU
on adapter-capable devices and retains the user-reported bug, so prefer a
forward correction. To remove speech, R6/no-speech inputs are retained at
change-20261023T025456646059Z/common.py and
change-20261023T025456646907Z/sites.toml under /var/backups/webhost-sites.
R7 frontend rollback is independent and must preserve any chosen speech route.

Native controller/roles remain /srv/codi-connected/releases/f2fbd4d/profile8,
managed schema2. Root revision1 expires2026-10-23 22:36:39UTC and still requires
explicit renewal through the installed controller. Public TURN/shared443,
production identities/abuse review, off-host custody and independent-WAN proof
remain unfinished. Untested local relay operator2/certificate-source work is
not part of this speech deployment; do not copy or install it accidentally.
