import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { colors, font, radius } from "../theme";

type InputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  icon?: LucideIcon;
  secureTextEntry?: boolean;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  error?: string;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoComplete?: TextInputProps["autoComplete"];
  returnKeyType?: TextInputProps["returnKeyType"];
  onSubmitEditing?: () => void;
};

export default function Input({
  label,
  value,
  onChangeText,
  icon: Icon,
  secureTextEntry = false,
  rightIcon,
  onRightIconPress,
  error,
  keyboardType = "default",
  autoCapitalize = "none",
  autoComplete,
  returnKeyType,
  onSubmitEditing,
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null); // 1. Referência adicionada ao TextInput
  const active = focused || value.length > 0;
  const progress = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: active ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [active, progress]);

  const labelTop = progress.interpolate({ inputRange: [0, 1], outputRange: [21, 8] });
  const labelSize = progress.interpolate({ inputRange: [0, 1], outputRange: [14, 11.5] });
  const labelColor = error ? colors.danger : focused ? colors.primary : colors.muted;

  return (
    <View>
      {/* 2. Container transformado em Pressable para acionar o foco caso toque em qualquer lugar */}
      <Pressable
        onPress={() => inputRef.current?.focus()}
        style={[
          styles.field,
          focused && styles.fieldFocused,
          !!error && !focused && styles.fieldError,
        ]}
      >
        {Icon && (
          <View style={styles.iconLeft}>
            <Icon size={18} color={focused ? colors.primary : colors.muted} />
          </View>
        )}
        
        <View style={styles.inputWrap}>
          {}
          <Animated.Text
            pointerEvents="none"
            style={[
              styles.label,
              { top: labelTop, fontSize: labelSize, color: labelColor },
              (active || focused) && styles.labelActive,
            ]}
          >
            {label}
          </Animated.Text>

          <TextInput
            ref={inputRef}
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoComplete={autoComplete}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            accessibilityLabel={label}
            placeholderTextColor={colors.muted}
          />
        </View>

        {rightIcon && (
          <Pressable
            onPress={onRightIconPress}
            style={styles.iconRight}
            hitSlop={8}
            accessibilityLabel={`Mostrar/ocultar ${label.toLowerCase()}`}
          >
            {rightIcon}
          </Pressable>
        )}
      </Pressable>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 58,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  fieldFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 3,
    elevation: 4,
  },
  fieldError: {
    borderColor: colors.danger,
  },
  iconLeft: {
    paddingLeft: 16,
  },
  inputWrap: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
    minHeight: 58,
  },
  label: {
    position: "absolute",
    left: 16,
    color: colors.muted,
    fontFamily: font.regular,
    zIndex: 1,
  },
  labelActive: {
    fontFamily: font.semibold,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    fontFamily: font.regular,
    color: colors.foreground,
    paddingTop: 18,
    paddingBottom: 6,
  },
  iconRight: {
    paddingRight: 16,
    paddingLeft: 4,
  },
  errorText: {
    marginTop: 6,
    marginLeft: 4,
    fontSize: 12,
    color: colors.danger,
    fontFamily: font.medium,
  },
});