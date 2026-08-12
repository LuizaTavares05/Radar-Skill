import { ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Pattern, Rect } from "react-native-svg";
import { colors, font } from "../theme";
import Logo from "./Logo";

type BrandPanelProps = {
  title: string;
  subtitle: string;
  children?: ReactNode;
};

function DotsPattern() {
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
      <Pattern id="brand-dots" width={32} height={32} patternUnits="userSpaceOnUse">
        <Circle cx={1.5} cy={1.5} r={1.5} fill={colors.white} />
      </Pattern>
      <Rect width="100%" height="100%" fill="url(#brand-dots)" />
    </Svg>
  );
}

export default function BrandPanel({ title, subtitle, children }: BrandPanelProps) {
  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryVia, colors.primaryHover]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.panel}
    >
      <View style={styles.dots} pointerEvents="none">
        <DotsPattern />
      </View>
      <View style={styles.content}>
        <Logo light />
        <View style={styles.spacer} />
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          {children}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
  },
  dots: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.25,
  },
  content: {
    flex: 1,
    padding: 48,
  },
  spacer: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontFamily: font.bold,
    color: colors.white,
    lineHeight: 38,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: font.regular,
    color: colors.primaryLightest,
    lineHeight: 24,
  },
});
