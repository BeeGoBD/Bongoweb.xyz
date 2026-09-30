// 5-Minute Rotating Security Code System for BongoWeb.xyz
// Unique per client, auto-rotates every 5 minutes, synchronized between Client & Admin

export function getClientSecurityCode(identifier: string, windowOffset: number = 0): string {
  if (!identifier) return '000000';
  const clean = identifier.replace(/[^0-9a-zA-Z]/g, '').toLowerCase();
  
  // 5-minute time window index (300,000 milliseconds)
  const windowIndex = Math.floor(Date.now() / (5 * 60 * 1000)) + windowOffset;
  const seed = `${clean}_${windowIndex}_bongo_auth_security_salt_2026`;
  
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  
  const positive = Math.abs(hash);
  const codeNum = (positive % 900000) + 100000; // 6-digit code
  return String(codeNum);
}

export function getSecurityCodeRemainingSeconds(): number {
  const windowMs = 5 * 60 * 1000;
  const elapsed = Date.now() % windowMs;
  return Math.max(0, Math.floor((windowMs - elapsed) / 1000));
}

export function formatRemainingTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
