import {readFile} from 'node:fs/promises';

const lessons=await readFile('src/domain/lessons.ts','utf8');
const curriculum=await readFile('src/domain/curriculum.ts','utf8');
const app=await readFile('src/AppV2.tsx','utf8');
const debugging=await readFile('src/domain/debugging.ts','utf8');
const interview=await readFile('src/domain/interview.ts','utf8');
const requiredLayers=Array.from({length:12},(_,i)=>i+1);
for(const layer of requiredLayers){
 if(!new RegExp(`layer:${layer}\\b`).test(lessons))throw new Error(`Missing lesson coverage for layer ${layer}`);
 if(!new RegExp(`number:${layer}\\b`).test(curriculum))throw new Error(`Missing curriculum layer ${layer}`);
}
const lessonCount=(lessons.match(/id:'l/g)||[]).length;
const debugCount=(debugging.match(/id:'/g)||[]).length;
const interviewCount=(interview.match(/q\('i/g)||[]).length;
if(lessonCount<50)throw new Error(`Expected a deep curriculum, found only ${lessonCount} lesson entries`);
if(debugCount<8)throw new Error(`Expected at least 8 debugging cases, found ${debugCount}`);
if(interviewCount!==30)throw new Error(`Expected exactly 30 interview questions, found ${interviewCount}`);
if(!/LessonWorkspace/.test(app))throw new Error('Lesson workspace is not wired into the active app');
if(!/SettingsPanel/.test(app))throw new Error('Settings panel is not wired into the active app');
if(!/DebuggingDungeon/.test(app))throw new Error('Debugging dungeon is not wired into the active app');
if(/alert\s*\(/.test(app))throw new Error('Fake alert-based interaction remains in the active app');
if(/onClick=\{\(\)=>\{\}\}/.test(app))throw new Error('Empty click handler detected');
console.log(`Content checks passed: ${lessonCount} lessons, ${debugCount} debugging cases, 30 interview questions, 12 Hell layers.`);
