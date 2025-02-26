import DeletedItem from "@/components/DeletedItem";
import NoData from "@/components/NoData";
import { ThemedAntDesign, ThemedMaterialIcons } from "@/components/ThemedIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useDeletedList } from "@/hooks/useDeletedList";
import { useItemList } from "@/hooks/useItemList";
import axios from "@/utils/apiHelper";
import { useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

type HeaderProps = {
  seletedIds: string[];
  setSeletedIds: (ids: string[]) => void;
};
const Header = ({ seletedIds, setSeletedIds }: HeaderProps) => {
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
        <ThemedText type="subtitle">Deleted list</ThemedText>
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
            <ThemedMaterialIcons name="restore-from-trash" size={24} />
          </View>
        </View>
      )}
    </ThemedView>
  );
};

const Page = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { data, removeItem } = useDeletedList();

  const itemlist = useItemList();

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
        ListEmptyComponent={NoData}
        renderItem={({ item }) => {
          let selected = selectedIds.includes(item.toString());
          return (
            <DeletedItem
              item={itemlist.data[item]}
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
                }
              }}
              onLeftSwipe={() => {
                console.log("left swipe");
              }}
              onRightSwipe={async () => {
                await axios.post(`/${item}/restore`);
                removeItem(item);
              }}
              selected={selected}
            />
          );
        }}
        keyExtractor={(item) => item.toString()}
      />
    </ThemedView>
  );
};
export default Page;
