import { Colors } from "@/constants/Colors";
import { useTheme } from "@/hooks/useThemeColor";
import { useRef, useState } from "react";
import { Animated, Pressable, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { ThemedButtonProps } from "./ThemedButton";
import { ThemedMaterialIcons } from "./ThemedIcon";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { usePlayingList } from "@/hooks/usePlayingList";
import { ItemEntity } from "@/hooks/useItemList";

type PlayingItemProps = {
  item: ItemEntity;
  onLeftSwipe?: () => void;
  onRightSwipe?: () => void;
  selected: boolean;
} & ThemedButtonProps;

const Content = ({
  item,
  selected,
}: {
  item: ItemEntity;
  selected: boolean;
}) => {
  const playingList = usePlayingList();
  return (
    <>
      <ThemedView
        style={{
          width: 24,
          height: 24,
          borderRadius: 50,
          marginRight: 10,
        }}
        darkColor={
          selected ? "#989898" : item.status === "done" ? "#00bbdc" : "#bb3b00"
        }
        lightColor={
          selected ? "#989898" : item.status === "done" ? "#00bbdc" : "#bb3b00"
        }
      >
        {selected && <ThemedMaterialIcons name="check" size={24} />}
      </ThemedView>
      <ThemedText style={{ flex: 1 }} type="default">
        {item.text}
      </ThemedText>

      <ThemedMaterialIcons
        name="delete"
        size={24}
        style={{
          padding: 4,
        }}
        onPress={() => {
          playingList.removeItem(item._id);
        }}
      />
    </>
  );
};

const PlayingItem = ({
  item,
  selected,
  onLeftSwipe,
  onRightSwipe,
  style,
  ...rest
}: PlayingItemProps) => {
  const loading = useRef(false);

  const translateX = useRef(new Animated.Value(0)).current;

  const [moveX, setMoveX] = useState<"left" | "right">();

  const onGestureEvent = (event: any) => {
    const { translationX } = event.nativeEvent;
    Animated.timing(translateX, {
      toValue: translationX,
      duration: 0,
      useNativeDriver: true,
    }).start();
    if (translationX > 0) {
      setMoveX("right");
    } else {
      setMoveX("left");
    }
    if (translationX > 100) {
      if (!loading.current) {
        loading.current = true;
        onRightSwipe && onRightSwipe();
      }
    } else if (translationX < -100) {
      if (!loading.current) {
        loading.current = true;
        onLeftSwipe && onLeftSwipe();
      }
    }
  };

  const theme = useTheme();

  return (
    <Pressable
      {...rest}
      style={{
        zIndex: selected ? 1 : 0,
      }}
    >
      <PanGestureHandler
        activeOffsetX={[-50, 50]}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.END) {
            Animated.timing(translateX, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start();
            loading.current = false;
          }
        }}
      >
        <View
          style={{
            position: "relative",
            marginHorizontal: 5,
            marginTop: 5,

            borderRadius: 5,
            overflow: "hidden",
          }}
        >
          <View
            style={[
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 10,
                borderRadius: 5,
                backgroundColor: selected
                  ? theme === "dark"
                    ? "#616161"
                    : "#c1c1c1"
                  : Colors[theme].backgroundItem,
              },
            ]}
          >
            <Content item={item} selected={selected} />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              padding: 5,
              borderRadius: 5,
              backgroundColor:
                moveX === "right"
                  ? "#00bbdc"
                  : moveX === "left"
                  ? "#bb3b00"
                  : Colors[theme].backgroundItem,
            }}
          >
            <ThemedMaterialIcons
              name="save-alt"
              size={24}
              lightColor={"white"}
              darkColor="white"
            />
            <ThemedMaterialIcons
              name="delete-sweep"
              size={24}
              lightColor={"white"}
              darkColor="white"
            />
          </View>

          <Animated.View
            style={[
              {
                position: "absolute",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 10,
                borderRadius: 5,
                backgroundColor: selected
                  ? theme === "dark"
                    ? "#616161"
                    : "#c1c1c1"
                  : Colors[theme].backgroundItem,
              },
              {
                transform: [{ translateX: translateX }],
              },
            ]}
          >
            <Content item={item} selected={selected} />
          </Animated.View>
        </View>
      </PanGestureHandler>
    </Pressable>
  );
};
export default PlayingItem;
