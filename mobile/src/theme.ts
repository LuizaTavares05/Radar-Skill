export const colors = {
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
} as const;

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

export const cardShadow = {
  shadowColor: colors.shadow,
  shadowOpacity: 0.08,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 8,
  elevation: 2,
} as const;
