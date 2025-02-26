import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePlay } from "./usePlay";
import { useItemList } from "./useItemList";
type PlayingListType = {
  data: string[];
  isPlay: boolean;
  play: () => void;
  pause: () => void;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  setList: (list: string[]) => void;
};
export const playingListKey = "playingList";

export const usePlayingList = create<PlayingListType>((set, get) => ({
  data: [],
  isPlay: false,
  play: async () => {
    set({ isPlay: true });
    let i = 0;
    while (get().isPlay && get().data.length > 0) {
      if (!usePlay.getState().isPlay) {
        usePlay
          .getState()
          .play(useItemList.getState().data[get().data[i++]].text);
        i >= get().data.length ? (i = 0) : i;
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  },
  pause: () => set({ isPlay: false }),
  addItem: (id) =>
    set((state) => {
      if (state.data.includes(id)) return state;
      AsyncStorage.setItem(playingListKey, JSON.stringify([...state.data, id]));
      return { data: [...state.data, id] };
    }),
  removeItem: (id) =>
    set((state) => {
      AsyncStorage.setItem(
        playingListKey,
        JSON.stringify(state.data.filter((item) => item !== id))
      );
      return { data: state.data.filter((item) => item !== id) };
    }),
  setList: (list) => {
    AsyncStorage.setItem(playingListKey, JSON.stringify(list));
    set({ data: list });
  },
}));

AsyncStorage.getItem(playingListKey).then((data) => {
  usePlayingList.setState({ data: JSON.parse(data || "[]") });
  console.log(data);
});
