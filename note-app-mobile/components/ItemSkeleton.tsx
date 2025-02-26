import React, { useRef, useEffect } from "react";
import { View, Animated, StyleSheet } from "react-native";

const ItemSkeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 50],
  });

  return (
    <View style={styles.container}>
      <View style={styles.skeletonItem}>
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [{ translateX: shimmerTranslate }],
            },
          ]}
        />
      </View>
      <View style={styles.skeletonItem}>
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [{ translateX: shimmerTranslate }],
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
    backgroundColor: "#404040",
    borderRadius: 10,
    padding: 10,
  },
  skeletonItem: {
    height: 30,
    marginHorizontal: 10,
    backgroundColor: "#e0e0e0",
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  shimmer: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    position: "absolute",
    top: 0,
    left: 0,
  },
});

export default ItemSkeleton;
