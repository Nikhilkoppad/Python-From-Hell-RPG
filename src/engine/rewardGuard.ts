import type {Progress} from '../types/progress';
import {awardXp} from './progress';
export function claimOneTimeProjectReward(p:Progress,projectId:string,reward:number):Progress{if(p.projectRewards.includes(projectId))return p;return awardXp({...p,projectRewards:[...p.projectRewards,projectId]},Math.max(0,reward))}
