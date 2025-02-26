import { useListList } from "@/hooks/useListList";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedMaterialIcons } from "../ThemedIcon";
import { ThemedInput } from "../ThemedInput";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { usePlayingList } from "@/hooks/usePlayingList";

type ModalAddListProps = {
  visible: boolean;
  onClose: () => void;
  seletedIds: string[];
  setSeletedIds: (ids: string[]) => void;
};

const ModalAddList = ({
  visible,
  onClose,
  seletedIds,
  setSeletedIds,
}: ModalAddListProps) => {
  const list = useListList();

  const [selectedList, setSelectedList] = useState<string[]>([]);
  const [newList, setNewList] = useState<string>("");
  const playingList = usePlayingList();
  const [playingListShow, setPlayingListShow] = useState(true);

  useEffect(() => {
    setPlayingListShow(true);
  }, [selectedList]);

  return (
    <Modal
      visible={visible}
      statusBarTranslucent
      animationType="slide"
      transparent
    >
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            onPress={() => {
              Keyboard.dismiss();
              onClose();
            }}
          />
          <ThemedView
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              paddingBottom: 20,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
            }}
            darkColor="#333"
            lightColor="#fff"
          >
            <View
              style={{
                padding: 10,
                flexDirection: "row",
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <ThemedText type="subtitle">Add to list</ThemedText>
              <Pressable
                disabled={selectedList.length === 0 && !newList}
                onPress={() => {
                  if (newList) {
                    list.addList({
                      text: newList,
                      count: seletedIds.length,
                      items: seletedIds,
                      _id: newList,
                    });
                  }
                  selectedList.forEach((id) => {
                    seletedIds.forEach((item) => {
                      list.addItemToList(id, item);
                    });
                  });
                  setSeletedIds([]);
                  onClose();
                }}
              >
                <ThemedText
                  type={
                    selectedList.length !== 0 || newList
                      ? "defaultSemiBold"
                      : "default"
                  }
                >
                  Save
                </ThemedText>
              </Pressable>
            </View>
            <ScrollView
              style={{
                minHeight: 200,
                maxHeight: 400,
              }}
            >
              {playingListShow && (
                <Pressable
                  style={{
                    padding: 10,
                    paddingHorizontal: 20,
                    flexDirection: "row",
                  }}
                  onPress={() => {
                    selectedList.forEach((id) => {
                      playingList.addItem(id);
                    });
                    setPlayingListShow(false);
                  }}
                >
                  <ThemedMaterialIcons name="add" size={24} />
                  <View
                    style={{
                      marginLeft: 10,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      flex: 1,
                    }}
                  >
                    <ThemedText
                      type="defaultSemiBold"
                      style={{ marginLeft: 10 }}
                    >
                      Playing list
                    </ThemedText>
                    <ThemedText type="default" style={{ marginLeft: 10 }}>
                      {playingList.data.length}
                    </ThemedText>
                  </View>
                </Pressable>
              )}
              {Object.values(list.data).map((item) => (
                <Pressable
                  key={item._id}
                  style={{
                    padding: 10,
                    paddingHorizontal: 20,
                    flexDirection: "row",
                  }}
                  onPress={() => {
                    if (!selectedList?.includes(item._id)) {
                      setSelectedList([...selectedList, item._id]);
                    } else {
                      setSelectedList([
                        ...selectedList.filter((id) => id !== item._id),
                      ]);
                    }
                  }}
                >
                  <ThemedMaterialIcons
                    name={
                      selectedList?.includes(item._id)
                        ? "check-box"
                        : "check-box-outline-blank"
                    }
                    size={24}
                  />
                  <View
                    style={{
                      marginLeft: 10,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      flex: 1,
                    }}
                  >
                    <ThemedText
                      type="defaultSemiBold"
                      style={{ marginLeft: 10 }}
                    >
                      {item.text}
                    </ThemedText>
                    <ThemedText type="default" style={{ marginLeft: 10 }}>
                      {item.count}
                    </ThemedText>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
            <View>
              <ThemedInput
                style={{
                  marginHorizontal: 10,
                  fontSize: 16,
                }}
                placeholder="New list name"
                value={newList}
                onChangeText={setNewList}
              />
            </View>
          </ThemedView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ModalAddList;
