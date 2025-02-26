import ItemSkeleton from "@/components/ItemSkeleton";
import NoData from "@/components/NoData";
import PlayingItem from "@/components/PlayingItem";
import { ThemedAntDesign, ThemedMaterialIcons } from "@/components/ThemedIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useItemList } from "@/hooks/useItemList";
import { useListList } from "@/hooks/useListList";
import { usePlayingList } from "@/hooks/usePlayingList";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

type HeaderProps = {
  seletedIds: string[];
  setSeletedIds: (ids: string[]) => void;
};
const Header = ({ seletedIds, setSeletedIds }: HeaderProps) => {
  const playingList = usePlayingList();
  return (
    <ThemedView
      style={{
        height: 60,
        justifyContent: "center",
        paddingHorizontal: 10,

        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
      }}
    >
      {seletedIds.length === 0 ? (
        <ThemedText type="subtitle">Playing</ThemedText>
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <ThemedAntDesign
              name="close"
              onPress={() => {
                setSeletedIds([]);
              }}
              size={24}
              style={{
                padding: 10,
              }}
            />
            <ThemedText type="subtitle">
              {seletedIds.length} selected
            </ThemedText>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
              marginRight: 10,
            }}
          >
            <ThemedMaterialIcons
              name="delete"
              size={21}
              onPress={() => {
                seletedIds.forEach((id) => {
                  playingList.removeItem(id);
                });
                setSeletedIds([]);
              }}
            />
          </View>
        </View>
      )}
    </ThemedView>
  );
};

const Page = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const list = useItemList();
  const listList = useListList();
  const playingList = usePlayingList();

  return (
    <ThemedView
      style={{
        height: "100%",
      }}
    >
      <Header seletedIds={selectedIds} setSeletedIds={setSelectedIds} />
      <FlatList
        bounces={false}
        overScrollMode="never"
        bouncesZoom={false}
        data={playingList.data}
        ListEmptyComponent={NoData}
        renderItem={({ item }) => {
          let selected = selectedIds.includes(item.toString());
          if (list.data[item])
            return (
              <PlayingItem
                item={list.data[item]}
                onLongPress={() => {
                  if (selected) {
                    setSelectedIds(
                      selectedIds.filter((id) => id !== item.toString())
                    );
                  } else {
                    setSelectedIds([...selectedIds, item.toString()]);
                  }
                }}
                onPress={() => {
                  if (selectedIds.length > 0) {
                    if (selected) {
                      setSelectedIds(
                        selectedIds.filter((id) => id !== item.toString())
                      );
                    } else {
                      setSelectedIds([...selectedIds, item.toString()]);
                    }
                  } else {
                    router.push(`/items/${item}`);
                  }
                }}
                onLeftSwipe={async () => {
                  playingList.removeItem(item);
                }}
                onRightSwipe={async () => {
                  let list = listList.data["saved"];

                  if (list) {
                    listList.addItemToList("saved", item);
                  } else {
                    listList.addList({
                      items: [item],
                      _id: "saved",
                      text: "Saved",
                      count: 1,
                    });
                  }
                }}
                selected={selected}
              />
            );
          else {
            if (list.meta.hasNextPage) {
              list.fetchMore();
            } else {
              playingList.removeItem(item);
              return null;
            }
          }
          return <ItemSkeleton />;
        }}
        keyExtractor={(item) => item.toString()}
      />
    </ThemedView>
  );
};

export default Page;
