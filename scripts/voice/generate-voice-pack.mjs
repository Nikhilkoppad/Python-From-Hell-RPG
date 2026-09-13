import fs from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const manifest=path.join(root,'src','engine','voice','voicePack.ts');
const outDir=path.join(root,'public','audio','voice');

const text=await fs.readFile(manifest,'utf8');
const matches=[...text.matchAll(/'([^']+)'\s*:\s*\{\s*actor:'([^']+)'\s*,\s*en:'([^']+)'\s*,\s*hinglish:'([^']+)'/g)];
if(!matches.length)throw new Error('No voice-pack entries found.');

await fs.mkdir(outDir,{recursive:true});
const jobs=[];
for(const [,id,actor,en,hinglish] of matches){
  for(const [language,line] of [['en',en],['hinglish',hinglish]]){
    const file=path.join(outDir,language,actor,`${id}.txt`);
    await fs.mkdir(path.dirname(file),{recursive:true});
    await fs.writeFile(file,line.trim()+'\n','utf8');
    jobs.push({id,actor,language,text:line.trim(),file:path.relative(root,file)});
  }
}

const manifestPath=path.join(root,'public','audio','voice','voice-generation-manifest.json');
await fs.writeFile(manifestPath,JSON.stringify({version:'v1',generatedAt:new Date().toISOString(),engine:'external-local-tts',jobs},null,2)+'\n','utf8');
console.log(`Prepared ${jobs.length} local voice jobs.`);
console.log(`Text manifests: ${path.relative(root,outDir)}`);
console.log('Generate MP3/WAV files with your chosen local TTS engine, preserving each job path.');
