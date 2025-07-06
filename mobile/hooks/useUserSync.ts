import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { useAPIClient, userAPI } from "@/utils/api";
import { AxiosError, AxiosResponse } from "axios";

export const useUserSync = () => {
  const { isSignedIn } = useAuth();
  const api = useAPIClient();

  const syncUserMutation = useMutation({
    mutationFn: () => userAPI.syncUser(api),
    onSuccess: (response: AxiosResponse) =>
      console.log("User synced successfully:", response.data.user),
    onError: (error: AxiosError) =>
      console.error("User sync failed:", error.response?.data),
  });

  // auto-sync user when signed in
  useEffect(() => {
    // if user is signed in and user is not synced yet, sync user
    if (isSignedIn && !syncUserMutation.data) {
      syncUserMutation.mutate();
    }
  }, [isSignedIn]);

  return null;
};
