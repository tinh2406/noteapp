import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
type ListType = {
  data: string[];
  addList: (id: string) => void;
  removeList: (id: string) => void;
  unshift: (id: string) => void;
};
export const listKey = "list";

export const useList = create<ListType>((set) => ({
  data: [],
  addList: (id) => set((state) => ({ data: [...state.data, id] })),
  unshift: (id) =>
    set((state) => {
      const data = [id, ...state.data];
      AsyncStorage.setItem(listKey, JSON.stringify(data));
      return { data };
    }),
  removeList: (id) =>
    set((state) => {
      const data = state.data.filter((item) => item !== id);
      AsyncStorage.setItem(listKey, JSON.stringify(data));
      return { data };
    }),
}));

AsyncStorage.getItem(listKey).then((data) => {
  useList.setState({ data: JSON.parse(data || "[]") });
});
