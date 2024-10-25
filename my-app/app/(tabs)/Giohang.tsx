import React from 'react';
import { View, Text, StyleSheet, FlatList, Button, Image, TouchableOpacity } from 'react-native';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: any; // Hoặc kiểu hình ảnh cụ thể
  size: string; // Thêm thuộc tính size
}

interface CartScreenProps {
  cartItems: CartItem[];
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
}

const Giohang: React.FC<CartScreenProps> = ({ cartItems = [], onRemoveItem, onCheckout }) => {
  // Tính tổng giá
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={item.image} style={styles.cartImage} resizeMode="cover" />
      <View style={styles.cartDetails}>
        <Text style={styles.cartName}>{item.name}</Text>
        <Text style={styles.cartPrice}>{item.price} đ</Text>
        <Text style={styles.cartQuantity}>Số lượng: {item.quantity}</Text>
      </View>
      <TouchableOpacity onPress={() => onRemoveItem(item.id)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giỏ Hàng</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Giỏ hàng trống !</Text>
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
          <Text style={styles.totalText}>Tổng giá: {totalPrice.toLocaleString()}đ</Text>
          <TouchableOpacity onPress={onCheckout}>
            <Button  title="Tiến hành thanh toán" onPress={() => navigation.navigate('Thanhtoan')} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cartImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  cartDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  cartName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#212121',
  },
  cartPrice: {
    fontSize: 16,
    color: '#ff5722',
    marginBottom: 5,
  },
  cartQuantity: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 5,
  },
  cartSize: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 5,
  },
  removeButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 50,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    elevation: 2,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 80, // Để đảm bảo footer không bị che khuất
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#757575',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Giohang;
