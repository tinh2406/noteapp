import { TextInput, TextInputProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedInput({
  style,
  lightColor,
  darkColor,
  ...rest
}: ThemedInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const borderColor = color + "80";
  const backgroundColor = color + "15";

  return (
    <TextInput
      placeholderTextColor={color + "80"}
      style={[
        {
          color,
          borderColor,
          borderWidth: 1,
          borderRadius: 10,
          paddingHorizontal: 10,
          paddingVertical: 6,
          backgroundColor,
        },
        style,
      ]}
      {...rest}
    ></TextInput>
  );
}
