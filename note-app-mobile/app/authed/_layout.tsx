import { IoniconsProps } from "@/components/ThemedIcon";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { router, Tabs, useNavigation, usePathname } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Home from "./home";
import List from "./list";
import Play from "./play";
import Settings from "./settings";
import Trash from "./trash";
import { useTheme } from "@/hooks/useThemeColor";
import { usePlayingList } from "@/hooks/usePlayingList";

const w = Dimensions.get("window").width;
const iconWidth = 50;
const dividerWidth = (w - iconWidth * 5) / 10;

const tabs: {
  name: IoniconsProps["name"];
  component: () => React.JSX.Element;
  color?: string;
}[] = [
  {
    name: "home",
    component: Home,
    color: "#006b05",
  },
  {
    name: "list",
    component: List,
    color: "#006b05",
  },
  {
    name: "play",
    component: Play,
    color: "#006b05",
  },
  {
    name: "trash",
    component: Trash,
    color: "#ad1002",
  },
  {
    name: "settings",
    component: Settings,
    color: "#006b05",
  },
];

const TabBar = () => {
  const left = useSharedValue(0);
  const duration = useSharedValue(0);

  ///// log current tab
  const pathName = usePathname();

  const playList = usePlayingList();

  useEffect(() => {
    const index = tabs.findIndex(({ name }) => pathName.includes(name));
    left.value = index;
  }, [pathName]);

  const navigation = useNavigation();
  const animStyle = useAnimatedStyle(() => {
    return {
      left: withTiming(
        dividerWidth * (2 * left.value + 1) + left.value * iconWidth,
        {
          duration: duration.value,
          easing: Easing.ease,
        }
      ),
    };
  });
  const theme = useTheme();

  return (
    <ThemedView
      style={{
        position: "relative",
        height: 60,

        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,

        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            width: iconWidth,
            height: iconWidth,
            borderRadius: 50,
            backgroundColor: pathName.includes("trash") ? "#ad1002" : "#006b05",

            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          },
          animStyle,
        ]}
      />
      {tabs.map(({ name }, index) => (
        <Ionicons
          key={index}
          name={name !== "play" ? name : playList.isPlay ? "pause" : "play"}
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
          color={
            pathName.includes(name)
              ? "white"
              : theme === "light"
              ? "black"
              : "white"
          }
          size={24}
          onPress={() => {
            if (name !== "play" || !pathName.includes("play")) {
              duration.value =
                ((200 - Math.abs(index - left.value) * 20) *
                  Math.abs(index - left.value)) /
                2;
              left.value = index;
              navigation.navigate(name);
            } else {
              if (playList.isPlay) {
                playList.pause();
              } else {
                playList.play();
              }
            }
          }}
        />
      ))}
    </ThemedView>
  );
};

// const Tab = createMaterialTopTabNavigator();

const Layout = () => {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {/* <Tab.Navigator
        initialRouteName="home"
        screenOptions={{
          tabBarStyle: {
            display: "none",
          },
        }}
      >
        {tabs.map(({ name, component }, index) => (
          <Tab.Screen key={index} name={name} component={component} />
        ))}
      </Tab.Navigator> */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      />
      <TabBar />
    </View>
  );
};

export default Layout;
