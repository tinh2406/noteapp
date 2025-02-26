import { Colors } from "@/constants/Colors";
import { useTheme } from "@/hooks/useThemeColor";
import { Pressable, View } from "react-native";
import { ThemedButton, ThemedButtonProps } from "./ThemedButton";
import {
  ThemedAntDesign,
  ThemedFontAwesome,
  ThemedMaterialIcons,
} from "./ThemedIcon";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { PlaylistEntity } from "@/hooks/useListList";

type PlaylistProps = {
  item: PlaylistEntity;
  selected: boolean;
} & ThemedButtonProps;

const Content = ({
  item,
  selected,
}: {
  item: PlaylistEntity;
  selected: boolean;
}) => {
  return (
    <>
      <ThemedView
        style={{
          width: 24,
          height: 24,
          borderRadius: 50,
          marginHorizontal: 4,
          backgroundColor: "transparent",
        }}
      >
        {selected && <ThemedMaterialIcons name="check" size={24} />}
      </ThemedView>
      <View style={{ flex: 1 }}>
        <ThemedText
          numberOfLines={2}
          style={{
            width: "100%",
          }}
          ellipsizeMode="tail"
          type="defaultSemiBold"
        >
          {item.text}
        </ThemedText>
        <ThemedText
          style={{
            width: "100%",
          }}
          type="default"
          numberOfLines={1}
        >
          {item.count}
        </ThemedText>
      </View>
      <ThemedFontAwesome style={{ padding: 2 }} name="play" size={20} />
    </>
  );
};

const PlaylistItem = ({ item, selected, style, ...rest }: PlaylistProps) => {
  const theme = useTheme();

  return (
    <Pressable
      {...rest}
      style={{
        zIndex: selected ? 1 : 0,
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
              paddingVertical: 10,
              paddingRight: 10,
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
      </View>
    </Pressable>
  );
};
export default PlaylistItem;
