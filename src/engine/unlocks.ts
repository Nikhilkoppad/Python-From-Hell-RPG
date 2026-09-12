import {hellLayers} from '../domain/curriculum';
import {lessonCatalog} from '../domain/lessons';

export function unlockedLayerCount(completedLessons:string[]):number{
 let unlocked=1;
 for(let layer=1;layer<hellLayers.length;layer++){
  const lessons=lessonCatalog.filter(l=>l.layer===layer);
  if(lessons.length===0||lessons.every(l=>completedLessons.includes(l.id)))unlocked=Math.min(hellLayers.length,layer+1);else break;
 }
 return unlocked;
}
export function isLayerUnlocked(layer:number,completedLessons:string[]):boolean{return layer<=unlockedLayerCount(completedLessons)}
