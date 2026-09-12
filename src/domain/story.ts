export type StoryEvent={id:string;trigger:'enter'|'layer-unlock'|'lesson-complete'|'boss'|'interview'|'core';title:string;speaker:'PYTHONSURA'|'SYSTEM'|'INTERVIEWER';text?:string;lines:string[]};
export const storyEvents:StoryEvent[]=[
{id:'gate-open',trigger:'enter',title:'THE DESCENT BEGINS',speaker:'PYTHONSURA',text:'You wanted practical Python. Adorable.',lines:['You wanted practical Python. Adorable.','Start small. Survive the first traceback.']},
{id:'first-blood',trigger:'lesson-complete',title:'FIRST BLOOD',speaker:'SYSTEM',text:'Lesson cleared. Knowledge acquired. Confidence remains dangerously high.',lines:['Lesson cleared.','Knowledge acquired. Confidence remains dangerously high.']},
{id:'layer-two',trigger:'layer-unlock',title:'THE CONDITION PIT OPENS',speaker:'PYTHONSURA',text:'Congratulations. You have discovered that computers can choose.',lines:['Congratulations. You have discovered that computers can choose.','They can also choose wrong.']},
{id:'interview-gate',trigger:'interview',title:'WELCOME TO THE COLISEUM',speaker:'INTERVIEWER',text:'Your résumé has entered the arena.',lines:['Your résumé has entered the arena.','Your first answer decides whether I keep reading.']},
{id:'the-core',trigger:'core',title:'THE CORE IS AWAKE',speaker:'PYTHONSURA',text:'The language was the tutorial. Now you meet the implementation.',lines:['The language was the tutorial.','Now you meet the implementation.']},
];
export function storyEventFor(trigger:StoryEvent['trigger'],id?:string){return storyEvents.find(e=>e.trigger===trigger&&(!id||e.id===id))??storyEvents.find(e=>e.trigger===trigger)}
export function nextStoryEvent(completedCount:number):StoryEvent|undefined{
 if(completedCount>=30)return storyEvents.find(e=>e.id==='the-core');
 if(completedCount>=8)return storyEvents.find(e=>e.id==='layer-two');
 if(completedCount>=1)return storyEvents.find(e=>e.id==='first-blood');
 return storyEvents.find(e=>e.id==='gate-open');
}
