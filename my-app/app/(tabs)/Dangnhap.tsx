import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './AppNavigator';

const background = require('../../assets/images/backgroud_GR.png');
const logo = require('../../assets/images/iconlogin.png');
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = () => {
    fetch('https://66714d5fe083e62ee43af0d7.mockapi.io/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const user = json.find((user) => user.username === username && user.password === password);
        if (user) {
          navigation.navigate('Trangchu');
        } else {
          alert('Đăng nhập thất bại ! Sai tên người dùng hoặc mật khẩu. Vui lòng thử lại.');
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Lỗi', 'Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.');
      });
  };

  return (
    <ImageBackground source={background} style={styles.background}>
     
        <SafeAreaView style={styles.container}>
          <View style={styles.innerContainer}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>Đăng Nhập</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Tên đăng nhập"
                value={username}
                onChangeText={setUsername}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Text style={styles.togglePassword}>{isPasswordVisible ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Đăng Nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
    
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: '100%', // Đảm bảo full-width
    height: '50%', // Đảm bảo full-height
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Nền trắng mờ
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    alignItems: 'center',
  },
  logo: {
    width: 120, // Tăng kích thước logo
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 26, // Kích thước lớn hơn
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    width: '100%',
    backgroundColor: '#f9f9f9', // Thêm nền màu cho input
  },
  togglePassword: {
    color: '#007BFF',
    marginBottom: 15,
    textAlign: 'right',
    width: '100%',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#007BFF',
    marginTop: 15,
  },
});

export default LoginScreen;
