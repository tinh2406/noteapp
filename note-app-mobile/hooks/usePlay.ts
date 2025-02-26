import { create } from "zustand";
import * as Speech from "expo-speech";

type PlayType = {
  isPlay: boolean;
  play: (text: string) => void;
  pause: () => void;
};

export const usePlay = create<PlayType>((set, get) => ({
  isPlay: false,
  play: (text: string) => {
    if (get().isPlay) return;
    Speech.speak(text, {
      language: "en",
      onStart: () => {
        set({ isPlay: true });
      },
      onDone: () => {
        set({ isPlay: false });
      },
    });
  },
  pause: () => set({ isPlay: false }),
}));
