const PYODIDE_URL='https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.mjs';
let pyodidePromise:Promise<any>|undefined;
async function runtime(){ if(!pyodidePromise){pyodidePromise=import(PYODIDE_URL).then(async mod=>mod.loadPyodide());} return pyodidePromise; }
self.onmessage=async (event)=>{try{const py=await runtime();let out='';let err='';py.setStdout({batched:(s:string)=>{out+=s+'\n';}});py.setStderr({batched:(s:string)=>{err+=s+'\n';}});try{await py.runPythonAsync(event.data.code);self.postMessage({stdout:out.trimEnd(),stderr:err.trimEnd()});}catch(e){self.postMessage({stdout:out.trimEnd(),stderr:err.trimEnd(),error:String(e)})}}catch(e){self.postMessage({stdout:'',stderr:'',error:`Python runtime unavailable: ${String(e)}`})}};
