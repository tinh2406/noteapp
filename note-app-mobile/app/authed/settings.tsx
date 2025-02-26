import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ScrollView } from "react-native";

type HeaderProps = {};
const Header = ({}: HeaderProps) => {
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
      <ThemedText type="subtitle">Settings</ThemedText>
    </ThemedView>
  );
};

const Page = () => {
  return (
    <ThemedView
      style={{
        height: "100%",
      }}
    >
      <Header />
      <ScrollView bounces={false} overScrollMode="never" bouncesZoom={false}>
        <ThemedButton
          type="default"
          style={{
            marginHorizontal: 10,
          }}
          darkBackground="#c83016"
          lightColor="white"
          lightBackground="#ea6919"
          onPress={() => {
            AsyncStorage.clear()
            router.replace("/login");
          }}
        >
          Logout
        </ThemedButton>
      </ScrollView>
    </ThemedView>
  );
};
export default Page;
