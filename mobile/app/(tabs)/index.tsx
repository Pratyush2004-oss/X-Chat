import SignoutButton from "@/components/SignoutButton";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="flex-1">
      <Text>Home</Text>
      <SignoutButton />
    </SafeAreaView>
  );
}
