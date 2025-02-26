import { useDeletedList } from "@/hooks/useDeletedList";
import { ItemEntity, useItemList } from "@/hooks/useItemList";
import { useList } from "@/hooks/useList";
import axios, { URL_BASE } from "@/utils/apiHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { io } from "socket.io-client";

const Page = () => {
  useEffect(() => {
    AsyncStorage.getItem("phone").then((phone) => {
      if (phone) {
        router.replace("/authed/home");
        axios._axios.defaults.headers.phone = phone;

        const socket = io(URL_BASE, {
          auth: {
            phone,
          },
        });

        socket.on("connect", () => {
          console.log("socket connected");
        });
        socket.on("disconnect", () => {
          console.log("socket disconnected");
        });

        socket.on("new-text", (data: ItemEntity) => {
          useItemList.setState((state) => {
            return {
              ...state,
              data: { [data._id]: data, ...state.data },
            };
          });
          useList.setState((state) => {
            return {
              ...state,
              data: [data._id, ...state.data],
            };
          });
        });

        socket.on("del-text", (id: string) => {
          useList.setState((state) => {
            const data = state.data.filter((item) => item !== id);
            return {
              ...state,
              data,
            };
          });
          useItemList.setState((state) => {
            const { [id]: _, ...rest } = state.data;
            return {
              ...state,
              data: rest,
            };
          });
        });

        return () => {
          socket.disconnect();
        };
      } else {
        router.replace("/login");
      }
    });
  }, []);

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default Page;
