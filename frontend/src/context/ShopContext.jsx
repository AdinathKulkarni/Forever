import { createContext, useEffect, useState, useMemo, useContext } from 'react'
import { toast } from 'react-hot-toast'
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { BACKEND_URL } from '../api'

export const ShopContext = createContext();

const ShopContextProvider = ({children}) => {

    const {loginToken} = useContext(AuthContext);

    // Cart Logic
    const currency = '₹'
    const deliveryFee = 10;
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(true);
    const [cartItems, setCartItems] = useState({});
    const [cartLoadedForToken, setCartLoadedForToken] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const fetchProducts = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/product/get-all`);
                const result = await response.json();

                if (!response.ok || !result.success || !Array.isArray(result.products)) {
                    throw new Error(result.message || 'Unable to load products');
                }

                if (!cancelled) setProducts(result.products);
            } catch (error) {
                console.error('Failed to fetch products:', error);
                if (!cancelled) toast.error('Unable to load products');
            } finally {
                if (!cancelled) setProductsLoading(false);
            }
        };

        fetchProducts();

        return () => {
            cancelled = true;
        };
    }, []);

    const productMap = useMemo(() => {
            return new Map(products.map((product) => [product._id, product]));
        }, [products]);
    
    useEffect(() => {
        let cancelled = false;

        const loadCart = async () => {
            if (!loginToken) {
                try {
                    const storedCart = JSON.parse(localStorage.getItem('cartItems') || '{}');
                    if (!cancelled) setCartItems(storedCart && typeof storedCart === 'object' ? storedCart : {});
                } catch (error) {
                    console.error('Unable to read saved guest cart:', error);
                    if (!cancelled) setCartItems({});
                }
                if (!cancelled) setCartLoadedForToken('');
                return;
            }

            try {
                const response = await axios.get(`${BACKEND_URL}/api/cart/get`, {
                    headers: { token: loginToken },
                });
                if (!response.data.success) {
                    throw new Error(response.data.message || 'Unable to fetch cart');
                }
                if (!cancelled) {
                    setCartItems(response.data.userCartData || {});
                    setCartLoadedForToken(loginToken);
                }
            } catch (error) {
                console.error('Error while fetching cart items:', error.response?.data || error.message);
                if (!cancelled) toast.error('Unable to load your saved cart');
            }
        };

        loadCart();
        return () => {
            cancelled = true;
        };
    }, [loginToken]);

    useEffect(() => {
        if (cartLoadedForToken !== loginToken) return;

        if (loginToken) {
            localStorage.removeItem('cartItems');
        } else {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
    }, [cartItems, loginToken, cartLoadedForToken]);

    const selectSize = () => {
        toast.error("Please select a size !!")
    };

    const addToCart = async(itemId, size) => {
        let cartData = structuredClone(cartItems);

        if(!size){
            selectSize();
            return 
        }

        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;
            }
            else{
                cartData[itemId][size] = 1;
            }
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        setCartItems(cartData);
        let apiFailed = false;

        if(loginToken){
            try{
                await axios.post(`${BACKEND_URL}/api/cart/add-item`, {
                    itemId,
                    size,
                }, {
                    headers: { token: loginToken },
                });
            } catch(e){
                apiFailed = true;
                console.error("Error while adding item to cart", e.response?.data || e.message)
            }

        }

        if (apiFailed) {
            toast.error("Item added locally, but could not sync with your account");
        } else {
            toast.success("Item added to cart 🎉");
        }
    }
    
    const updateQuantity = (itemId, size, quantity) => {
        if (!Number.isInteger(quantity) || quantity < 0) return;
        if (!cartItems[itemId] || !(size in cartItems[itemId])) return;

        setCartItems((currentCart) => {
            const currentSizes = currentCart[itemId];
            if (!currentSizes || !(size in currentSizes)) return currentCart;

            const updatedSizes = { ...currentSizes };
            const updatedCart = { ...currentCart, [itemId]: updatedSizes };

            if (quantity === 0) {
                delete updatedSizes[size];
                if (Object.keys(updatedSizes).length === 0) {
                    delete updatedCart[itemId];
                }
            } else {
                updatedSizes[size] = quantity;
            }

            return updatedCart;
        });

        if (loginToken) {
            axios.post(`${BACKEND_URL}/api/cart/update-item`, {
                itemId,
                size,
                quantity,
            }, {
                headers: { token: loginToken },
            }).catch((error) => {
                console.error('Error while updating cart quantity', error.response?.data || error.message);
                toast.error('Cart updated locally, but could not sync with your account');
            });
        }
    };

    const cartData = Object.entries(cartItems).flatMap(([itemId, sizes]) => {
        const product = productMap.get(itemId);
        if (!product || !sizes || typeof sizes !== 'object') return [];

        return Object.entries(sizes)
            .filter(([, quantity]) => quantity > 0)
            .map(([size, quantity]) => ({ ...product, size, quantity }));
    });

    const subtotal = cartData.reduce((total, item) => total + item.price * item.quantity, 0);

    const value = {
        currency, products, productsLoading, deliveryFee,
        search, setSearch, showSearch, setShowSearch,
        addToCart, cartItems, setCartItems, subtotal, cartData,
        updateQuantity, productMap,
    }

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
