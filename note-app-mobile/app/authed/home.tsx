import Item from "@/components/Item";
import ItemSkeleton from "@/components/ItemSkeleton";
import ModalAddList from "@/components/modals/ModalAddList";
import NoData from "@/components/NoData";
import {
  ThemedAntDesign,
  ThemedFontAwesome,
  ThemedMaterialIcons,
} from "@/components/ThemedIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useDeletedList } from "@/hooks/useDeletedList";
import { useItemList } from "@/hooks/useItemList";
import { useList } from "@/hooks/useList";
import { useListList } from "@/hooks/useListList";
import { usePlayingList } from "@/hooks/usePlayingList";
import axios from "@/utils/apiHelper";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { RefreshControl, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

type HeaderProps = {
  seletedIds: string[];
  setSeletedIds: (ids: string[]) => void;
};
const Header = ({ seletedIds, setSeletedIds }: HeaderProps) => {
  const [open, setOpen] = useState(false);

  const deletedList = useDeletedList();
  const list = useList();
  const playList = usePlayingList();

  const navigation = useNavigation();

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
        <ThemedText type="title">Home</ThemedText>
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
                  deletedList.addItem(id);
                  setSeletedIds([]);
                });
              }}
            />
            <ThemedMaterialIcons
              name="add"
              size={28}
              onPress={() => setOpen(true)}
            />
            <ThemedFontAwesome
              name="play"
              size={20}
              onPress={() => {
                playList.setList(seletedIds);
                playList.play()
                setSeletedIds([]);
                navigation.navigate("play");
              }}
            />
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const list = useItemList();
  const listList = useListList();
  const deletedList = useDeletedList();
  const { data, removeList } = useList();

  useEffect(() => {
    list.fetchMore();
  }, []);

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
        data={data}
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
                  await axios.post(`/${item}/complete`);
                  removeList(item);
                  deletedList.addItem(item);
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
          else return <ItemSkeleton />;
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
        refreshControl={
          <RefreshControl
            refreshing={list.isFetching}
            onRefresh={() => {
              list.refresh();
            }}
          />
        }
      />
    </ThemedView>
  );
};

export default Page;
