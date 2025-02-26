import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
type DeletedListType = {
  data: string[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
};
export const deletedListKey = "deletedList";

export const useDeletedList = create<DeletedListType>((set) => ({
  data: [],
  addItem: (id) =>
    set((state) => {
      if (state.data.includes(id)) return state;
      AsyncStorage.setItem(deletedListKey, JSON.stringify([...state.data, id]));
      return { data: [...state.data, id] };
    }),
  removeItem: (id) =>
    set((state) => {
      AsyncStorage.setItem(
        deletedListKey,
        JSON.stringify(state.data.filter((item) => item !== id))
      );
      return { data: state.data.filter((item) => item !== id) };
    }),
}));

AsyncStorage.getItem(deletedListKey).then((data) => {
  useDeletedList.setState({ data: JSON.parse(data || "[]") });
  console.log(data);
});
