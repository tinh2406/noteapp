import { useThemeColor } from "@/hooks/useThemeColor";
import {
  AntDesign,
  Ionicons,
  FontAwesome,
  Fontisto,
  Foundation,
  MaterialIcons
} from "@expo/vector-icons";
import { useEffect } from "react";

export type ThemedCommonProps = {
  darkColor?: string;
  lightColor?: string;
};

export type AntDesignProps = React.ComponentProps<typeof AntDesign> &
  ThemedCommonProps;
export type IoniconsProps = React.ComponentProps<typeof Ionicons> & ThemedCommonProps;
export type FontAwesomeProps = React.ComponentProps<typeof FontAwesome> &
  ThemedCommonProps;
export type FontistoProps = React.ComponentProps<typeof Fontisto> & ThemedCommonProps;
export type FoundationProps = React.ComponentProps<typeof Foundation> &
  ThemedCommonProps;
export type MaterialIconsProps = React.ComponentProps<typeof MaterialIcons> & ThemedCommonProps;

export const ThemedAntDesign = ({
  darkColor,
  lightColor,
  ...props
}: AntDesignProps) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  return <AntDesign {...props} color={color} />;
};

export const ThemedIonicons = ({
  darkColor,
  lightColor,
  ...props
}: IoniconsProps) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  
  useEffect(()=>{
    console.log(color);
    
  },[color])
  
  
  return <Ionicons {...props} color={color} />;
};

export const ThemedFontAwesome = ({
  darkColor,
  lightColor,
  ...props
}: FontAwesomeProps) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  return <FontAwesome {...props} color={color} />;
};

export const ThemedFontisto = ({
  darkColor,
  lightColor,
  ...props
}: FontistoProps) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  return <Fontisto {...props} color={color} />;
};

export const ThemedFoundation = ({
  darkColor,
  lightColor,
  ...props
}: FoundationProps) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  return <Foundation {...props} color={color} />;
};

export const ThemedMaterialIcons = ({
  darkColor,
  lightColor,
  ...props
}: MaterialIconsProps) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  
  return <MaterialIcons {...props} color={color} />;
};