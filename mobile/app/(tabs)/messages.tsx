import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import React, { useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { CONVERSATIONS, ConversationType } from "@/data/conversation";
import { Feather } from "@expo/vector-icons";

export default function Messages() {
  const insets = useSafeAreaInsets();
  const [searchText, setsearchText] = useState<string>("");
  const [conversationList, setconversationList] =
    useState<ConversationType[]>(CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationType | null>(null);
  const [isChatOpen, setisChatOpen] = useState(false);
  const [newMessage, setnewMessage] = useState<string>("");

  // delete conversation
  const deleteConversation = (conversationId: number) => {
    Alert.alert(
      "Delete Conversation",
      "Are you sure you want to delete this conversation?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setconversationList((prev) =>
              prev.filter((conv) => conv.id !== conversationId)
            );
          },
        },
      ]
    );
  };

  // open conversation
  const openConversaition = (conversation: ConversationType) => {
    setSelectedConversation(conversation);
    setisChatOpen(true);
  };

  const closeChatModal = () => {
    setSelectedConversation(null);
    setisChatOpen(false);
    setnewMessage("");
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // update last message in conversation
      setconversationList((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id
            ? { ...conv, lastMessage: newMessage, time: "now" }
            : conv
        )
      );
      setnewMessage("");
      Alert.alert(
        "Message Sent",
        `Your message has been sent to ${selectedConversation.user.name}`
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <Text className="text-xl font-bold text-gray-900">Messages</Text>
        <TouchableOpacity>
          <Feather name="edit" size={24} color={"#1DA1F2"} />
        </TouchableOpacity>
      </View>

      {/* search bar */}
      <View className="px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center px-4 bg-gray-100 rounded-full">
          <Feather name="search" size={20} color={"#657786"} />
          <TextInput
            className="flex-1 ml-3 text-base"
            placeholder="Search for people"
            value={searchText}
            onChangeText={setsearchText}
          />
        </View>
      </View>

      {/* Conversations list */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      >
        {conversationList.map((convo, index) => (
          <TouchableOpacity
            className="flex-row items-center p-4 border-b border-gray-50 active:bg-gray-50"
            key={index}
            onPress={() => openConversaition(convo)}
            onLongPress={() => deleteConversation(convo.id)}
          >
            <Image
              source={{ uri: convo.user.avatar }}
              className="mr-3 rounded-full size-12"
            />
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <View className="flex-row items-center gap-1">
                  <Text className="font-semibold text-gray-900">
                    {convo.user.name}
                  </Text>
                  {convo.user.verified && (
                    <Feather
                      name="check-circle"
                      size={16}
                      color={"#1DA1F2"}
                      className="ml-1"
                    />
                  )}
                  <Text className="ml-1 text-sm text-gray-500">
                    @{convo.user.username}
                  </Text>
                </View>
                <Text className="text-sm text-gray-500">{convo.time}</Text>
              </View>
              <Text className="text-sm text-gray-500" numberOfLines={1}>
                {convo.lastMessage}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Quick Actions */}
      <View className="px-4 py-2 border-t border-gray-100 bg-gray-50">
        <Text className="text-xs text-center text-gray-500">
          Tap to open · Long Press to delete
        </Text>
      </View>

      {/* Chat Modal */}
      <Modal
        visible={isChatOpen}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectedConversation && (
          <>
            {/* ChatHeader */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
              <TouchableOpacity className="mr-3" onPress={closeChatModal}>
                <Feather name="arrow-left" size={24} color={"#1DA1F2"} />
              </TouchableOpacity>
              <Image
                source={{ uri: selectedConversation.user.avatar }}
                className="mr-3 rounded-full size-10"
              />
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="mr-1 font-semibold text-gray-900">
                    {selectedConversation.user.name}
                  </Text>
                  {selectedConversation.user.verified && (
                    <Feather name="check-circle" size={16} color={"#1DA1F2"} />
                  )}
                </View>
                <Text className="text-sm text-gray-500">
                  @{selectedConversation.user.username}
                </Text>
              </View>
            </View>

            {/* Chat Area */}
            <ScrollView className="flex-1 p-4">
              <View className="mb-4">
                <Text className="mb-4 text-sm text-center text-gray-400">
                  This is the beginning of your Conversation with{" "}
                  {selectedConversation.user.name}
                </Text>

                {/* Conversation Messages */}
                {selectedConversation.messages.map((message) => (
                  <View
                    key={message.id}
                    className={`flex-row mb-3 ${message.fromUser ? "justify-end" : ""}`}
                  >
                    {!message.fromUser && (
                      <Image
                        source={{ uri: selectedConversation.user.avatar }}
                        className="mr-2 rounded-full size-8"
                      />
                    )}
                    <View
                      className={`flex-1 ${message.fromUser ? "items-end" : ""}`}
                    >
                      <View
                        className={`rounded-2xl px-4 py-3 max-w-xs 
                        ${message.fromUser ? "bg-blue-500" : "bg-gray-100 "}
                        `}
                      >
                        <Text
                          className={`${message.fromUser ? "text-white" : "text-gray-900"}`}
                        >
                          {message.text}
                        </Text>
                      </View>
                      <Text className="mt-1 text-xs text-gray-400">
                        {message.time}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Message input */}
            <View className="flex-row items-center px-4 py-3 border-t border-gray-100">
              <View className="flex-row items-center flex-1 px-4 mr-3 bg-gray-100 rounded-full">
                <TextInput
                  placeholder="Start a message"
                  className="flex-1 text-base"
                  placeholderClassName="#657786"
                  value={newMessage}
                  onChangeText={setnewMessage}
                  multiline
                />
              </View>
              <TouchableOpacity
                onPress={sendMessage}
                className={`size-10 rounded-full items-center justify-center
                ${newMessage.trim() ? "bg-blue-500" : "bg-gray-300"}
                `}
              >
                <Feather name="send" size={20} color={"white"} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </Modal>
    </SafeAreaView>
  );
}
