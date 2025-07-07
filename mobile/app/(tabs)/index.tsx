import PostComposer from "@/components/PostComposer";
import SignoutButton from "@/components/SignoutButton";
import { useUserSync } from "@/hooks/useUserSync";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  useUserSync();
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <Ionicons name="logo-twitter" size={24} color="#1SA1F2" />
        <Text className="text-2xl font-bold text-gray-900">Home</Text>
        <SignoutButton />
      </View>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <PostComposer />
      </ScrollView>
    </SafeAreaView>
  );
}
