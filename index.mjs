import {Terminal} from '@xterm/xterm';
import {FitAddon} from '@xterm/addon-fit';
import {SerializeAddon} from '@xterm/addon-serialize';
import '@xterm/xterm/css/xterm.css';
import './terminal.css';

export function mount(host){
  const {w,desktop}=host,{make,textButton,feedback}=host.ui;
  const {terminalSession,sendTerminal,sendTerminalBytes,attachTerminalRenderer,resizeTerminal}=host.terminal;
  const session=terminalSession(w.id),body=make('div','window-content terminal-content');
  const surface=make('div','terminal-body real-terminal xterm-terminal');
  surface.dataset.serialView='true';surface.dataset.terminalId=String(w.id);surface.setAttribute('aria-label','Guest shell '+w.id);
  const term=new Terminal({cols:session.cols,rows:session.rows,scrollback:2000,fontFamily:'DesktopMono, monospace',fontSize:14,lineHeight:1.2,cursorBlink:true,allowProposedApi:true,convertEol:false,theme:{background:'#202125',foreground:'#e7e8e5',cursor:'#e7e8e5',selectionBackground:'#65738a80'}});
  const fit=new FitAddon(),serialize=new SerializeAddon();term.loadAddon(fit);term.loadAddon(serialize);
  let disposed=false,frame=0,detach;const pending=new Set(),disposables=[];
  const text=()=>{const b=term.buffer.active,lines=[];for(let i=0;i<b.length;i++)lines.push(b.getLine(i)?.translateToString(true)||'');return lines.join('\n').replace(/\n+$/,'');};
  const view={text,paste:data=>term.paste(data),reset:()=>term.write('\x1bc'),write(data,done){
    const item={data,done};pending.add(item);term.write(data,()=>{if(!pending.delete(item))return;done();});
  }};
  const cleanup=()=>{
    if(disposed)return;disposed=true;cancelAnimationFrame(frame);observer?.disconnect();
    let snapshot=serialize.serialize({scrollback:2000});
    if(snapshot.length>4194304)snapshot=serialize.serialize({scrollback:0});
    detach?.({snapshot,text:text(),pending:[...pending].map(item=>({data:item.data,credit:typeof item.data==='string'?0:item.data.length}))});
    pending.clear();for(const d of disposables)d.dispose();term.dispose();
  };
  let observer;host.onDispose(cleanup);
  body.append(surface);term.open(surface);surface.terminal=term;
  // xterm 6 uses a virtual scrollbar, so browser-native touch panning cannot
  // scroll its text. Translate one-finger vertical drags through the public API.
  const screen=term.element.querySelector('.xterm-screen');
  let swipe=null,suppressClick=false;
  const listen=(type,listener,options)=>{
    screen.addEventListener(type,listener,options);
    disposables.push({dispose:()=>screen.removeEventListener(type,listener,options)});
  };
  const endSwipe=event=>{
    if(!swipe||event.pointerId!==swipe.id)return;
    const {id,moved}=swipe;swipe=null;suppressClick=moved&&event.type==='pointerup';
    if(screen.hasPointerCapture(id))screen.releasePointerCapture(id);
  };
  listen('pointerdown',event=>{
    if(event.pointerType!=='touch'){suppressClick=false;return;}
    if(swipe){endSwipe({pointerId:swipe.id});return;}
    suppressClick=false;
    if(!event.isPrimary)return;
    swipe={id:event.pointerId,x:event.clientX,y:event.clientY,lastY:event.clientY,remainder:0,moved:false};
    screen.setPointerCapture(event.pointerId);
  });
  listen('pointermove',event=>{
    if(!swipe||event.pointerId!==swipe.id||disposed)return;
    const dx=event.clientX-swipe.x,dy=event.clientY-swipe.y;
    if(!swipe.moved){
      if(Math.max(Math.abs(dx),Math.abs(dy))<6)return;
      if(Math.abs(dx)>Math.abs(dy)){endSwipe(event);return;}
      swipe.moved=true;
    }
    event.preventDefault();
    const rowHeight=screen.getBoundingClientRect().height/term.rows;
    if(rowHeight>0){
      swipe.remainder+=(swipe.lastY-event.clientY)/rowHeight;
      const lines=Math.trunc(swipe.remainder);
      if(lines){term.scrollLines(lines);swipe.remainder-=lines;}
    }
    swipe.lastY=event.clientY;
  },{passive:false});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])listen(type,endSwipe);
  listen('click',event=>{
    if(suppressClick){suppressClick=false;event.preventDefault();event.stopImmediatePropagation();}
  },true);
  disposables.push({dispose:()=>{if(swipe)endSwipe({pointerId:swipe.id});}});
  term.textarea.classList.add('terminal-input');term.textarea.setAttribute('aria-label','Guest terminal keyboard input');term.textarea.setAttribute('enterkeyhint','send');
  term.textarea.setAttribute('autocorrect','off');term.textarea.setAttribute('autocapitalize','off');term.textarea.spellcheck=false;
  // Guest escape sequences cannot access the browser clipboard or open URLs.
  disposables.push(term.parser.registerOscHandler(52,()=>true),term.parser.registerOscHandler(8,()=>true));
  surface.followOutput=()=>{w.terminalFollow=true;surface.dataset.followOutput='true';term.scrollToBottom();};
  disposables.push(term.onData(data=>{surface.followOutput();sendTerminal(w.id,data);}),term.onBinary(data=>sendTerminalBytes(w.id,Uint8Array.from(data,c=>c.charCodeAt(0)))),term.onResize(size=>resizeTerminal(w.id,size.cols,size.rows)),term.onScroll(()=>{w.terminalFollow=term.buffer.active.viewportY===term.buffer.active.baseY;surface.dataset.followOutput=String(w.terminalFollow);}));
  async function copyText(){
    try { if(typeof navigator.clipboard?.writeText!=='function')throw Error('Clipboard unavailable');await navigator.clipboard.writeText(term.getSelection()||text()); }
    catch { if(!disposed&&!host.signal.aborted)feedback('Copy is unavailable. Use the browser copy command.'); }
  }
  async function pasteText(){
    try { if(typeof navigator.clipboard?.readText!=='function')throw Error('Clipboard unavailable');const data=await navigator.clipboard.readText();if(!disposed&&!host.signal.aborted)term.paste(data); }
    catch { if(!disposed&&!host.signal.aborted)feedback('Paste is unavailable. Use the browser paste command.'); }
  }
  term.attachCustomKeyEventHandler(event=>{
    if(event.ctrlKey&&event.shiftKey&&event.code==='KeyC'){
      if(event.type==='keydown'){event.preventDefault();void copyText();}return false;
    }
    return true;
  });
  detach=attachTerminalRenderer(w.id,view);
  function fitted(){
    frame=0;if(disposed||!surface.isConnected||!surface.getClientRects().length||surface.clientWidth<20||surface.clientHeight<20)return;
    const size=fit.proposeDimensions();if(!size)return;
    const cols=Math.max(20,Math.min(320,size.cols)),rows=Math.max(4,Math.min(120,size.rows));
    if(cols!==term.cols||rows!==term.rows)term.resize(cols,rows);
    if(document.activeElement===term.textarea&&w.terminalFollow!==false)term.scrollToBottom();
  }
  function queueFit(){if(!disposed&&!frame)frame=requestAnimationFrame(fitted);}
  observer=new ResizeObserver(queueFit);observer.observe(surface);
  document.fonts?.ready.then(queueFit);queueFit();
  const bar=make('div','terminal-touchkeys');bar.setAttribute('aria-label','Terminal commands');
  const command=(label,action)=>{const b=textButton(label,()=>{if(!host.signal.aborted)action();});b.addEventListener('pointerdown',event=>event.preventDefault());bar.append(b);return b;};
  for(const [label,value,title] of [['Ctrl+C','\x03','Interrupt or cancel'],['Ctrl+O','\x0f','nano: save, then Enter to confirm the filename'],['Ctrl+X','\x18','nano: exit'],['Tab','\t','Complete a shell command or insert a tab'],['Esc','\x1b','Escape or cancel'],['Enter','\r','Enter or confirm']]){
    command(label,()=>{surface.followOutput();sendTerminal(w.id,value);}).title=title;
  }
  command('Copy',copyText);
  command('Paste',pasteText);
  command('Clear',()=>{term.clear();sendTerminal(w.id,'\f');});
  const guide=make('section','terminal-guide');guide.hidden=true;guide.setAttribute('aria-label','Linux files and terminal help');
  guide.append(make('strong','','Temporary Linux files'),make('p','','Each terminal has its own shell. Linux files are shared between these shells and reset when Linux restarts or the page reloads.'),make('p','','Files displays your account storage. Files created in this shell stay in the temporary Linux home.'),make('p','','Try pwd to see the current folder, ls to list files, or nano filename to edit. In nano, Ctrl+O then Enter saves; Ctrl+X exits.'));
  const openFiles=textButton('Open Files',()=>{guide.hidden=true;info.setAttribute('aria-expanded','false');desktop.launch('files');});guide.append(openFiles);
  const info=command('Linux files',()=>{guide.hidden=!guide.hidden;info.setAttribute('aria-expanded',String(!guide.hidden));});info.setAttribute('aria-expanded','false');info.setAttribute('aria-label','Linux files and terminal help');
  body.append(guide,bar);
  return {element:body,dispose:cleanup};
}
