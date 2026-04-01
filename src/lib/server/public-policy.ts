const SAFE_MODE = /^(1|true|yes)$/i.test(process.env.ML_PUBLIC_SAFE_MODE ?? "");

export function isPublicPersonaAllowed(_personaId: string): boolean {
  return true;
}

export function getPublicPolicy() {
  return {
    safeMode: SAFE_MODE,
  };
}
