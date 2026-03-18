import { colors } from "@/constants/theme";
import { AuthProvider, useAuth } from "@/contexts/authContext";
import { setupNotificationsOnStart } from "@/services/notificationService";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";

const StackLayout = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setupNotificationsOnStart();
    }
  }, [user]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.neutral900 },
      }}
    >
      {/* <Stack.Screen
        name="(modals)/profileModal"
        options={{ presentation: "modal" }}
      />

      <Stack.Screen
        name="(modals)/walletModal"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="(modals)/transactionModal"
        options={{ presentation: "modal" }}
      /> */}
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({});
