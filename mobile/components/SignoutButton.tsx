import { useSignOut } from "@/hooks/useSignout";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

export default function SignoutButton() {
  const { handleSignOut } = useSignOut();
  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Feather name="log-out" size={24} color="#E0245E" />
    </TouchableOpacity>
  );
}
