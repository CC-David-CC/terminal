# Terminal

A trusted API2 app using bundled xterm.js, Fit and Serialize addons. Each window
attaches to a separate Linux PTY supplied by the host; it does not start a server
shell. The versioned guest image includes nano. Guest files are RAM-only unless
explicitly downloaded or copied to a registered account's server files.

The app owns its terminal renderer, observer and event subscriptions. Dispose
releases these resources; replacing a view retains the shell and serialized
terminal state. Closing the window ends that shell. Resize changes the Linux
PTY geometry and delivers SIGWINCH. Output acknowledgements release bounded
per-session guest credits; preserve acknowledgement callbacks when changing the
renderer. Never convert application documents into shell commands.

Native input supports hardware typing, IME, explicit keyboard mode and dictation.
Commands are grouped below the terminal. Linux files opens an in-window guide to the temporary guest filesystem, nano and the explicit Files copy action. Clipboard access requires an explicit
user action; guest OSC52/OSC8 cannot read/write the clipboard or open browser
URLs. No transcript is automatically submitted as a command.

On touch screens, drag the terminal text down to reveal older scrollback and
up to return toward newer output. The app translates single-finger vertical
pointer gestures through xterm's public scrolling API; xterm 6's virtual
scrollbar does not provide native touch panning. Swipes stay inside the text
area, preserve voice-mode keyboard settings and pause output following until
the user returns to the bottom or types. Taps, desktop selection/wheel scrolling
and title-bar dragging retain their existing behavior. Cancellation or a second
finger ends the gesture; disposal releases capture and removes all listeners.
This scrolls terminal history; it does not send arrow keys to full-screen apps.

Build with active-system/scripts/build-public-apps.py. The generic builder
packages imports, CSS and notices. Verification includes real v86/nano/browser
checks and repeated open/close cleanup, not only mocked terminal methods.
