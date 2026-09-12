import type {Progress} from '../types/progress';
export function claimOneTimeProjectReward(p:Progress,projectId:string,reward:number):Progress{if(p.projectRewards.includes(projectId))return p;return{...p,projectRewards:[...p.projectRewards,projectId],xp:p.xp+Math.max(0,reward)}}
