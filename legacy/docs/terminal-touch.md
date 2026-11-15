# Terminal touch commands — 2026-10-24 UTC

The user requested removal of the terminal's Keyboard button while retaining
Ctrl+C and asked for useful nano/touch commands. The terminal now offers Ctrl+C,
Ctrl+O, Ctrl+X, Tab, Esc, Enter, Copy, Paste and Clear. Ctrl+O opens nano's save
prompt; Enter confirms the filename; Ctrl+X exits. The floating keyboard toggle
remains available. Arrow and Help buttons were not restored. Phone commands
retain the existing 44px targets and wrapping layout.

The generic application bundler rebuilds only the terminal and its dependencies;
the catalog merger emits a coherent API2 catalog/loader and public cache manifest.
Other application entries, all 53 native/security files and 24 networking modules
are byte-identical to native16 R8. The xterm implementation, independent guest
PTY protocol and nano boot image are unchanged.

The immutable candidate is
`active-system/.build/releases/connected-terminal-touch-r1`, manifest
`b109768a09f1276047d74616d722f212bb12e261ff437fd1d1a6cccd4963b8cc`.
Terminal bundle:
`2f1275b935c35442c54dcc673ef33ebdfece514bdfb7365d88da9d785fca0e99`.
Private Git/webhost source commit:
`f44faa928f1c216015ba13df3e0ecac80e628592`.
The frozen source/test package is `tools/codiserver/terminal-touch-r1`, manifest
`4e321694623b109226bad48c3a0ced1505104a8cde843023b41b20c3acf5561d`.

Before publication, the installed private VM passed 30 terminal checks and 13
lifecycle checks (182 app open/close cycles; 26 closed shell PIDs absent). Actual
managed rollback to R8 and re-upgrade passed with existing state retained.
The live protected code upgrade then preserved account/key/authority state,
external cookie and existing 35 accounts. No private data was restored. Native
release is `/srv/codi-connected/releases/native16-b109768a09f12760`, managed
config SHA `e4250512236ef5672f852db274402ce6d4fbb8add0a455bbf509b2ce2a44edfd`;
issuer/steward/guest PIDs are 1211721/1211723/1211724 and remain disabled for boot.
Hosting, homepage and all 133 prototype files are unchanged. All ten hosted
sites pass HTTPS smoke checks. No pending native rollout/maintenance journal
remains. Root activation receipt:
`/srv/codi-connected/routed-native-upgrade-1792828065547662546-result.json`.

Receipts are in `.build/checks/`: terminal-touch-{native-build,app-build,
equivalence,vm,lifecycle,live-health}-result.json, terminal-touch-live-upgrade.log,
terminal-touch-live-sites.log and the VM rollback/re-upgrade logs.

Retained failures include known unlisted Python bytecode created by two build
helpers; verification refused those candidates before staging, and the helpers
now disable bytecode. Only those generated unlisted files were removed.
The first public terminal run timed out after nano exit; the test now waits for
the restored shell prompt before issuing the next command. A stricter resize
assertion also exposed an older test's false positive: the word “winch” matched
the missing filename in an error. The revised check requires a distinct signal
marker from a foreground noninteractive program; an interactive ash line editor
handles SIGWINCH itself. Original failure logs/diagnostics are retained with
`-before-` timestamps. These are test changes, not changes to the guest image.

Public default-trusted Chrome acceptance now passes all 30 checks in
`terminal-touch-public-result.json`, including actual button-driven nano save /
filename confirmation / exit followed by a shell command, a distinct kernel
SIGWINCH marker, independent PTYs, disposal, native keyboard, IME, viewport
resizing, floating keyboard control and all nine 44px command targets. The shell
prompt wait uses the rendered transcript: the raw buffer cursor can temporarily
point elsewhere during nano's screen restoration. A first foreground probe also
waited for a trailing newline that the transcript intentionally trims; the test
now accepts end-of-transcript without changing the required distinct marker.
Original intermediate failures remain retained. Automated
phone viewport/IME checks do not claim a physical Android keyboard test. The
existing cache policy waits for old desktop tabs to close before activation;
save/download RAM-only work before closing and reopening. No automatic VM save
is promised. The root/blog migration and full networking goal remain active.

The hardened 30-check suite also passes again in the installed private VM.
Follow-up source/proof bundle `tools/codiserver/terminal-touch-public-r1` has
manifest `cf3f140be2a252fb4d2a03a76b47fb7deca016f0e3c898ee5046b28a78c8ea24`;
it includes the retained public harness failures and final public/VM/live-health
receipts. The frozen original candidate and source package remain unchanged.
