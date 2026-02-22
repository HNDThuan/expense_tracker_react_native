import { StyleSheet, Text, View } from "react-native";
import React, { use } from "react";
import { Stack } from "expo-router";
import { colors } from "@/constants/theme";
import { AuthProvider, useAuth } from "@/contexts/authContext";
const StackLayout = () => {
  const { user } = useAuth();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.neutral900 },
      }}
    >
      <Stack.Screen
        name="(modals)/profileModal"
        options={{ presentation: "modal" }}
      />

      <Stack.Screen
        name="(modals)/walletModal"
        options={{ presentation: "modal" }}
      />
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
