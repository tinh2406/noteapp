import Item from "@/components/Item";
import ItemSkeleton from "@/components/ItemSkeleton";
import ModalAddList from "@/components/modals/ModalAddList";
import NoData from "@/components/NoData";
import {
  ThemedAntDesign,
  ThemedFontAwesome,
  ThemedIonicons,
  ThemedMaterialIcons,
} from "@/components/ThemedIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useItemList } from "@/hooks/useItemList";
import { useList } from "@/hooks/useList";
import { useListList } from "@/hooks/useListList";
import axios from "@/utils/apiHelper";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

type HeaderProps = {
  seletedIds: string[];
  setSeletedIds: (ids: string[]) => void;
};
const Header = ({ seletedIds, setSeletedIds }: HeaderProps) => {
  const { id } = useLocalSearchParams();

  const [open, setOpen] = useState(false);

  const listList = useListList();
  const list = useList();

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
            <ThemedIonicons
              name="arrow-back"
              onPress={() => {
                router.back();
              }}
              size={24}
              style={{
                padding: 10,
              }}
            />
            <ThemedText type="subtitle">
              {listList.data[id.toString()].text}
            </ThemedText>
          </View>
        </View>
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
              onPress={async () => {
                seletedIds.forEach(async (id) => {
                  await axios.post(`${id}/complete`);
                  list.removeList(id);
                  setSeletedIds([]);
                });
              }}
            />
            <ThemedMaterialIcons
              name="add"
              size={28}
              onPress={() => setOpen(true)}
            />
            <ThemedFontAwesome name="play" size={20} />
          </View>
        </View>
      )}
      <ModalAddList
        onClose={() => setOpen(false)}
        seletedIds={seletedIds}
        setSeletedIds={setSeletedIds}
        visible={open}
      />
    </ThemedView>
  );
};

const Page = () => {
  const { id } = useLocalSearchParams();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const list = useItemList();
  const listList = useListList();
  const data = listList.data[id.toString()];

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
        data={data.items}
        renderItem={({ item }) => {
          let selected = selectedIds.includes(item.toString());
          if (list.data[item])
            return (
              <Item
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
                  listList.removeItemFromList(id.toString(), item);
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
              listList.removeItemFromList(id.toString(), item);
              return null;
            }
          }
          return <ItemSkeleton />;
        }}
        keyExtractor={(item) => item.toString()}
        // List fetch more on reach end
        onEndReachedThreshold={0.1}
        onEndReached={list.fetchMore}
        ListFooterComponent={() => {
          if (list.isLoading) {
            return <ItemSkeleton />;
          }
          return null;
        }}
        ListEmptyComponent={NoData}
        // Pull to refresh
      />
    </ThemedView>
  );
};

export default Page;
