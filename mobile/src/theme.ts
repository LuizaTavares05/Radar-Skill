export type Paleta = {
  primary: string;
  primaryHover: string;
  primaryVia: string;
  primaryMid: string;
  primarySoft: string;
  primaryLightest: string;
  secondary: string;
  background: string;
  card: string;
  border: string;
  surface: string;
  foreground: string;
  textSecondary: string;
  muted: string;
  success: string;
  successHover: string;
  danger: string;
  dangerHover: string;
  warning: string;
  white: string;
  shadow: string;
  primaryTint: string;
  primaryTintStrong: string;
  dangerTint: string;
};

const paletaClara: Paleta = {
  primary: "#0A4E77",
  primaryHover: "#083F60",
  primaryVia: "#0A5C8A",
  primaryMid: "#3E7EA6",
  primarySoft: "#7FA6C0",
  primaryLightest: "#C9DEEB",
  secondary: "#505D61",
  background: "#F9FCFD",
  card: "#FFFFFF",
  border: "#DCDEDF",
  surface: "#F1F5F8",
  foreground: "#263238",
  textSecondary: "#505D61",
  muted: "#7A8589",
  success: "#2E7D5B",
  successHover: "#245E47",
  danger: "#B94A48",
  dangerHover: "#A1403E",
  warning: "#B7791F",
  white: "#FFFFFF",
  shadow: "#0A4E77",
  primaryTint: "rgba(10, 78, 119, 0.08)",
  primaryTintStrong: "rgba(10, 78, 119, 0.15)",
  dangerTint: "rgba(185, 74, 72, 0.08)",
};

const paletaEscura: Paleta = {
  primary: "#3E7EA6",
  primaryHover: "#2E6E9E",
  primaryVia: "#4E9CC7",
  primaryMid: "#5B9EC0",
  primarySoft: "#8FB8D4",
  primaryLightest: "#C9DEEB",
  secondary: "#A8BBC6",
  background: "#0F1A22",
  card: "#16242E",
  border: "#2A3B48",
  surface: "#1C2B36",
  foreground: "#E8F0F5",
  textSecondary: "#B4C4CE",
  muted: "#8CA0AC",
  success: "#4CAF8B",
  successHover: "#3D9A78",
  danger: "#E2706E",
  dangerHover: "#C95C5A",
  warning: "#D69E3C",
  white: "#FFFFFF",
  shadow: "#000000",
  primaryTint: "rgba(62, 126, 166, 0.18)",
  primaryTintStrong: "rgba(62, 126, 166, 0.30)",
  dangerTint: "rgba(226, 112, 110, 0.15)",
};

export function buildColors(escuro: boolean): Paleta {
  return escuro ? paletaEscura : paletaClara;
}

export const font = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  extrabold: "Inter_800ExtraBold",
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  full: 999,
} as const;

export function buildCardShadow(paleta: Paleta) {
  return {
    shadowColor: paleta.shadow,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  } as const;
}
