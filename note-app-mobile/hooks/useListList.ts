import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export type PlaylistEntity = {
  _id: string;
  text: string;
  count: number;
  items: string[];
};

type ListListType = {
  data: Record<string, PlaylistEntity>;
  addItemToList: (listId: string, itemId: string) => void;
  removeItemFromList: (listId: string, itemId: string) => void;
  addList: (list: PlaylistEntity) => void;
  removeList: (listId: string) => void;
};

export const listListKey = "listList";
export const useListList = create<ListListType>((set, get) => ({
  data: {},
  addList: (list) => {
    set((state) => {
      AsyncStorage.setItem(
        listListKey,
        JSON.stringify({ ...state.data, [list._id]: list })
      );
      return { data: { ...state.data, [list._id]: list } };
    });
  },
  addItemToList: (listId, itemId) =>
    set((state) => {
      const list = state.data[listId];

      if (!list.items.includes(itemId)) {
        list.items.push(itemId);

        list.count = list.items.length;

        set((state) => {
          AsyncStorage.setItem(
            listListKey,
            JSON.stringify({ ...state.data, [listId]: { ...list } })
          );
          return { data: { ...state.data, [listId]: { ...list } } };
        });
      }
      return state;
    }),
  removeItemFromList: (listId, itemId) => {
    set((state) => {
      const list = state.data[listId];
      list.items = list.items.filter((item) => item !== itemId);
      list.count = list.items.length;
      AsyncStorage.setItem(
        listListKey,
        JSON.stringify({ ...state.data, [listId]: list })
      );
      return { data: { ...state.data, [listId]: list } };
    });
  },
  removeList: (listId) =>
    set((state) => {
      const { [listId]: _, ...rest } = state.data;
      AsyncStorage.setItem(listListKey, JSON.stringify(rest));
      return { data: rest };
    }),
}));

AsyncStorage.getItem(listListKey).then((data) => {
  useListList.setState({ data: JSON.parse(data || "{}") });
});
