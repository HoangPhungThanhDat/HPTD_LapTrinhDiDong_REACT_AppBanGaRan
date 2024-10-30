import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, ScrollView, Image, Button, Modal, TouchableOpacity } from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import Giohang from './Giohang';

interface Product {
  id: number;
  title: string; // Cập nhật từ name thành title
  price: number;
  category: string;
  image: string; // Đổi kiểu từ any thành string
}

const banners = [
  require('../../assets/images/banner4.jpg'),
  require('../../assets/images/banner5.jpg'),
  require('../../assets/images/banner6.jpg'), 
];

const MainScreen: React.FC = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentBannerIndex, setCurrentBannerIndex] = useState<number>(0);
  const [showCart, setShowCart] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [cartItems, setCartItems] = useState<Product[]>([]); 
  const [showSuccessModal, setShowSuccessModal] = useState(false); 

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/data');
        const json = await response.json();
        setProducts(json);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
      }
    };

    fetchProducts();
  }, []);
  
  const categories = ['Tất cả', 'Gà Rán KFC', 'Sandwich Sữa', 'Hamburger'];
//   Hàm này được gọi khi người dùng chọn một sản phẩm.
// Hàm nhận một tham số product là đối tượng sản phẩm được người dùng nhấn vào.
// setSelectedProduct(product); lưu sản phẩm này vào state selectedProduct, từ đó có thể hiển thị thông tin chi tiết của sản phẩm đó trong modal.
  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setQuantity(1); // Reset quantity when closing modal
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    alert('Bạn đã thanh toán thành công!');
    setCartItems([]); // Xóa giỏ hàng sau khi thanh toán
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      const existingItem = cartItems.find(item => item.id === selectedProduct.id);
      if (existingItem) {
        setCartItems(cartItems.map(item => 
          item.id === selectedProduct.id ? { ...item, quantity: item.quantity + quantity } : item
        ));
      } else {
        setCartItems([...cartItems, { ...selectedProduct, quantity }]);
      }
      setShowSuccessModal(true); // Hiển thị modal thông báo thành công
      handleCloseModal();
    }
  };
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    setCartItems(cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  const handleBuyNow = () => {
    if (selectedProduct) {
      alert(`Bạn đã mua ${quantity} ${selectedProduct.title} thành công!`);
      handleCloseModal();
    }
  };

  // Tìm kiếm sản phẩm
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Tất cả' || product.category === selectedCategory;
    const matchesSearch = product.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  

  // Chuyển banner
  const handleNextBanner = () => {
    setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const handlePrevBanner = () => {
    setCurrentBannerIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 4000);

    return () => clearInterval(bannerInterval);
  }, []);

  // Sản phẩm liên quan
  const getRelatedProducts = (selectedProduct: Product) => {
    return products.filter(product => 
      product.category === selectedProduct.category && product.id !== selectedProduct.id
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navContainer}>
        <TouchableOpacity onPress={() => console.log('Home')}>
          <Image 
            source={require('../../assets/images/logo1.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.navButtons}>
          {['KHUYẾN MÃI', 'THỰC ĐƠN', 'CỬA HÀNG', 'THEO DÕI ĐƠN HÀNG', 'ĐẶT TIỆC', 'VIE ▼', 'Rewards', '👤'].map((item, index) => (
            <TouchableOpacity key={index} onPress={() => console.log(item)}>
              <Text style={styles.navItem}>{item}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setShowCart(true)}>
            <Icon name="shopping-cart" size={20} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.innerContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          /> 
          <MaterialIcons name="search" size={24} color="#999" />
        </View>
{/* BANNER ĐỘNG */}
        <View style={styles.bannerContainer}>
          <TouchableOpacity onPress={handlePrevBanner} style={styles.arrowLeft}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Image 
            source={banners[currentBannerIndex]}
            style={styles.banner}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={handleNextBanner} style={styles.arrowRight}>
            <AntDesign name="right" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <Text style={styles.welcomeText}>Chào Mừng Đến Với GÀ RÁN POPEYES!</Text>
        <Text style={styles.instructionText}>Bạn có thể Order các sản phẩm tại đây.</Text>

{/* DANH MỤC */}
        <View style={styles.categoryContainer}>
          {categories.map(category => (
            <Button 
              key={category} 
              title={category} 
              onPress={() => setSelectedCategory(category)} 
              color={selectedCategory === category ? '#007bff' : '#000'}
            />
          ))}
        </View>
        {/* Modal thông báo thành công */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={showSuccessModal}
        onRequestClose={handleCloseSuccessModal}
      >
        <View style={styles.successModalOverlay}>
          <View style={styles.successModalContent}>
            <Text style={styles.successModalText}>Thêm vào giỏ hàng thành công!</Text>
            <Button title="Đóng" onPress={handleCloseSuccessModal} color="#007bff" />
          </View>
        </View>
      </Modal>
{/* SẢN PHẨM */}
        <View style={styles.productList}>
          {filteredProducts.map(product => (
            <TouchableOpacity
              key={product.id}
              style={styles.productItem}
              onPress={() => handleProductPress(product)}
            >
              <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="cover" />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{product.title}</Text>
                <Text style={styles.productPrice}>{product.price.toLocaleString()}đ</Text>
              </View>
              <MaterialIcons name="shopping-cart" size={24} color="black" />
            </TouchableOpacity>
          ))}
        </View>

        {selectedProduct && (
          <Modal
            transparent={true}
            animationType="slide"
            visible={true}
            onRequestClose={handleCloseModal}
          >
            <TouchableOpacity style={styles.modalOverlay} onPress={handleCloseModal}>
              <View style={styles.modalContent}>   
              <Text style={styles.modalTitle}>CHI TIẾT SẢN PHẨM:</Text>            
                  <Image source={selectedProduct.image} style={styles.modalImage} resizeMode="contain" />
                  <View style={styles.modalTextContainer}>                                      
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Lương về - Combo sale hè</Text>
                    <Text style={styles.modalTitle}>{selectedProduct.title}</Text>
                    <Text style={{ textDecorationLine: 'line-through' }}>163.000 ₫</Text>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'red' }}>
                      Giá: {selectedProduct.price.toLocaleString()}đ
                    </Text>

                    <View style={styles.quantityContainer}>
                      <Text style={styles.quantityLabel}>Số lượng:</Text>
                      <View style={styles.quantityControls}>
                        <TouchableOpacity onPress={() => setQuantity(prev => Math.max(prev - 1, 1))}>
                        <Text style={[styles.quantityButton, { fontSize: 10 }]}>-</Text> {/* Thay đổi kích thước chữ */}
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity onPress={() => setQuantity(prev => prev + 1)}>
                        <Text style={[styles.quantityButton, { fontSize: 10 }]}>+</Text> {/* Thay đổi kích thước chữ */}
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Button title="Thêm vào giỏ hàng 🛒" onPress={() => handleAddToCart(selectedProduct)} />
                    
                    <Button title="Đóng" onPress={handleCloseModal} color="red" />                 
                </View>  
                             
                <Text style={styles.relatedProductsTitle}>Sản Phẩm Liên Quan:</Text>
                <View style={styles.relatedProductsContainer}>
                  {getRelatedProducts(selectedProduct).map(product => (
                    <TouchableOpacity
                      key={product.id}
                      style={styles.relatedProductItem}
                      onPress={() => handleProductPress(product)}
                    >
                      <Image source={product.image} style={styles.relatedProductImage} resizeMode="cover" />
                      <Text style={styles.relatedProductName}>{product.name}</Text>
                      <Text style={styles.relatedProductPrice}>{product.price.toLocaleString()}đ</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          </Modal>   
                
        )}
        
        {/* Giỏ hàng */}
        {showCart && (
          <Modal
            transparent={true}
            animationType="slide"
            visible={showCart}
            onRequestClose={() => setShowCart(false)}
          >
            <View style={styles.cartModal}>
              <Giohang 
                cartItems={cartItems}
                onRemoveItem={handleRemoveFromCart}
                onCheckout={handleCheckout}
                onUpdateQuantity={handleUpdateQuantity}  // Truyền hàm handleUpdateQuantity vào Giohang
              />
              <Button title="Đóng" onPress={() => setShowCart(false)} color="#f44336" />
            </View>
          </Modal>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles CSS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  navContainer: {
    flexDirection: 'column',
    backgroundColor: '#FF9900',
    alignItems: 'center',
    paddingVertical: 10,
  },
  logo: {
    width: 150,
    height: 80,
    marginBottom: 5,
  },
  navButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 30,
  },
  navItem: {
    color: 'white',
    fontSize: 12,
    padding: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  innerContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 8,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  bannerContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  banner: {
    width: '100%',
    height: 110,
    borderRadius: 10,
  },
  arrowLeft: {
    position: 'absolute',
    top: '50%',
    left: 10,
    zIndex: 1,
    padding: 10,
  },
  arrowRight: {
    position: 'absolute',
    top: '50%',
    right: 10,
    zIndex: 1,
    padding: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  productDetails: {
    alignItems: 'center',
    marginTop: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#f00',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalImage: {
    width: 295,
    height: 200,
    borderRadius: 10,
  },
  modalTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  // Related products styles
  relatedProductsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  relatedProductsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  relatedProductItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  relatedProductImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  relatedProductName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  relatedProductPrice: {
    fontSize: 12,
    color: '#f00',
  },
  quantityContainer: {
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  quantityLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    justifyContent: 'center', // Căn giữa các nút
  },
  quantityButton: {
    fontSize: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    minWidth: 30,
    textAlign: 'center',
    marginHorizontal: 5,
    marginRight: 18,
  },
  quantityText: {
    fontSize: 18,
    width: 30,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  cartModal: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  successModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  successModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  successModalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007bff',
  },
});

export default MainScreen;
