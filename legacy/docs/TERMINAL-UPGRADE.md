# Terminal and guest tools upgrade queue — 2026-10-23

The user approved changing the `/hidden/` boot image when necessary. Keep the
`/desktop/` sizing prototype unchanged. Do not reboot existing visitor VMs or
claim their RAM work is saved. The finished site still targets the domain root.

The registered-only Linux Internet policy is now LIVE on /hidden/ with native15
and verified public anonymous/registered/file/chat/chess checks. See
[evidence](evidence/native15-live.md). The remaining networking/identity roadmap
and the real xterm migration below are still unfinished.

## 1. Shared app packaging and lifecycle — implemented locally, not deployed

The user explicitly requested generic dependency handling and a coordinated
cleanup contract before integrating xterm. The previous builder copied only
`index.mjs`, and the old loader accepted only one hashed module per app.

- `scripts/build-public-apps.py` now invokes the pinned build-time esbuild tool
  at `tools/app-builder/build.mjs`. Node/npm are not visitor dependencies.
- Lockfile pins esbuild 0.28.2, @xterm/xterm 6.0.0 and @xterm/addon-fit 0.11.0.
  The xterm packages are only used in the integration fixture so far. They are
  not downloaded by current desktop apps that do not import them.
- Bundles contain local/npm dependencies, literal lazy imports, entry CSS and
  CSS assets, imported asset URLs and explicitly declared worker/fetch assets.
  Each app has an immutable directory keyed by a SHA256 of its complete file
  map; all emitted files have their own size/hash records. Old objects remain.
  Catalog publication is atomic after all selected apps build successfully.
- Missing/remote/computed imports, linked inputs/outputs, outside-root imports
  and private output extensions are rejected. Source directories and dependency
  trees are not copied wholesale. Package license notices are emitted.
- The generic loader supports catalog version 2 / host API 2 and loads CSS
  before mount. No terminal-specific script, CDN or style injection was added.
- `mount(host)` now returns `{element, dispose()}`. All seven source apps are
  migrated. The view scope supplies `host.signal` and `host.onDispose(callback)`;
  failed mounts clean registered resources and cleanup failures do not prevent
  other cleanups. Disposal is synchronous and idempotent at the host boundary.
- Desktop.render disposes views before real removal/model replacement/account
  removal. Workspace changes, minimize and roll-up preserve views. Terminal's
  input ResizeObserver/timer now have explicit teardown; shell closure remains
  separately owned by the desktop. Shared services are not view-owned.
- CONTRIBUTING.md/README in served_apps_public describe the new local candidate.

Proof: `.build/checks/public-app-build-result.json` (29 checks, actual Chrome at
both `/` and `/hidden/`) and `public-app-desktop-result.json` (8 actual desktop/
v86 checks). The former imports real xterm/fit via npm, sibling and lazy modules,
CSS, image/WASM and a worker that itself imports an image; tests repeat builds,
dependency changes, invalid graphs, lazy load races and cleanup failure paths.
The latter exercises all seven apps, actual Desktop.render/Close, retained
workspaces/minimize/roll-up, editor/account removal, and an independent shell
surviving another terminal's Close. Neither is a physical phone test.

Before publishing: create a coherent versioned frontend/native export containing
new loader, app-instance module, host, catalog, bundles and regenerated cache
manifest together. Old live tabs retain API 1 code; do not mix a new catalog with
an old loader or change frozen native14 contracts. Keep this candidate separate
from the security-only native15 rollout and the earlier routed-group candidate.

## 2. Replace the real terminal renderer with xterm — queued

Preserve the existing independent CDMUX PTYs/shells and their window identities.
One xterm instance per terminal view; dispose it with the view. Route its input
and output through the existing PTY broker. Keep drafts, selection, phone IME,
voice insertion, explicit Enter, copy/paste, scrollback and workspace behavior.

Add a bounded CDMUX resize message and guest TIOCSWINSZ/SIGWINCH handling. The
broker currently fixes PTYs at 80x24; fitting the browser renderer alone does
not resize Linux programs. Set TERM and include matching terminfo only after
those terminal capabilities work. Test alternate screens, color, curses apps,
resize, two simultaneous shells, close/reopen, touch/voice and cleanup. Do not
add automatic clipboard access or URL launches from guest escape sequences.

## 3. Guest boot image tools — investigate/build separately

| Tool | Purpose | Recommendation and practical limit |
| --- | --- | --- |
| nano | Friendly full-screen text editor with visible shortcuts | Add first, with matching libraries/terminfo and license/source notices. Test edit/save/exit through the real browser terminal. |
| less | Scroll/search long text without editing it | BusyBox less already exists in the current image. Keep it; add full GNU less only for demonstrated missing features. |
| htop | Interactive view of processes, guest CPU/memory and process termination | Useful next. It shows this guest, not the visitor's whole computer or host server. Needs matching i386 dependencies. BusyBox top is already available meanwhile. |
| tmux | Multiple panes/sessions inside one terminal; detach and reattach | Useful optional follow-up after xterm and resize. Independent desktop terminal windows already exist. tmux adds keyboard shortcuts and does not preserve a VM across browser reload/closure/crash. |
| curl + CA certificates | More capable HTTPS requests and diagnostics | Consider a later small tool profile; guest Internet still requires sign-in once the approved restriction is deployed. Certificates and TLS dependencies need maintained updates. |
| git/compiler/toolchains | Source management and compiling inside Linux | Later optional profiles because downloads/storage/CPU grow substantially. They are not installed by the current minimal image. |

Current guest: i386 Debian Bookworm userspace with Linux 6.1.0-54-686. The existing
build root already contains nano 7.2-1+deb12u1, matching libc6 2.36-9+deb12u14,
ncurses/tinfo 6.4-4 and vt100 terminfo. Nano plus ncurses/tinfo/vt100 add about
774 KB uncompressed before notices/configuration; this is not a compressed boot
image estimate. The browser image does not yet contain nano. htop/tmux are not
present in that build root. Do not copy host amd64 binaries into the i386 guest.

Build a separate candidate from the frozen working image; preserve init,
privilege dropping, fixed setuid ping, VirtIO/9p and the PTY broker. Do not run
build-browser-initramfs.py unmodified for an experiment: it overwrites both the
active build image and public asset. Record dependency/source/license hashes,
then test actual v86 nano editing/saving, parallel shells and shared guest files.
All new tools cost download bytes and guest RAM/CPU; there is no need to put
large developer tools into every visitor's initial boot image.

References: [xterm](https://xtermjs.org/),
[esbuild](https://esbuild.github.io/api/),
[nano Debian package](https://packages.debian.org/bookworm/nano),
[tmux](https://github.com/tmux/tmux/wiki), [htop](https://htop.dev/),
[less](https://www.greenwoodsoftware.com/less/).

## Repeat-close gate — 2026-10-24 UTC

The local lifecycle candidate now additionally passes26cycles per app,
182ordinary opens/closes, actual guest procfs verification that26closed shells
are gone, and late file/PGN work checks. A reproduced PGN-after-Close retention
race was fixed, along with Files follow-up editor creation and view-scoped
chat/room release. All50current build/desktop/stress checks pass; see
[evidence](evidence/app-lifecycle-stress.md). These are not live yet. This gate
supports the forthcoming xterm migration; it does not implement that migration.
