import type {BossPhase} from '../domain/bosses';
import type {Lesson} from '../domain/lessons';
import type {PythonRunner,RunResult} from '../execution/PythonRunner';
import {evaluateLessonChallenge} from './challengeRunner';

export type BossPhaseResult={passed:boolean;reason:string;hiddenChecked?:boolean};

export async function evaluateBossPhase(phase:BossPhase,source:string,visible:RunResult,runner:PythonRunner):Promise<BossPhaseResult>{
 const lesson:Lesson={
  id:`boss:${phase.name.toLowerCase().replace(/\s+/g,'-')}`,
  layer:1,
  topic:phase.concept,
  title:phase.name,
  brief:phase.objective,
  explanation:phase.objective,
  roast:'The boss does not care about excuses. The evaluator checks the behavior.',
  difficulty:'ADVANCED',
  minutes:1,
  starterCode:phase.starterCode,
  expectedOutput:phase.expectedOutput,
  hints:[],
  challenge:phase.challenge,
 };
 const result=await evaluateLessonChallenge(lesson,source,visible,runner);
 return{passed:result.passed,reason:result.reason,hiddenChecked:result.hiddenChecked};
}
