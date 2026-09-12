export const XP_REWARDS={lesson:25,challenge:30,noHint:15,debug:40,boss:100,project:150,interview:50};
export const levelFromXp=(xp:number)=>Math.floor(xp/100)+1;
export const xpIntoLevel=(xp:number)=>xp%100;
export const xpToNext=(xp:number)=>100-(xp%100);
