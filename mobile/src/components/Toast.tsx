import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { CheckCircle2, Info, X, XCircle } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { font, radius } from "../theme";
import type { Paleta } from "../theme";
import { useTheme } from "../context/ThemeContext";

type TipoToast = "success" | "error" | "info";

type ItemToast = {
  id: number;
  type: TipoToast;
  titulo: string;
  descricao?: string;
};

type Listener = (items: ItemToast[]) => void;

let listeners: Listener[] = [];
let itensToast: ItemToast[] = [];
let proximoId = 0;

const DURATION = 4000;

function emitir() {
  listeners.forEach((listener) => listener([...itensToast]));
}

function adicionar(type: TipoToast, titulo: string, descricao?: string) {
  const item: ItemToast = { id: ++proximoId, type, titulo, descricao };
  itensToast = [...itensToast, item];
  emitir();
  setTimeout(() => remover(item.id), DURATION);
}

function remover(id: number) {
  itensToast = itensToast.filter((item) => item.id !== id);
  emitir();
}

export const toast = {
  success: (titulo: string, descricao?: string) => adicionar("success", titulo, descricao),
  error: (titulo: string, descricao?: string) => adicionar("error", titulo, descricao),
  info: (titulo: string, descricao?: string) => adicionar("info", titulo, descricao),
};

function icones(c: Paleta): Record<TipoToast, { icon: typeof CheckCircle2; color: string; accent: string }> {
  return {
    success: { icon: CheckCircle2, color: c.success, accent: c.success },
    error: { icon: XCircle, color: c.danger, accent: c.danger },
    info: { icon: Info, color: c.primary, accent: c.primary },
  };
}

export default function Toaster() {
  const { colors } = useTheme();
  const styles = useMemoStyles(colors);
  const [items, setItems] = useState<ItemToast[]>([]);
  const insets = useSafeAreaInsets();
  const configs = icones(colors);

  useEffect(() => {
    listeners.push(setItems);
    return () => {
      listeners = listeners.filter((listener) => listener !== setItems);
    };
  }, []);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.container, { top: insets.top + 8, right: 12 }]}
    >
      {items.map((item) => {
        const config = configs[item.type];
        const Icon = config.icon;
        return <ToastCard key={item.id} item={item} config={config} Icon={Icon} />;
      })}
    </View>
  );
}

function ToastCard({
  item,
  config,
  Icon,
}: {
  item: ItemToast;
  config: { color: string; accent: string };
  Icon: typeof CheckCircle2;
}) {
  const { colors } = useTheme();
  const styles = useMemoStyles(colors);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <Animated.View
      role="status"
      style={[
        styles.card,
        { opacity, borderLeftColor: config.accent },
        item.descricao ? null : styles.cardCompact,
      ]}
    >
      <Icon size={20} color={config.color} style={styles.icon} />
      <View style={styles.body}>
        <Text style={styles.titulo} numberOfLines={2}>
          {item.titulo}
        </Text>
        {item.descricao && (
          <Text style={styles.descricao} numberOfLines={3}>
            {item.descricao}
          </Text>
        )}
      </View>
      <Pressable onPress={() => remover(item.id)} hitSlop={8} style={styles.close}>
        <X size={15} color={colors.muted} />
      </Pressable>
    </Animated.View>
  );
}

function useMemoStyles(c: Paleta) {
  return useMemo(() => createStyles(c), [c]);
}

const createStyles = (c: Paleta) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      zIndex: 100,
      width: "88%",
      maxWidth: 384,
    },
    card: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: c.card,
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: c.border,
      borderLeftWidth: 4,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 12,
      shadowColor: c.foreground,
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
      elevation: 6,
    },
    cardCompact: {
      alignItems: "center",
    },
    icon: {
      marginTop: 2,
      marginRight: 12,
    },
    body: {
      flex: 1,
    },
    titulo: {
      fontSize: 14,
      fontFamily: font.semibold,
      color: c.foreground,
      lineHeight: 19,
    },
    descricao: {
      marginTop: 2,
      fontSize: 12,
      fontFamily: font.regular,
      color: c.muted,
      lineHeight: 17,
    },
    close: {
      marginLeft: 8,
      padding: 2,
    },
  });
