import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function SSOCallback() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/(tabs)"} />;
  }

  return <Stack />;
}
