import type {Challenge} from '../domain/challenges';
import type {RunResult} from '../execution/PythonRunner';

export type ChallengeResult={passed:boolean;reason:string;testId?:string};

export function evaluateChallenge(challenge:Challenge,source:string,run:RunResult):ChallengeResult{
 if(run.error)return{passed:false,reason:run.error};
 const output=run.stdout.trim();
 if(output!==challenge.tests[0]?.expectedOutput.trim())return{passed:false,reason:`Expected ${JSON.stringify(challenge.tests[0]?.expectedOutput.trim())} but received ${JSON.stringify(output)}.`};
 if(challenge.id==='ch_variables'&&!/\bsoul\s*=/.test(source))return{passed:false,reason:'The output is right, but the challenge specifically asks for a variable named soul.'};
 if(challenge.id==='ch_types'&&!/type\s*\(/.test(source))return{passed:false,reason:'Inspect the value with type(value); do not print a hard-coded answer.'};
 return{passed:true,reason:challenge.tests[0]?.description??'Challenge cleared.',testId:challenge.tests[0]?.id};
}
