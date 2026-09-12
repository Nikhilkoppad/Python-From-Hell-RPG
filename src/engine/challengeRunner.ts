import type {Lesson} from '../domain/lessons';
import type {RunResult,PythonRunner} from '../execution/PythonRunner';
export type ChallengeResult={passed:boolean;reason:string;testId?:string;hiddenChecked?:boolean};
export async function evaluateLessonChallenge(lesson:Lesson,source:string,visible:RunResult,runner:PythonRunner):Promise<ChallengeResult>{
 if(visible.error)return{passed:false,reason:visible.error};
 const spec=lesson.challenge;
 if(!spec)return visible.stdout.trim()===lesson.expectedOutput.trim()?{passed:true,reason:'Target output matched.'}:{passed:false,reason:`Expected ${JSON.stringify(lesson.expectedOutput.trim())} but received ${JSON.stringify(visible.stdout.trim())}.`};
 for(const pattern of spec.required??[])if(!pattern.test(source))return{passed:false,reason:`Your output is close, but the solution is missing required concept: ${pattern.source}`};
 for(const pattern of spec.forbidden??[])if(pattern.test(source))return{passed:false,reason:`This solution uses a shortcut the challenge forbids: ${pattern.source}`};
 if(spec.harness){
  const encoded=JSON.stringify(source);const harness=JSON.stringify(spec.harness);
  const hiddenProgram=`import io, contextlib\n_src=${encoded}\n_ns={}\n_buffer=io.StringIO()\nwith contextlib.redirect_stdout(_buffer):\n    exec(compile(_src, '<challenge>', 'exec'), _ns, _ns)\n    exec(compile(${harness}, '<private-test>', 'exec'), _ns, _ns)`;
  const hidden=await runner.run(hiddenProgram);
  if(hidden.error)return{passed:false,reason:`Private test failed: ${hidden.error}`,hiddenChecked:true};
  if(spec.expected!==undefined&&hidden.stdout.trim()!==spec.expected.trim())return{passed:false,reason:'The visible example looks right, but the private behavior test failed. Check the implementation, not just the sample output.',hiddenChecked:true};
  return{passed:true,reason:'Challenge cleared. Private behavior test passed.',hiddenChecked:true};
 }
 if(spec.expected!==undefined&&visible.stdout.trim()!==spec.expected.trim())return{passed:false,reason:`Expected ${JSON.stringify(spec.expected.trim())} but received ${JSON.stringify(visible.stdout.trim())}.`};
 return{passed:true,reason:'Challenge requirements satisfied.'};
}
