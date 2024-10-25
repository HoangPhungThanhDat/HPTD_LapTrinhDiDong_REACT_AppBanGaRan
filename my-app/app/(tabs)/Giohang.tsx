// import React, { useState } from 'react';
// import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity, Image } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   quantity: number;
//   image: any;
// }

// const initialCartItems: CartItem[] = [
//   {
//     id: 1,
//     name: 'Gà Rán KFC',
//     price: 250000,
//     quantity: 1,
//     image: require('../../assets/images/sp1.jpg'),
//   },
//   {
//     id: 2,
//     name: 'Sandwich Sữa (3 Bánh)',
//     price: 250000,
//     quantity: 2,
//     image: require('../../assets/images/sw.jpg'),
//   },
// ];

// const Giohang: React.FC = () => {
//   const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
//   const navigation = useNavigation();

//   const handleRemoveItem = (id: number) => {
//     setCartItems(cartItems.filter(item => item.id !== id));
//   };

//   const handleQuantityChange = (id: number, delta: number) => {
//     setCartItems(cartItems.map(item => 
//       item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
//     ));
//   };

//   const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

//   const renderItem = ({ item }: { item: CartItem }) => (
//     <View style={styles.cartItem}>
//       <Image source={item.image} style={styles.cartImage} />
//       <View style={styles.cartDetails}>
//         <Text style={styles.cartName}>{item.name}</Text>
//         <Text style={styles.cartPrice}>{(item.price * item.quantity).toLocaleString()}đ</Text>
//         <View style={styles.quantityContainer}>
//           <TouchableOpacity onPress={() => handleQuantityChange(item.id, -1)}>
//             <Text style={styles.quantityButton}>-</Text>
//           </TouchableOpacity>
//           <Text style={styles.quantityText}>{item.quantity}</Text>
//           <TouchableOpacity onPress={() => handleQuantityChange(item.id, 1)}>
//             <Text style={styles.quantityButton}>+</Text>
//           </TouchableOpacity>
//         </View>
//         <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
//           <Text style={styles.removeButton}>Xóa</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Giỏ Hàng</Text>
//       <FlatList
//         data={cartItems}
//         renderItem={renderItem}
//         keyExtractor={item => item.id.toString()}
//         contentContainerStyle={cartItems.length === 0 ? styles.emptyContainer : null}
//         ListEmptyComponent={<Text style={styles.emptyText}>Giỏ hàng trống!</Text>}
//       />
//       {cartItems.length > 0 && (
//         <View style={styles.totalContainer}>
//           <Text style={styles.totalText}>Tổng giá: {totalPrice.toLocaleString()}đ</Text>
//           <Button title="Tiến hành thanh toán" onPress={() => navigation.navigate('Thanhtoan')} />
//         </View>
//       )}
//       <Button title="Quay lại" onPress={() => navigation.navigate('Trangchu')} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f8f9fa',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#343a40',
//   },
//   cartItem: {
//     flexDirection: 'row',
//     backgroundColor: '#ffffff',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     elevation: 2,
//   },
//   cartImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 10,
//   },
//   cartDetails: {
//     marginLeft: 15,
//     flex: 1,
//   },
//   cartName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   cartPrice: {
//     fontSize: 16,
//     color: '#28a745',
//     marginBottom: 5,
//   },
//   quantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 5,
//   },
//   quantityButton: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     padding: 5,
//     backgroundColor: '#007bff',
//     color: '#ffffff',
//     borderRadius: 5,
//     marginHorizontal: 5,
//     textAlign: 'center',
//     width: 30,
//   },
//   quantityText: {
//     fontSize: 18,
//     marginHorizontal: 10,
//   },
//   removeButton: {
//     color: '#dc3545',
//     fontWeight: 'bold',
//     marginTop: 10,
//   },
//   totalContainer: {
//     marginTop: 20,
//     padding: 15,
//     backgroundColor: '#ffffff',
//     borderRadius: 10,
//     elevation: 2,
//   },
//   totalText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   emptyContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#6c757d',
//   },
// });

// export default Giohang;




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

const Giohang: React.FC<CartScreenProps> = ({ cartItems, onRemoveItem, onCheckout }) => {
  // Tính tổng giá
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={item.image} style={styles.cartImage} resizeMode="cover" />
      <View style={styles.cartDetails}>
        <Text style={styles.cartName}>{item.name}</Text>
        <Text style={styles.cartPrice}>${item.price.toFixed(2)}</Text>
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
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>Tổng giá: {totalPrice.toLocaleString()}đ</Text>
          <TouchableOpacity style={styles.checkoutButton} onPress={onCheckout}>
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
});

export default Giohang;
