import { useState } from "react";
import { Text } from "react-native";
import { SvgUri } from "react-native-svg";
import { font } from "../theme";
import { useTheme } from "../context/ThemeContext";

type SkillIconProps = {
  nome: string;
  imagemUrl: string;
  size?: number;
};

export default function SkillIcon({ nome, imagemUrl, size = 44 }: SkillIconProps) {
  const { colors } = useTheme();
  const [failed, setFailed] = useState(!imagemUrl);
  if (failed) {
    return (
      <Text style={{ color: colors.primary, fontSize: size * 0.42, fontFamily: font.bold }}>
        {nome.charAt(0)}
      </Text>
    );
  }
  return (
    <SvgUri uri={imagemUrl} width={size} height={size} onError={() => setFailed(true)} />
  );
}
