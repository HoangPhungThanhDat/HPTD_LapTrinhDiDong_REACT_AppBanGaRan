import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';

export default function QuetQR() {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Hiện tại không có chức năng quét mã, chỉ là một ví dụ
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <Image
          source={{ uri: 'data:image/png;base64,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' }} // Đường dẫn hình ảnh QR icon
          style={styles.qrIcon}
        />
      </Animated.View>
      <Text style={styles.text}>Quét mã QR</Text>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Bắt đầu quét</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  qrIcon: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
