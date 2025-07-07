import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useCreatePost } from "@/hooks/useCreatePost";
import { useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";

export default function PostComposer() {
  const {
    content,
    createPost,
    isCreating,
    pickImageFromGallery,
    removeImage,
    selectedImage,
    setContent,
    takePhoto,
  } = useCreatePost();
  const { user } = useUser();
  return (
    <View className="p-4 bg-white border-b border-gray-100">
      <View className="flex-row">
        <Image
          source={{ uri: user?.imageUrl }}
          className="mr-3 rounded-full size-12"
        />
        <View className="flex-1">
          <TextInput
            className="text-lg text-gray-900"
            placeholder="What's happening?"
            placeholderTextColor={"#657785"}
            multiline
            value={content}
            onChangeText={setContent}
            maxLength={280}
          />
        </View>
      </View>
      {/* Preview the selected image */}
      {selectedImage && (
        <View className="mt-3 ml-15">
          <View className="relative">
            <Image
              source={{ uri: selectedImage }}
              className="w-full h-48 rounded-2xl"
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={removeImage}
              className="absolute items-center justify-center bg-black rounded-full size-5 top-2 right-2 backdrop-opacity-60"
            >
              <Feather name="x" size={12} color={"white"} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Actions buttons */}
      <View className="flex-row items-center justify-between mt-3">
        <View className="flex-row">
          <TouchableOpacity className="mr-3" onPress={pickImageFromGallery}>
            <Feather name="image" size={20} color={"#1DA1F2"} />
          </TouchableOpacity>
          <TouchableOpacity className="mr-4" onPress={takePhoto}>
            <Feather name="camera" size={20} color={"#1DA1F2"} />
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center">
          {content.length > 0 && (
            <Text
              className={`text-sm mr-3 ${content.length > 260 ? "text-red-500" : "text-gray-500"} `}
            >
              {280 - content.length} words left
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={createPost}
          disabled={isCreating || !(content.trim() || selectedImage)}
          className={`px-6 py-2 rounded-full ${content.trim() || selectedImage ? "bg-blue-500" : "bg-gray-300"}`}
        >
          {isCreating ? (
            <ActivityIndicator size={"small"} color={"white"} />
          ) : (
            <Text
              className={`font-semibold ${content.trim() || selectedImage ? "text-white" : "text-gray-500"}`}
            >
              Post
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
