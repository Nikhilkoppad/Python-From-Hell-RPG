export type RunResult={stdout:string;stderr:string;error?:string;cancelled?:boolean;timedOut?:boolean};
export class PythonRunner {
 private worker?:Worker;private timer?:number;private id=0;private activeResolve?: (result:RunResult)=>void;
 run(code:string):Promise<RunResult>{
  this.disposeWorker();
  return new Promise(resolve=>{
   const id=++this.id;const worker=new Worker(new URL('./python.worker.ts',import.meta.url),{type:'module'});this.worker=worker;this.activeResolve=resolve;let settled=false;
   const finish=(r:RunResult)=>{if(settled||id!==this.id)return;settled=true;if(this.timer)window.clearTimeout(this.timer);this.timer=undefined;worker.terminate();this.worker=undefined;this.activeResolve=undefined;resolve(r)};
   worker.onmessage=e=>finish(e.data as RunResult);worker.onerror=e=>finish({stdout:'',stderr:'',error:e.message||'Python worker failed'});
   try{worker.postMessage({code})}catch(error){finish({stdout:'',stderr:'',error:error instanceof Error?error.message:'Unable to start Python execution'})}
   this.timer=window.setTimeout(()=>finish({stdout:'',stderr:'',error:'Execution timed out after 5 seconds.',timedOut:true}),5000);
  });
 }
 stop(message='Execution stopped by user.'){
  const resolve=this.activeResolve;this.activeResolve=undefined;
  if(this.timer)window.clearTimeout(this.timer);this.timer=undefined;this.id++;this.worker?.terminate();this.worker=undefined;
  resolve?.({stdout:'',stderr:'',error:message,cancelled:true});
 }
 private disposeWorker(){
  if(this.timer)window.clearTimeout(this.timer);this.timer=undefined;this.worker?.terminate();this.worker=undefined;
  const resolve=this.activeResolve;this.activeResolve=undefined;resolve?.({stdout:'',stderr:'',error:'Execution cancelled.',cancelled:true});
 }
 dispose(){this.disposeWorker();this.id++;}
}
