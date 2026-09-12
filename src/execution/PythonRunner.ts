export type RunResult={stdout:string;stderr:string;error?:string};
export class PythonRunner { private worker?:Worker; private timer?:number; private id=0;
  run(code:string):Promise<RunResult>{ this.disposeWorker(); return new Promise(resolve=>{ const id=++this.id; const worker=new Worker(new URL('./python.worker.ts',import.meta.url),{type:'module'}); this.worker=worker; let settled=false; const finish=(r:RunResult)=>{if(settled||id!==this.id)return;settled=true;if(this.timer)window.clearTimeout(this.timer);worker.terminate();this.worker=undefined;resolve(r)}; worker.onmessage=e=>finish(e.data); worker.onerror=e=>finish({stdout:'',stderr:'',error:e.message||'Python worker failed'}); worker.postMessage({code}); this.timer=window.setTimeout(()=>finish({stdout:'',stderr:'',error:'Execution timed out after 5 seconds.'}),5000); }); }
  stop(message='Execution stopped by user.'){this.id++;if(this.timer)window.clearTimeout(this.timer);this.timer=undefined;this.worker?.terminate();this.worker=undefined;}
  private disposeWorker(){if(this.timer)window.clearTimeout(this.timer);this.timer=undefined;this.worker?.terminate();this.worker=undefined;}
  dispose(){this.disposeWorker();this.id++;}
}
