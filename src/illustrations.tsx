import type { ModelloId } from "../shared/config.ts";

const FONT = "Fredoka, 'Trebuchet MS', sans-serif";
const V = "#0f3d2e";
const R = "#ffb3d1";

/** Illustrazioni SVG dei quattro modelli, identiche al mockup approvato. */
export function Illustrazione({ id }: { id: ModelloId }) {
  switch (id) {
    case "sagoma":
      return (
        <svg role="img" aria-label="Illustrazione: portachiavi con la sagoma del logo" width="200" height="150" viewBox="0 0 200 150">
          <circle cx="100" cy="22" r="13" fill="none" stroke={V} strokeWidth="5" />
          <rect x="94" y="32" width="12" height="24" rx="6" fill={V} />
          <path d="M54 94c0-26 18-44 42-44 12 0 20 4 28 4 16 0 26 14 26 30 0 24-20 42-50 42-28 0-46-12-46-32z" fill={R} stroke={V} strokeWidth="5" strokeLinejoin="round" />
          <text x="101" y="101" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="26" fill={V}>LOGO</text>
        </svg>
      );
    case "rotante":
      return (
        <svg role="img" aria-label="Illustrazione: portachiavi rotante con il logo al centro" width="200" height="150" viewBox="0 0 200 150">
          <circle cx="100" cy="20" r="12" fill="none" stroke={V} strokeWidth="5" />
          <rect x="94" y="30" width="12" height="18" rx="6" fill={V} />
          <circle cx="100" cy="94" r="48" fill={V} />
          <circle cx="100" cy="94" r="33" fill={R} />
          <text x="100" y="101" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="19" fill={V}>LOGO</text>
          <path d="M34 84a68 68 0 0 1 24-40" fill="none" stroke={V} strokeWidth="5" strokeLinecap="round" />
          <path d="M46 42l13 1-2 13" fill="none" stroke={V} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M166 104a68 68 0 0 1-24 40" fill="none" stroke={V} strokeWidth="5" strokeLinecap="round" />
          <path d="M154 146l-13-1 2-13" fill="none" stroke={V} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "clicker":
      return (
        <svg role="img" aria-label="Illustrazione: portachiavi clicker con il logo sul tasto" width="200" height="150" viewBox="0 0 200 150">
          <circle cx="50" cy="34" r="12" fill="none" stroke={V} strokeWidth="5" />
          <path d="M58 43l14 15" fill="none" stroke={V} strokeWidth="6" strokeLinecap="round" />
          <rect x="58" y="78" width="100" height="56" rx="16" fill={V} />
          <rect x="66" y="54" width="84" height="56" rx="16" fill={R} stroke={V} strokeWidth="5" />
          <text x="108" y="90" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="22" fill={V}>LOGO</text>
          <path d="M150 38l4-16M164 46l12-10M170 62l16-3" fill="none" stroke={V} strokeWidth="5" strokeLinecap="round" />
        </svg>
      );
    case "nfc":
      return (
        <svg role="img" aria-label="Illustrazione: portachiavi con chip NFC e onde di segnale" width="200" height="150" viewBox="0 0 200 150">
          <circle cx="40" cy="34" r="12" fill="none" stroke={V} strokeWidth="5" />
          <path d="M48 43l14 15" fill="none" stroke={V} strokeWidth="6" strokeLinecap="round" />
          <circle cx="90" cy="90" r="42" fill={R} stroke={V} strokeWidth="5" />
          <text x="90" y="97" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="20" fill={V}>LOGO</text>
          <path d="M146 72a26 26 0 0 1 0 36M160 60a44 44 0 0 1 0 60M174 48a62 62 0 0 1 0 84" fill="none" stroke={V} strokeWidth="5" strokeLinecap="round" />
        </svg>
      );
  }
}
