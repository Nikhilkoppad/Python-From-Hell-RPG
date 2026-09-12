const PYODIDE_URL='https://cdn.jsdelivr.net/pyodide/v314.0.6/full/pyodide.mjs';
const INDEX_URL='https://cdn.jsdelivr.net/pyodide/v314.0.6/full/';
let pyodidePromise:Promise<any>|undefined;
async function runtime(){if(!pyodidePromise)pyodidePromise=import(PYODIDE_URL).then(async mod=>mod.loadPyodide({indexURL:INDEX_URL}));return pyodidePromise}
self.onmessage=async event=>{
 try{
  const py=await runtime();let out='';let err='';
  py.setStdout({batched:(s:string)=>{out+=s+'\n'}});py.setStderr({batched:(s:string)=>{err+=s+'\n'}});
  const source=String(event.data?.code??'');const encoded=JSON.stringify(source);
  try{await py.runPythonAsync(`_pfh_source=${encoded}\n_pfh_ns={}\nexec(compile(_pfh_source, '<user>', 'exec'), _pfh_ns, _pfh_ns)`);self.postMessage({stdout:out.trimEnd(),stderr:err.trimEnd()})}
  catch(e){self.postMessage({stdout:out.trimEnd(),stderr:err.trimEnd(),error:String(e)})}
 }catch(e){self.postMessage({stdout:'',stderr:'',error:`Python runtime unavailable: ${String(e)}`})}
};
