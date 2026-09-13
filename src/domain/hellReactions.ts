export type HellReactionKind='idle'|'assessment-wrong'|'failure'|'runtime-error'|'repeated-failure'|'success'|'mastery'|'hint';
export type HellReaction={emoji:string;en:string;hi:string;sfx:'spark'|'laugh'|'impact'|'chain'|'none'};
const BANK:Record<HellReactionKind,HellReaction[]>= {
 idle:[
  {emoji:'📡',en:'MEME TRANSMISSION',hi:'MEME TRANSMISSION',sfx:'spark'},{emoji:'🤡',en:'CODE REVIEW',hi:'CODE REVIEW',sfx:'laugh'},{emoji:'🧠',en:'BRAIN CELL ALERT',hi:'BRAIN CELL ALERT',sfx:'none'},{emoji:'🐍',en:'SNAKE FACT CHECK',hi:'SNAKE FACT CHECK',sfx:'none'},{emoji:'📞',en:'SENIOR CALL',hi:'SENIOR KA CALL',sfx:'chain'}
 ],
 'assessment-wrong':[
  {emoji:'💀',en:'DIAGNOSTIC DAMAGE',hi:'DIAGNOSTIC KI GAND',sfx:'impact'},{emoji:'🫠',en:'BRAIN.EXE PANICKED',hi:'DIMAAG.EXE HANG',sfx:'laugh'},{emoji:'🚨',en:'KNOWLEDGE ALARM',hi:'KNOWLEDGE ALARM',sfx:'spark'}
 ],
 failure:[
  {emoji:'🤡',en:'YOU WROTE THAT ON PURPOSE?',hi:'YE JAANKE KIYA THA KYA?',sfx:'laugh'},{emoji:'🪦',en:'TRACEBACK FUNERAL',hi:'TRACEBACK KI ANTIM YATRA',sfx:'chain'},{emoji:'🧨',en:'LOGIC EXPLOSION',hi:'LOGIC PHAT GAYA',sfx:'impact'},{emoji:'📉',en:'CONFIDENCE DETECTED. ACCURACY NOT FOUND.',hi:'CONFIDENCE MILA, OUTPUT NAHI.',sfx:'none'}
 ],
 'runtime-error':[
  {emoji:'🔥',en:'RUNTIME FIRE',hi:'RUNTIME MEIN AAG',sfx:'impact'},{emoji:'☠️',en:'EXCEPTION HAS ENTERED THE CHAT',hi:'EXCEPTION CHAT MEIN GHUS GAYA',sfx:'chain'},{emoji:'🚑',en:'SEND HELP. THE INTERPRETER NEEDS IT.',hi:'AMBULANCE BHEJ. INTERPRETER MAR RAHA HAI.',sfx:'impact'}
 ],
 'repeated-failure':[
  {emoji:'📞',en:'SENIOR ENGINEER ESCALATION',hi:'SENIOR ENGINEER KO BULAAO',sfx:'chain'},{emoji:'🧎',en:'THE THIRD NEURON IS PRAYING',hi:'TEESRA NEURON BHAGWAN SE BAAT KAR RAHA',sfx:'none'},{emoji:'🔁',en:'SAME MISTAKE ANY% SPEEDRUN',hi:'WAHI GALTI ANY% SPEEDRUN',sfx:'laugh'},{emoji:'🫡',en:'WE WILL TRY THIS AGAIN. APPARENTLY.',hi:'PHIR SE KARENGE. KYUNKI TU MANEGA NAHI.',sfx:'none'}
 ],
 success:[
  {emoji:'👀',en:'WAIT. THAT WORKED?',hi:'RUK. YE SAHI HUA?',sfx:'spark'},{emoji:'🗿',en:'PYTHONSURA STARES IN SILENCE',hi:'PYTHONSURA CHUP HO GAYA',sfx:'none'},{emoji:'🔥',en:'BRAIN CELLS HAVE CLOCKED IN',hi:'BRAIN CELLS AAJ DUTY PE HAIN',sfx:'spark'}
 ],
 mastery:[
  {emoji:'👑',en:'CONCEPT CLAIMED',hi:'CONCEPT KABZE MEIN',sfx:'spark'},{emoji:'🐍',en:'THE SNAKE NODS. BARELY.',hi:'SAAP NE SIRF THODA SA SAR HILAYA.',sfx:'laugh'},{emoji:'💥',en:'GATE BREACHED',hi:'GATE TOD DIYA',sfx:'impact'}
 ],
 hint:[
  {emoji:'🕯️',en:'TINY NUDGE INCOMING',hi:'CHHOTA SA ISHARA AA RAHA',sfx:'spark'},{emoji:'🧠',en:'BRAIN CELL FED',hi:'DIMAAG KO BISCUIT MILA',sfx:'none'}
 ]
};
function hash(s:string){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0}
export function pickHellReaction(kind:HellReactionKind,seed:string):HellReaction{const list=BANK[kind];return list[hash(seed)%list.length]}
export const hellReactionBank=BANK;
