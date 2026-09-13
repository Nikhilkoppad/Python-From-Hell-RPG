import { useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { Download, Upload, ShieldCheck } from 'lucide-react';
import type { Progress } from '../types/progress';

type Props = { progress: Progress; setProgress: Dispatch<SetStateAction<Progress>> };
function validProgress(value: unknown): value is Progress {
  if (!value || typeof value !== 'object') return false;
  const p = value as Partial<Progress>;
  return (
    p.version === 3 &&
    typeof p.xp === 'number' &&
    Number.isFinite(p.xp) &&
    p.xp >= 0 &&
    Array.isArray(p.completedLessons) &&
    Array.isArray(p.achievements) &&
    Array.isArray(p.completedBosses) &&
    Array.isArray(p.projectRewards) &&
    Array.isArray(p.debugRewards) &&
    typeof p.attempts === 'object' &&
    p.attempts !== null &&
    typeof p.settings === 'object' &&
    p.settings !== null &&
    typeof p.interview === 'object' &&
    p.interview !== null
  );
}
export function SaveTransferPanel({ progress, setProgress }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const exportSave = () => {
    const payload = JSON.stringify(
      {
        format: 'python-from-hell-save',
        version: 3,
        exportedAt: new Date().toISOString(),
        progress,
      },
      null,
      2,
    );
    const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'python-from-hell-save.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setMessage('Save exported successfully.');
  };
  const importSave = async (file: File) => {
    try {
      const raw = JSON.parse(await file.text()) as {
        format?: string;
        version?: number;
        progress?: unknown;
      };
      const candidate = raw?.progress ?? raw;
      if (!validProgress(candidate))
        throw new Error('This file is not a valid Python From Hell v3 save.');
      setProgress(candidate);
      setMessage('Save imported. Your descent has been restored.');
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Save import failed. Nothing was changed.',
      );
    }
  };
  return (
    <section className="save-transfer">
      <div className="save-transfer-head">
        <div>
          <span className="eyebrow">PORTABLE SAVE // V3</span>
          <h3>Take your descent with you.</h3>
          <p>
            Export a local backup or restore a valid v3 save without touching an invalid import.
          </p>
        </div>
        <ShieldCheck size={22} />
      </div>
      <div className="save-tools">
        <button onClick={exportSave}>
          <Download size={15} /> EXPORT SAVE
        </button>
        <button onClick={() => input.current?.click()}>
          <Upload size={15} /> IMPORT SAVE
        </button>
        <input
          ref={input}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void importSave(file);
            e.currentTarget.value = '';
          }}
        />
      </div>
      {message && (
        <p className="settings-message" role="status">
          {message}
        </p>
      )}
    </section>
  );
}
