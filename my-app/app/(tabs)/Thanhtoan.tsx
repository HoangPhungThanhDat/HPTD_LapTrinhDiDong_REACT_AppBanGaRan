import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';

const PaymentScreen: React.FC = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('Momo');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [bankAccount, setBankAccount] = useState<string>('');
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  const handlePayment = () => {
    console.log(`Thanh toán bằng: ${selectedPaymentMethod}`);
    console.log(`Số điện thoại: ${phoneNumber}`);
    console.log(`Tài khoản ngân hàng: ${bankAccount}`);
    
    // Hiển thị modal thanh toán thành công
    setPaymentSuccess(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Trang Thanh Toán</Text>

      <View style={styles.paymentMethodContainer}>
        <Text style={styles.subtitle}>Chọn phương thức thanh toán:</Text>

        {/* Phương thức thanh toán Momo */}
        <TouchableOpacity
          style={[styles.button, selectedPaymentMethod === 'Momo' && styles.selectedButton]}
          onPress={() => setSelectedPaymentMethod('Momo')}
        >
          <Image source={require('../../assets/images/momo.png')} style={styles.paymentImage} />
          <Text style={styles.buttonText}>Momo</Text>
        </TouchableOpacity>

        {/* Phương thức thanh toán ZaloPay */}
        <TouchableOpacity
          style={[styles.button, selectedPaymentMethod === 'ZaloPay' && styles.selectedButton]}
          onPress={() => setSelectedPaymentMethod('ZaloPay')}
        >
          <Image source={require('../../assets/images/zalo.png')} style={styles.paymentImage} />
          <Text style={styles.buttonText}>ZaloPay</Text>
        </TouchableOpacity>

        {/* Phương thức thanh toán Ngân Hàng */}
        <TouchableOpacity
          style={[styles.button, selectedPaymentMethod === 'Ngân Hàng' && styles.selectedButton]}
          onPress={() => setSelectedPaymentMethod('Ngân Hàng')}
        >
          <Image source={require('../../assets/images/nganhang.png')} style={styles.paymentImage} />
          <Text style={styles.buttonText}>Ngân Hàng</Text>
        </TouchableOpacity>
      </View>

      {selectedPaymentMethod === 'Momo' && (
        <TextInput
          style={styles.input}
          placeholder="Nhập số điện thoại Momo"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      )}

      {selectedPaymentMethod === 'Ngân Hàng' && (
        <TextInput
          style={styles.input}
          placeholder="Nhập tài khoản ngân hàng"
          value={bankAccount}
          onChangeText={setBankAccount}
        />
      )}

      <TouchableOpacity style={styles.checkoutButton} onPress={handlePayment}>
        <Text style={styles.checkoutButtonText}>Thanh Toán</Text>
      </TouchableOpacity>

      {/* Modal Thanh toán thành công */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={paymentSuccess}
        onRequestClose={() => setPaymentSuccess(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Thanh toán thành công!</Text>
            <Image
              source={require('../../assets/images/sp1.jpg')}
              style={styles.successImage}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setPaymentSuccess(false)}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

// CSS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 15,
    color: '#333',
  },
  paymentMethodContainer: {
    marginBottom: 20,
  },
  button: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedButton: {
    backgroundColor: '#f0a500',
    borderColor: '#e09c00',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  paymentImage: {
    width: 35,
    height: 35,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 25,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    elevation: 4,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#28a745',
  },
  successImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
