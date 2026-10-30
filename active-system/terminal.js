'use strict';
// CDMUX/2 transports independent PTYs. xterm owns terminal parsing and rendering.
const terminalSessions=new Map();
let terminalMuxReady=false,terminalMuxLine='',terminalBootText='';
function terminalControl(text){if(terminalMuxReady&&v86Instance)v86Instance.serial0_send('\x1eCDMUX '+text+'\n');}
function terminalSession(id){
  let s=terminalSessions.get(id);if(s)return s;
  s={id,cols:80,rows:24,view:null,pending:[],pendingBytes:0,snapshot:'',snapshotText:'',exited:false};
  s.screen={text:()=>s.view?.text()??s.snapshotText,reset:()=>{s.snapshot='';s.snapshotText='';s.view?.reset();},feed:text=>terminalOutput(s,text,0)};
  terminalSessions.set(id,s);if(id===2&&terminalBootText)terminalOutput(s,terminalBootText,0);
  terminalControl('O '+id+' '+s.cols+' '+s.rows);return s;
}
function acknowledgeTerminal(s,bytes){if(bytes&&terminalSessions.get(s.id)===s&&!s.exited)terminalControl('A '+s.id+' '+bytes);}
function terminalOutput(s,data,credit){
  if(s.view){s.view.write(data,()=>acknowledgeTerminal(s,credit));return;}
  const size=typeof data==='string'?new TextEncoder().encode(data).length:data.length;
  // Broker flow control caps PTY output at64KiB. Boot diagnostics are bounded too.
  if(s.pendingBytes+size>327680)throw Error('Terminal transport exceeded its bounded pending output');
  s.pending.push({data,credit});s.pendingBytes+=size;
}
function attachTerminalRenderer(id,view){
  const s=terminalSession(id);if(s.view)throw Error('Terminal already has a view');s.view=view;
  if(s.snapshot)view.write(s.snapshot,()=>{});s.snapshot='';
  const pending=s.pending;s.pending=[];s.pendingBytes=0;
  for(const item of pending)view.write(item.data,()=>acknowledgeTerminal(s,item.credit));
  return state=>{if(s.view!==view)return;s.view=null;if(terminalSessions.get(id)!==s)return;
    s.snapshot=state.snapshot;s.snapshotText=state.text;
    for(const item of state.pending)terminalOutput(s,item.data,item.credit);
  };
}
function resizeTerminal(id,cols,rows){
  const s=terminalSessions.get(id);if(!s||!Number.isInteger(cols)||!Number.isInteger(rows)||cols<20||cols>320||rows<4||rows>120)return;
  if(s.cols===cols&&s.rows===rows)return;s.cols=cols;s.rows=rows;if(!s.exited)terminalControl('S '+id+' '+cols+' '+rows);
}
function sendTerminal(id,text){
  if(desktopLifecycle?.state.blocked)return;
  const s=terminalSessions.get(id);if(!terminalMuxReady||guestState!=='ready'||!s||s.exited||!text)return;
  sendTerminalBytes(id,new TextEncoder().encode(text));
}
function sendTerminalBytes(id,bytes){
  const s=terminalSessions.get(id);if(desktopLifecycle?.state.blocked||!terminalMuxReady||guestState!=='ready'||!s||s.exited)return;
  for(let start=0;start<bytes.length;start+=2048){const hex=Array.from(bytes.subarray(start,start+2048),b=>b.toString(16).padStart(2,'0')).join('');terminalControl('I '+id+' '+hex);}
}
function insertTerminalText(id,text){const s=terminalSessions.get(id);if(s?.view)s.view.paste(text);else sendTerminal(id,text);}
function closeTerminal(id){if(terminalSessions.has(id))terminalControl('C '+id);terminalSessions.delete(id);}
// Compatibility read hook for diagnostics; no custom ANSI parser remains.
const serialScreen={text:()=>terminalSessions.get(2)?.screen.text()||terminalBootText,feed:text=>{terminalBootText=(terminalBootText+text).slice(-262144);const s=terminalSessions.get(2);if(s)terminalOutput(s,text,0);},reset:()=>{terminalBootText='';terminalSessions.get(2)?.screen.reset();}};
function paintTerminal(){} // xterm writes asynchronously; never replace its DOM.
function receiveGuestSerial(text){
  for(const char of text){
    if(terminalMuxLine||char==='\x1e'){
      terminalMuxLine+=char;if(terminalMuxLine.length>32768){terminalMuxLine='';continue;}if(char!=='\n')continue;
      const line=terminalMuxLine.slice(0,-1).replace(/\r$/,'');terminalMuxLine='';
      if(line==='\x1eCDMUX R 2'){
        if(serialFrame){cancelAnimationFrame(serialFrame);flushSerial();}
        terminalMuxReady=true;guestState='ready';guestMessage='Independent xterm Linux shells are ready.';
        terminalBootText='';for(const s of terminalSessions.values()){s.screen.reset();terminalControl('O '+s.id+' '+s.cols+' '+s.rows);}refreshTerminals();continue;
      }
      const match=/^\x1eCDMUX ([DOXE]) ([1-9][0-9]*) ([0-9a-f]*)$/.exec(line);if(!match)continue;
      const s=terminalSessions.get(Number(match[2]));if(!s)continue;
      if(match[1]==='D'||match[1]==='E'){const bytes=Uint8Array.from(match[3].match(/../g)||[],h=>parseInt(h,16));terminalOutput(s,bytes,match[1]==='D'?bytes.length:0);}
      if(match[1]==='X'||match[1]==='E'){s.exited=true;terminalOutput(s,'\r\n[Shell closed. Open a new terminal to start another shell.]\r\n',0);}
    }else if(!terminalMuxReady)appendSerial(char);
  }
}
