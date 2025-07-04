import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";

export const useSocialAuth = () => {
  const [isLoading, setisLoading] = useState(false);
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    setisLoading(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      if(createdSessionId && setActive){
        await setActive({ session: createdSessionId });
      }
    } catch (error:any) {
        const provider = strategy === "oauth_google" ? "Google" : "Apple";
        Alert.alert("Error", `Failed to authenticate with ${provider}. Please try again.`);
    } finally {
      setisLoading(false);
    }
  };

  return { isLoading, handleSocialAuth };
};
