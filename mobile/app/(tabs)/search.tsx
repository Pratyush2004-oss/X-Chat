import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

// to do: add this screen working in the future

const TRENDING_TOPICS = [
  { topic: "#ReactNative", tweets: "125K" },
  { topic: "#TypeScript", tweets: "89K" },
  { topic: "#WebDevelopment", tweets: "234K" },
  { topic: "#AI", tweets: "567K" },
  { topic: "#TechNews", tweets: "98K" },
];
export default function Search() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center px-4 py-3 bg-gray-100 rounded-full">
          <Feather name="search" size={24} color="black" />
          <TextInput
            placeholder="Search Twitter"
            className="flex-1 ml-2"
            placeholderTextColor={"#657786"}
          />
        </View>
      </View>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <Text className="mb-4 text-xl font-bold text-gray-900">
            Trending for You
          </Text>
          {TRENDING_TOPICS.map((topic, index) => (
            <TouchableOpacity
              key={index}
              className="py-3 border-b border-gray-100"
            >
              <Text className="text-sm text-gray-500">
                Trending in Technology
              </Text>
              <Text className="text-lg font-bold text-gray-900 ">
                {topic.topic}
              </Text>
              <Text className="text-sm text-gray-500">{topic.tweets}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
