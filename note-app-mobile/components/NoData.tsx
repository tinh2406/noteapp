import { View } from "react-native";
import { ThemedText } from "./ThemedText";

const NoData = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ThemedText>No Data</ThemedText>
    </View>
  );
};

export default NoData;
