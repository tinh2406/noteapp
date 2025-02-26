import {
  ActivityIndicator,
  type ButtonProps,
  PressableProps,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedButtonProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  lightBackground?: string;
  loading?: boolean;
  darkBackground?: string;
  type?: "default" | "outline" | "link";
};

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  lightBackground,
  darkBackground,
  disabled,
  loading,
  type = "default",
  ...rest
}: ThemedButtonProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const background = useThemeColor(
    { light: lightBackground, dark: darkBackground },
    "backgroundBtn"
  );

  const {
    //@ts-ignore
    margin,
    //@ts-ignore
    marginTop,
    //@ts-ignore
    marginBottom,
    //@ts-ignore
    marginEnd,
    //@ts-ignore
    marginHorizontal,
    //@ts-ignore
    marginLeft,
    //@ts-ignore
    marginRight,
    //@ts-ignore
    marginStart,
    //@ts-ignore
    marginVertical,
    //@ts-ignore
    ...otherStyles
  } = style||{};

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        {
          backgroundColor: disabled || loading ? "#c7c7c7" : background,
          borderRadius: 5,
          overflow: "hidden",
          margin,
          marginBottom,
          marginEnd,
          marginHorizontal,
          marginLeft,
          marginRight,
          marginStart,
          marginVertical,
          marginTop,
        },
        //@ts-ignore
        style,
      ]}
      disabled={disabled || loading || undefined}
      {...rest}
    >
      {typeof rest.children === "string" ? (
        loading ? (
          <ActivityIndicator
            color={color}
            size={21}
            style={{
              padding: 10,
            }}
          />
        ) : (
          <Text
            style={[
              { color },
              type === "default"
                ? {
                    fontWeight: "bold",
                    fontSize: 16,
                    padding: 10,
                    textAlign: "center",
                    backgroundColor: "transparent",
                  }
                : undefined,
              type === "outline"
                ? {
                    fontWeight: "bold",
                    fontSize: 16,
                    padding: 10,
                    textAlign: "center",
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: background,
                    color: background,
                  }
                : undefined,
              type === "link"
                ? {
                    fontWeight: "bold",
                    fontSize: 16,
                    padding: 10,
                    textAlign: "center",
                    backgroundColor: "transparent",
                    color: background,
                  }
                : undefined,
              //@ts-ignore
              otherStyles,
            ]}
            {...(rest as ButtonProps)}
          ></Text>
        )
      ) : (
        rest.children
      )}
    </TouchableOpacity>
  );
}
