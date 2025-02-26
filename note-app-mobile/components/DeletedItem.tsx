import { Colors } from "@/constants/Colors";
import { useTheme } from "@/hooks/useThemeColor";
import { useRef, useState } from "react";
import { Animated, Pressable, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { ThemedButton, ThemedButtonProps } from "./ThemedButton";
import { ThemedMaterialIcons } from "./ThemedIcon";
import { ThemedText } from "./ThemedText";
import { ItemEntity } from "@/hooks/useItemList";
import axios from "@/utils/apiHelper";
import { useDeletedList } from "@/hooks/useDeletedList";

type DeletedItemProps = {
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
  const deletedList = useDeletedList();

  return (
    <>
      <ThemedText style={{ flex: 1 }} type="default">
        {item.text}
      </ThemedText>
      <ThemedButton
        style={{
          padding: 4,
          backgroundColor: "#00bbdc",
          margin: 5,
        }}
        onPress={async () => {
          if (selected) return;
          await axios.post(`/${item._id}/restore`);
          deletedList.removeItem(item._id);
        }}
      >
        <ThemedMaterialIcons
          name="restore-from-trash"
          size={24}
          lightColor="white"
        />
      </ThemedButton>
    </>
  );
};

const DeletedItem = ({
  item,
  selected,
  onLeftSwipe,
  onRightSwipe,
  style,
  ...rest
}: DeletedItemProps) => {
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
              name="restore-from-trash"
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
export default DeletedItem;
