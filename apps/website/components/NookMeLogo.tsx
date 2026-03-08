export function NookMeLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="2" fill="#007AFF" />
      <rect x="13" y="3" width="8" height="8" rx="2" fill="#007AFF" opacity="0.6" />
      <rect x="3" y="13" width="8" height="8" rx="2" fill="#007AFF" opacity="0.6" />
      <rect x="13" y="13" width="8" height="8" rx="2" fill="#007AFF" opacity="0.3" />
    </svg>
  );
}
