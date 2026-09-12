import {readFile} from 'node:fs/promises';

const lessons=await readFile('src/domain/lessons.ts','utf8');
const curriculum=await readFile('src/domain/curriculum.ts','utf8');
const app=await readFile('src/App.tsx','utf8');
const requiredLayers=Array.from({length:12},(_,i)=>i+1);
for(const layer of requiredLayers){
 if(!new RegExp(`layer:${layer}\\b`).test(lessons))throw new Error(`Missing lesson coverage for layer ${layer}`);
 if(!new RegExp(`number:${layer}\\b`).test(curriculum))throw new Error(`Missing curriculum layer ${layer}`);
}
const lessonCount=(lessons.match(/id:'l/g)||[]).length;
if(lessonCount<50)throw new Error(`Expected a deep curriculum, found only ${lessonCount} lesson entries`);
if(!/LessonWorkspace/.test(app))throw new Error('Lesson workspace is not wired into the app');
if(/alert\s*\(/.test(app))throw new Error('Fake alert-based interaction remains in the app');
if(/onClick=\{\(\)=>\{\}\}/.test(app))throw new Error('Empty click handler detected');
console.log(`Content checks passed: ${lessonCount} lesson entries across 12 Hell layers.`);
