import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import axios, { useMutation } from "@/utils/apiHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { useWindowDimensions } from "react-native";

const login = async (phone: string) => {
  const res = await axios.post<{ message: boolean }, { phone: string }>("/", {
    phone,
  });
  return res;
};

const Page = () => {
  const h = useWindowDimensions().height;

  const [phone, setPhone] = useState("");

  const { isLoading, mutate } = useMutation({
    fn: login,
    onSuccess: (data) => {
      if (data.message) {
        axios._axios.defaults.headers.phone = phone;
        AsyncStorage.setItem("phone", phone);
        // Redirect({ href: "/authed" });
        router.replace("/");
      }
    },
  });

  const handleLogin = () => {
    mutate(phone);
  };

  return (
    <ThemedView
      style={{
        height: h,
      }}
    >
      <ThemedText
        type="title"
        style={{
          marginTop: h / 10,
          padding: 10,
        }}
      >
        Type phone to login
      </ThemedText>
      <ThemedInput
        style={{
          marginTop: h / 10,
          marginHorizontal: 10,
          fontSize: 16,
        }}
        keyboardType="phone-pad"
        placeholder="Phone number"
        value={phone}
        onChangeText={setPhone}
      />
      <ThemedButton
        disabled={phone.length < 10}
        loading={isLoading}
        onPress={handleLogin}
        type="default"
        style={{
          marginTop: h / 10,
          marginHorizontal: 10,
        }}
      >
        Login
      </ThemedButton>
    </ThemedView>
  );
};

export default Page;
