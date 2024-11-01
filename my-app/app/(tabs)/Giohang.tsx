import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface CartScreenProps {
  cartItems: Array<{
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  onRemoveItem: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onCheckout: (orderData: any) => void;
}

const Giohang: React.FC<CartScreenProps> = ({ cartItems = [], onRemoveItem, onUpdateQuantity, onCheckout }) => {
  const [isCheckoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [isOtpModalVisible, setOtpModalVisible] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [selectedItems, setSelectedItems] = useState<Array<number>>([]);
  const [otp, setOtp] = useState('');
  const correctOtp = '130804'; // Mã OTP cố định

  const totalPrice = cartItems.reduce((acc, item) => 
    selectedItems.includes(item.id) ? acc + item.price * item.quantity : acc, 
    0
  );

  const toggleSelectItem = (id: number) => {
    setSelectedItems(prevSelectedItems => 
      prevSelectedItems.includes(id) ? prevSelectedItems.filter(itemId => itemId !== id) : [...prevSelectedItems, id]
    );
  };

  const openCheckoutModal = () => {
    setCheckoutModalVisible(true);
  };

  const closeCheckoutModal = () => {
    setCheckoutModalVisible(false);
    resetForm();
  };

  const openOtpModal = () => {
    setOtpModalVisible(true);
  };

  const closeOtpModal = () => {
    setOtpModalVisible(false);
    setOtp('');
  };

  const openSuccessModal = () => {
    setSuccessModalVisible(true);
  };

  const closeSuccessModal = () => {
    setSuccessModalVisible(false);
  };

  const resetForm = () => {
    setCustomerName('');
    setAddress('');
    setPhoneNumber('');
    setPaymentMethod('');
    setQrCodeValue('');
  };

  const handlePaymentMethodSelect = (methodName: string) => {
    setPaymentMethod(methodName);

    const orderData = {
      customerName,
      address,
      phoneNumber,
      paymentMethod: methodName,
      items: cartItems.filter(item => selectedItems.includes(item.id)),
      totalPrice,
    };
    const qrData = JSON.stringify(orderData);
    setQrCodeValue(qrData);
  };

  const handleCheckout = () => {
    if (!customerName || !address || !phoneNumber || !paymentMethod) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    // Mở modal nhập OTP
    openOtpModal();
  };

  const handleOtpSubmit = async () => {
    if (otp === correctOtp) {
      // Gửi dữ liệu đơn hàng đến API
      const orderData = {
        customerName,
        address,
        phoneNumber,
        paymentMethod,
        items: cartItems.filter(item => selectedItems.includes(item.id)),
        totalPrice,
      };

      try {
        const response = await fetch('http://localhost:3000/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          throw new Error('Đã xảy ra lỗi khi thanh toán.');
        }

        const responseData = await response.json();
        console.log('Đặt hàng thành công:', responseData);

        onCheckout(orderData);
        closeOtpModal();
        closeCheckoutModal();
        openSuccessModal();
      } catch (error) {
        console.error('Lỗi thanh toán:', error);
        alert('Thanh toán không thành công. Vui lòng thử lại.');
      }
    } else {
      alert('Mã OTP không chính xác. Vui lòng thử lại.');
    }
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <TouchableOpacity onPress={() => toggleSelectItem(item.id)}>
        <View style={[styles.checkBox, selectedItems.includes(item.id) && styles.checked]}>
          {selectedItems.includes(item.id) && <Text style={styles.checkMark}>✓</Text>}
        </View>
      </TouchableOpacity>
      <Image source={{ uri: item.image }} style={styles.cartImage} />
      <View style={styles.cartDetails}>
        <Text style={styles.cartName}>{item.title}</Text>
        <Text style={styles.cartPrice}>{(item.price * item.quantity).toLocaleString()} đ</Text>
        <Text style={styles.cartQuantity}>Số lượng: {item.quantity}</Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity onPress={() => onUpdateQuantity(item.id, item.quantity - 1)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => onUpdateQuantity(item.id, item.quantity + 1)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onRemoveItem(item.id)} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giỏ Hàng</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Giỏ hàng trống!</Text>
      ) : (
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>Tổng giá: {totalPrice.toLocaleString()} đ</Text>
          <TouchableOpacity onPress={openCheckoutModal} style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>Tiến hành thanh toán</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal thanh toán */}
      <Modal visible={isCheckoutModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thông tin thanh toán</Text>
            <FlatList
              data={cartItems}
              renderItem={({ item }) => (
                <View style={styles.productDetail}>
                  <Text style={styles.productName}>{item.title}</Text>
                  <Text style={styles.productQuantity}>Số lượng: {item.quantity}</Text>
                  <Text style={styles.productPrice}>Giá: {(item.price * item.quantity).toLocaleString()} đ</Text>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
            />

            <Text style={styles.totalTextModal}>Tổng tiền: {totalPrice.toLocaleString()} đ</Text>
            <TextInput style={styles.input} placeholder="Họ tên" value={customerName} onChangeText={setCustomerName} />
            <TextInput style={styles.input} placeholder="Nơi nhận" value={address} onChangeText={setAddress} />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />

            <Text style={styles.paymentTitle}>Phương thức thanh toán</Text>
            {[ { name: 'Momo', icon: require('../../assets/images/momo.png') }, { name: 'ZaloPay', icon: require('../../assets/images/zalo.png') }, ].map((method) => (
              <TouchableOpacity
                key={method.name}
                onPress={() => handlePaymentMethodSelect(method.name)}
                style={styles.paymentOption}
              >
                <Image source={method.icon} style={styles.paymentIcon} />
                <Text style={[styles.paymentOptionText, paymentMethod === method.name && styles.selectedPayment]}>
                  {method.name}
                </Text>
              </TouchableOpacity>
            ))}

            {qrCodeValue && <QRCode value={qrCodeValue} size={200} />}

            <TouchableOpacity onPress={handleCheckout} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Xác nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeCheckoutModal} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal OTP */}
      <Modal visible={isOtpModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhập mã OTP</Text>
            <TextInput
              style={styles.input}
              placeholder="Mã OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={handleOtpSubmit} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Xác nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeOtpModal} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal thông báo thành công */}
      <Modal visible={isSuccessModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đặt hàng thành công!</Text>
            <TouchableOpacity onPress={closeSuccessModal} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  emptyText: { fontSize: 18, textAlign: 'center', marginTop: 20 },
  footer: { marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#ccc' },
  totalText: { fontSize: 18, fontWeight: 'bold' },
  checkoutButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 5, marginTop: 10 },
  checkoutButtonText: { color: '#fff', textAlign: 'center', fontSize: 18 },
  cartItem: { flexDirection: 'row', marginBottom: 15 },
  cartImage: { width: 80, height: 80, borderRadius: 5 },
  cartDetails: { flex: 1, marginLeft: 10 },
  cartName: { fontSize: 18, fontWeight: 'bold' },
  cartPrice: { fontSize: 16, color: '#4CAF50' },
  cartQuantity: { fontSize: 14 },
  quantityControls: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  quantityButton: { backgroundColor: '#eee', padding: 5, borderRadius: 5 },
  quantityButtonText: { fontSize: 18 },
  quantityText: { marginHorizontal: 10, fontSize: 16 },
  removeButton: { marginLeft: 10, backgroundColor: 'red', padding: 5, borderRadius: 5 },
  removeButtonText: { color: '#fff' },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  totalTextModal: { fontSize: 18, fontWeight: 'bold', marginVertical: 10, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  paymentTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  paymentOption: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  paymentIcon: { width: 40, height: 40, marginRight: 10 },
  paymentOptionText: { fontSize: 16 },
  selectedPayment: { fontWeight: 'bold', color: '#4CAF50' },

  // QR Code Styles
  qrCodeContainer: {
    alignItems: 'center',
    marginVertical: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  qrCodeText: {
    marginTop: 15,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    fontWeight: '500',
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  checkBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#007AFF',
  },
  checkMark: {
    color: '#fff',
    fontSize: 16,
  },
 
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productDetail: { marginVertical: 5 },
  productName: { fontSize: 16, fontWeight: 'bold' },
  productQuantity: { fontSize: 14 },
  productPrice: { fontSize: 14, color: '#4CAF50' },

 
  // Other styles...
  successModalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  successModalContent: { backgroundColor: 'white', padding: 20, borderRadius: 8, alignItems: 'center' },
  successText: { fontSize: 18, fontWeight: 'bold', color: '#4CAF50', marginBottom: 10 },
});

export default Giohang;
