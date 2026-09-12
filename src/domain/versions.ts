export type PythonTarget={language:string;implementation:string;version:string;notes:string};
export const lessonPythonTarget:PythonTarget={language:'Python',implementation:'CPython',version:'3.13',notes:'Advanced lessons label implementation-specific and version-sensitive behavior explicitly.'};
export const browserRuntimeTarget:PythonTarget={language:'Python',implementation:'CPython via Pyodide',version:'3.14.2',notes:'Browser execution uses Pyodide 314.0.6. This runtime target is separate from CPython 3.13 implementation lessons.'};
export const defaultPythonTarget=lessonPythonTarget;
export function versionLabel(target:PythonTarget=defaultPythonTarget):string{return`${target.implementation} ${target.version}`}
