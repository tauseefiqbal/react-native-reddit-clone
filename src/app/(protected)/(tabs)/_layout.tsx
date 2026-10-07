import { Tabs } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";

export default function TabLayout() {
  const { signOut } = useAuth();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "#5c5c5c",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerRight: () => (
          <Feather
            name="log-out"
            size={22}
            color="black"
            style={{ paddingRight: 10 }}
            onPress={() => signOut()}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "Reddit",
          headerTintColor: "#FF5700",
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color }) => (
            <AntDesign name="plus" size={28} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="communities"
        options={{
          title: "Communities",
          tabBarIcon: ({ color }) => (
            <Feather name="users" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}