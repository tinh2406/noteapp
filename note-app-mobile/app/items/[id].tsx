import { ThemedButton } from "@/components/ThemedButton";
import { ThemedIonicons } from "@/components/ThemedIcon";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useItemList } from "@/hooks/useItemList";
import { usePlay } from "@/hooks/usePlay";
import axios from "@/utils/apiHelper";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";

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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <ThemedIonicons
            name="arrow-back"
            onPress={() => {
              router.back();
            }}
            size={24}
            style={{
              padding: 10,
            }}
          />
          <ThemedText type="subtitle">Text</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
};

const Page = () => {
  const { id } = useLocalSearchParams();

  const list = useItemList();

  const [data, setData] = useState(list.data[id.toString()]);
  const [translate, setTranslate] = useState("");

  const play = usePlay();

  useEffect(() => {
    setData(list.data[id.toString()]);
  }, [id, list.data[id.toString()]]);

  const timerId = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
    timerId.current = setTimeout(() => {
      axios
        .post<{ message: string }, { text: string }>("/translate", {
          text: data.text,
        })
        .then((res) => {
          setTranslate(res.message);
        });
    }, 200);
  }, [data.text]);

  return (
    <ThemedView
      style={{
        height: "100%",
      }}
    >
      <Header />
      <ScrollView
        style={{
          height: 250,
        }}
      >
        <ThemedInput
          numberOfLines={10}
          multiline
          value={data.text}
          style={{
            textAlignVertical: "top",
            fontSize: 20,
          }}
          onChangeText={(text) => {
            setData({ ...data, text });
          }}
        />
      </ScrollView>
      <ThemedButton
        onPress={() => {
          play.play(data.text);
        }}
        style={{
          margin: 10,
        }}
      >
        Speak
      </ThemedButton>

      <ScrollView
        style={{
          height: 250,
        }}
      >
        <ThemedText
          numberOfLines={10}
          style={{
            textAlignVertical: "top",
            fontSize: 20,
            padding: 20,
          }}
        >
          {translate}
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
};

export default Page;
