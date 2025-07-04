import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useClerk } from "@clerk/clerk-expo";

const Home = () => {
  const { signOut } = useClerk();
  return (
    <View>
      <Text>Home</Text>
      <TouchableOpacity onPress={() => signOut()}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
