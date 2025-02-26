import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "@/utils/apiHelper";
import { listKey, useList } from "./useList";
import { useDeletedList } from "./useDeletedList";

export type ItemEntity = {
  _id: string;
  text: string;
  status: string;
};
export type Meta = {
  page: number;
  take: number;
  hasNextPage?: boolean;
};
type ItemtListType = {
  data: Record<string, ItemEntity>;
  meta: Meta;
  isFetching: boolean;
  isLoading: boolean;
  unshift: (item: ItemEntity) => void;
  addList: (item: ItemEntity) => void;
  removeList: (itemId: string) => void;
  refresh: () => void;
  fetchMore: () => void;
};
export const itemListKey = "itemList";

export const useItemList = create<ItemtListType>((set, get) => ({
  data: {},
  isFetching: false,
  isLoading: false,
  meta: {
    page: 1,
    take: 10,
    hasNextPage: true,
  },
  unshift: (item) =>
    set((state) => {
      const data = { [item._id]: item, ...state.data };
      AsyncStorage.setItem(itemListKey, JSON.stringify(data));
      return { data };
    }),
  addList: (item) =>
    set((state) => ({ data: { ...state.data, [item._id]: item } })),
  removeList: (id) =>
    set((state) => {
      const { [id]: _, ...rest } = state.data;
      AsyncStorage.setItem(itemListKey, JSON.stringify(rest));
      return { data: rest };
    }),
  refresh: () => {
    if (get().isFetching) return;
    set({ isFetching: true });
    set((state) => ({
      meta: {
        page: 1,
        take: state.meta.take,
      },
    }));
    get().fetchMore();
  },

  fetchMore: () => {
    if (get().isLoading) return;
    if (get().meta.page === 1) {
      set({ isLoading: true });

      axios
        .get<{ data: ItemEntity[]; meta: Meta }>("/", {
          params: {
            page: 1,
            take: get().meta.take,
          },
        })
        .then((res) => {
          const data = res.data.reduce(
            (acc: Record<string, ItemEntity>, item) => {
              acc[item._id] = item;
              return acc;
            },
            {}
          );
          set((state) => ({
            data: { ...state.data, ...data },
            meta: {
              page: res.meta.page + 1,
              take: res.meta.take,
              hasNextPage: res.meta.hasNextPage,
            },
          }));
          const dataId = [];
          const deleteId = [];
          for (let i = 0; i < res.data.length; i++) {
            const item = res.data[i];
            if (item.status !== "deleted") {
              dataId.push(item._id);
            } else {
              deleteId.push(item._id);
            }
          }
          useList.setState({ data: dataId });
          useDeletedList.setState({ data: deleteId });
          AsyncStorage.setItem(itemListKey, JSON.stringify(data));
          AsyncStorage.setItem(listKey, JSON.stringify(dataId));
        })
        .catch((err) => {
          console.log(err);
          set({ meta: { page: 2, take: 10, hasNextPage: false } });
        })
        .finally(() => {
          set({ isFetching: false });
          set({ isLoading: false });
        });
    } else if (get().meta.hasNextPage) {
      set({ isLoading: true });

      axios
        .get<{ data: ItemEntity[]; meta: Meta }>("/", {
          params: {
            page: get().meta.page,
            take: get().meta.take,
          },
        })
        .then((res) => {
          const data = res.data.reduce(
            (acc: Record<string, ItemEntity>, item) => {
              acc[item._id] = item;
              return acc;
            },
            {}
          );
          set((state) => ({
            data: { ...state.data, ...data },
            meta: {
              page: res.meta.page + 1,
              take: res.meta.take,
              hasNextPage: res.meta.hasNextPage,
            },
          }));
          const listData = useList.getState().data;
          const deleteData = useDeletedList.getState().data;
          for (let i = 0; i < res.data.length; i++) {
            const item = res.data[i];
            if (
              item.status !== "deleted" &&
              listData.find((id) => id !== item._id)
            ) {
              listData.push(item._id);
            }
            if (
              item.status === "deleted" &&
              !deleteData.find((id) => id !== item._id)
            ) {
              deleteData.push(item._id);
            }
          }

          useList.setState({ data: [...listData] });
          useDeletedList.setState({ data: [...deleteData] });
          set({ isFetching: false });
          set({ isLoading: false });
        })
        .finally(() => {
          set({ isFetching: false });
          set({ isLoading: false });
        });
    }
  },
}));

AsyncStorage.getItem(itemListKey).then((data) => {
  useItemList.setState({ data: JSON.parse(data || "{}") });
});
