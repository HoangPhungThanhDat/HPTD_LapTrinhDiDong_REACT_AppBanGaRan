import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'react-native';
import { RootStackParamList } from './AppNavigator'; // Đảm bảo đường dẫn chính xác
const logo = require('../../assets/images/dangky.png');
type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State để kiểm soát việc hiển thị mật khẩu

  const handlePhoneInput = (text) => {
    // Chỉ cho phép nhập số
    const numericText = text.replace(/[^0-9]/g, '');
    setPhone(numericText);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible); 
  };

  const handleRegister = () => {
    if (username === '' || password === '' || phone === '') {
      alert('Lỗi ! Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Gửi yêu cầu đăng ký tới API
    fetch('https://66714d5fe083e62ee43af0d7.mockapi.io/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
        phone: phone,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.id) {
          // Nếu đăng ký thành công
          alert('Đăng ký thành công ! Tài khoản của bạn đã được tạo.');
          navigation.navigate('Dangnhap'); // Điều hướng về trang index sau khi đăng ký thành công
        } else {
          alert('Đăng ký thất bại ! Đã xảy ra lỗi trong quá trình đăng ký.');
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Lỗi', 'Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.');
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Đăng Ký</Text>
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          value={username}
          onChangeText={setUsername}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Điện thoại"
          value={phone} // Thêm input cho phone
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Đăng Ký</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
//CSS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    width: '100%',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
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

export default RegisterScreen;




