export type PythonTarget = {
  language: string;
  implementation: string;
  version: string;
  notes: string;
};

export const defaultPythonTarget: PythonTarget = {
  language: 'Python',
  implementation: 'CPython',
  version: '3.13',
  notes: 'Advanced lessons must label implementation-specific and version-sensitive behavior explicitly.',
};

export function versionLabel(target: PythonTarget = defaultPythonTarget): string {
  return `${target.implementation} ${target.version}`;
}
