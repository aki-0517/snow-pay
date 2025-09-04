import React, { useEffect } from "react";
import { router } from "expo-router";

export const UserScreen = () => {
  useEffect(() => {
    router.replace("/(tabs)");
  }, []);

  return null;
};
