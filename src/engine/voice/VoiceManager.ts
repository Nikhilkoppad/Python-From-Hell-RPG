export type VoiceActor = 'pythosura' | 'learner' | 'narrator' | 'boss' | 'system';

export type VoiceLanguage = 'en' | 'hinglish';

export type VoicePriority = 'low' | 'normal' | 'high' | 'critical';

export type VoiceLine = {
  id: string;
  text: string;
  actor: VoiceActor;
  language: VoiceLanguage;
  priority?: VoicePriority;
  volume?: number;
};

type AudioCache = Map<string, HTMLAudioElement>;

class VoiceManager {
  private cache: AudioCache = new Map();
  private current?: HTMLAudioElement;
  private enabled = true;
  private masterVolume = 0.9;

  /**
   * Voice files live under public/audio/voice/.
   * Example: public/audio/voice/en/pythosura/arrival_01.mp3
   */
  private getPath(line: VoiceLine): string {
    return `/audio/voice/${line.language}/${line.actor}/${line.id}.mp3`;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;

    if (!enabled) {
      this.stop();
    }
  }

  setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));

    if (this.current) {
      this.current.volume = this.masterVolume;
    }
  }

  isEnabled() {
    return this.enabled;
  }

  stop() {
    if (!this.current) return;

    this.current.pause();
    this.current.currentTime = 0;
    this.current = undefined;
  }

  async play(line: VoiceLine): Promise<boolean> {
    if (!this.enabled || typeof window === 'undefined') {
      return false;
    }

    this.stop();

    const path = this.getPath(line);
    let audio = this.cache.get(path);

    if (!audio) {
      audio = new Audio(path);
      audio.preload = 'auto';
      audio.addEventListener('ended', () => {
        if (this.current === audio) {
          this.current = undefined;
        }
      });
      this.cache.set(path, audio);
    }

    audio.volume = Math.max(0, Math.min(1, this.masterVolume * (line.volume ?? 1)));
    this.current = audio;

    try {
      await audio.play();
      return true;
    } catch (error) {
      console.warn(`[VoiceManager] Could not play voice "${line.id}"`, error);

      if (this.current === audio) {
        this.current = undefined;
      }

      return false;
    }
  }

  /**
   * Plays one line and resolves only after the clip ends. This is used by
   * cinematic dialogue where the next character must wait for the previous one.
   */
  async playAndWait(line: VoiceLine): Promise<boolean> {
    if (!this.enabled || typeof window === 'undefined') {
      return false;
    }

    const path = this.getPath(line);
    let audio = this.cache.get(path);

    if (!audio) {
      audio = new Audio(path);
      audio.preload = 'auto';
      this.cache.set(path, audio);
    }

    this.stop();
    audio.volume = Math.max(0, Math.min(1, this.masterVolume * (line.volume ?? 1)));
    this.current = audio;

    return new Promise<boolean>((resolve) => {
      let settled = false;
      const finish = (played: boolean) => {
        if (settled) return;
        settled = true;
        audio!.removeEventListener('ended', onEnded);
        audio!.removeEventListener('error', onError);
        if (this.current === audio) {
          this.current = undefined;
        }
        resolve(played);
      };
      const onEnded = () => finish(true);
      const onError = () => finish(false);

      audio!.addEventListener('ended', onEnded, { once: true });
      audio!.addEventListener('error', onError, { once: true });

      void audio!.play().catch((error) => {
        console.warn(`[VoiceManager] Could not play voice "${line.id}"`, error);
        finish(false);
      });
    });
  }

  async playSequence(lines: VoiceLine[]): Promise<boolean> {
    for (const line of lines) {
      if (!this.enabled) return false;
      const played = await this.playAndWait(line);
      if (!played) return false;
    }
    return lines.length > 0;
  }

  preload(line: VoiceLine) {
    if (typeof window === 'undefined') return;

    const path = this.getPath(line);

    if (this.cache.has(path)) return;

    const audio = new Audio(path);
    audio.preload = 'auto';
    this.cache.set(path, audio);
  }

  clearCache() {
    this.stop();
    this.cache.clear();
  }

  async speak(line: VoiceLine): Promise<boolean> {
    return this.play(line);
  }
}

export const voiceManager = new VoiceManager();

export function voiceLine(
  id: string,
  text: string,
  actor: VoiceActor,
  language: VoiceLanguage,
  options: {
    priority?: VoicePriority;
    volume?: number;
  } = {},
): VoiceLine {
  return {
    id,
    text,
    actor,
    language,
    priority: options.priority ?? 'normal',
    volume: options.volume ?? 1,
  };
}

export function stopVoice() {
  voiceManager.stop();
}
