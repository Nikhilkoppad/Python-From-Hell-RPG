export type HellLayer={id:string;number:number;name:string;tagline:string;status:'available'|'locked';topics:string[]};
export const hellLayers:HellLayer[]=[
{id:'entrance',number:1,name:'THE ENTRANCE',tagline:'Where innocent syntax comes to die.',status:'available',topics:['print()','comments','variables','strings','ints','floats','booleans','input()','type conversion']},
{id:'condition-pit',number:2,name:'THE CONDITION PIT',tagline:'Every branch leads somewhere.',status:'locked',topics:['if','elif','else','comparisons','logical operators','truthiness','short-circuiting','nested conditions']},
{id:'loop-abyss',number:3,name:'THE LOOP ABYSS',tagline:'There is no escape. Only iteration.',status:'locked',topics:['for','while','range()','break','continue','nested loops','loop invariants']},
{id:'collection-graveyard',number:4,name:'COLLECTION GRAVEYARD',tagline:'Where indexes go to get out of range.',status:'locked',topics:['lists','tuples','sets','dictionaries','indexing','slicing','iteration','mutability']},
{id:'function-forge',number:5,name:'FUNCTION FORGE',tagline:'Parameters. Scope. Consequences.',status:'locked',topics:['functions','parameters','arguments','return','default arguments','*args/**kwargs','scope','closures','nonlocal']},
{id:'object-crypt',number:6,name:'OBJECT CRYPT',tagline:'Everything is an object. Good luck.',status:'locked',topics:['classes','objects','__init__','attributes','methods','inheritance','polymorphism','encapsulation','dunder methods']},
{id:'exception-hell',number:7,name:'EXCEPTION HELL',tagline:'The traceback knows what you did.',status:'locked',topics:['exceptions','try/except','finally','raise','custom exceptions','tracebacks','debugging methodology']},
{id:'runtime-hell',number:8,name:'PYTHON RUNTIME',tagline:'Now the language starts showing its teeth.',status:'locked',topics:['iterators','generators','decorators','context managers','modules','packages','imports','descriptors','MRO']},
{id:'concurrency',number:9,name:'CONCURRENCY',tagline:'Two threads. Three bugs. One headache.',status:'locked',topics:['threading','multiprocessing','synchronization','locks','race conditions','async/await','asyncio','cooperative concurrency']},
{id:'memory',number:10,name:'MEMORY HELL',tagline:'References have consequences.',status:'locked',topics:['references','identity vs equality','reference counting','garbage collection','allocation','object lifetime','memory behavior','CPython labels']},
{id:'cpython',number:11,name:'CPYTHON DEEP HELL',tagline:'Implementation details. Finally.',status:'locked',topics:['source architecture','code objects','bytecode','dis','PyObject','object headers','allocators','interpreter execution','GDB','C extensions']},
{id:'core',number:12,name:'THE CORE',tagline:'Explain the runtime. Survive the interview.',status:'locked',topics:['subinterpreters','free-threading','GIL behavior','experimental JIT','performance','runtime architecture','build configuration','interview battle']},
];
