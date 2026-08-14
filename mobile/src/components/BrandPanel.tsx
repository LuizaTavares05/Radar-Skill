import { useMemo } from "react";
import type { ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Pattern, Rect } from "react-native-svg";
import { font, radius } from "../theme";
import type { Paleta } from "../theme";
import { useTheme } from "../context/ThemeContext";
import Logo from "./Logo";

type BrandPanelProps = {
  title: string;
  subtitle: string;
  children?: ReactNode;
  compact?: boolean;
};

function DotsPattern() {
  const { colors } = useTheme();
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
      <Pattern id="brand-dots" width={32} height={32} patternUnits="userSpaceOnUse">
        <Circle cx={1.5} cy={1.5} r={1.5} fill={colors.white} />
      </Pattern>
      <Rect width="100%" height="100%" fill="url(#brand-dots)" />
    </Svg>
  );
}

export default function BrandPanel({ title, subtitle, children, compact = false }: BrandPanelProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryVia, colors.primaryHover]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.panel, compact && styles.panelCompact]}
    >
      <View style={styles.dots} pointerEvents="none">
        <DotsPattern />
      </View>
      <View style={[styles.content, compact && styles.contentCompact]}>
        <Logo light />
        <View style={compact ? styles.compactSpacer : styles.spacer} />
        <View>
          <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>
          <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>{subtitle}</Text>
          {children}
        </View>
      </View>
    </LinearGradient>
  );
}

const createStyles = (c: Paleta) =>
  StyleSheet.create({
    panel: {
      flex: 1,
    },
    panelCompact: {
      flex: 0,
      borderRadius: radius.lg,
      overflow: "hidden",
    },
    dots: {
      ...StyleSheet.absoluteFillObject,
      opacity: 0.25,
    },
    content: {
      flex: 1,
      padding: 48,
    },
    contentCompact: {
      padding: 24,
    },
    spacer: {
      flex: 1,
    },
    compactSpacer: {
      marginTop: 16,
    },
    title: {
      fontSize: 30,
      fontFamily: font.bold,
      color: c.white,
      lineHeight: 38,
      marginBottom: 12,
    },
    titleCompact: {
      fontSize: 22,
      lineHeight: 28,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: font.regular,
      color: c.primaryLightest,
      lineHeight: 24,
    },
    subtitleCompact: {
      fontSize: 14,
      lineHeight: 20,
    },
  });
