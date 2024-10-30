import { Tabs } from 'expo-router';
import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const bounceValue = useRef(new Animated.Value(1)).current; // Khởi tạo giá trị Animated

  // Hàm tạo hiệu ứng quét lên và quét xuống
  const startBouncing = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: 1.2, // Tăng kích thước lên 20%
          duration: 500, // Thời gian tăng
          useNativeDriver: true, // Sử dụng driver gốc để mượt mà hơn
        }),
        Animated.timing(bounceValue, {
          toValue: 1, // Trả về kích thước ban đầu
          duration: 500, // Thời gian giảm
          useNativeDriver: true, // Sử dụng driver gốc để mượt mà hơn
        }),
      ])
    ).start(); // Bắt đầu hiệu ứng
  };

  useEffect(() => {
    startBouncing(); // Bắt đầu hiệu ứng khi component được mount
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="Trangchu"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'home-circle' : 'home-circle-outline'}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Dangky"
        options={{
          title: 'Đăng ký',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'account-plus' : 'account-plus-outline'}
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Giohang"
        options={{
          title: 'Giỏ hàng',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'cart-variant' : 'cart-outline'}
              color={color}
              size={24}
            />
          ),
        }}
      />

      {/* Tab Quét Mã QR ở giữa với hiệu ứng quét */}
      <Tabs.Screen
        name="QuetQR"
        options={{
          title: 'Quét QR',
          tabBarIcon: ({ color }) => (
            <Animated.View style={{ transform: [{ scale: bounceValue }] }}>
              <MaterialCommunityIcons
                name="qrcode-scan"
                color={Colors[colorScheme ?? 'light'].primary}
                size={32}
              />
            </Animated.View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="Thanhtoan" // Đảm bảo file Thanhtoan.js tồn tại
        options={{
          title: 'Thanh toán',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'credit-card' : 'credit-card-outline'} // Icon phù hợp cho thanh toán
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Dangnhap"
        options={{
          title: 'Đăng nhập',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'login' : 'login-variant'}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Điều hướng',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'compass' : 'compass-outline'}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
