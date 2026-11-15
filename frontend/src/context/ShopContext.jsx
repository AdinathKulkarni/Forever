import React, { Children, createContext, useEffect, useState, useMemo } from 'react'
import { toast } from 'react-toastify';
import { products } from '../assets/frontend_assets/assets';

export const ShopContext = createContext();

const ShopContextProvider = ({children}) => {

    // Cart Logic
    const currency = '₹'
    const deliveryFee = 10;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(true);
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cartItems");
        return savedCart ? JSON.parse(savedCart) : {};
    });

    const productMap = useMemo(() => {
            return new Map(products.map((product) => [product._id, product]));
        }, [products]);
    
        // 2. Flatten nested { itemId: { size: qty } } into a clean 1D array
    const cartData = useMemo(() => {
        return Object.entries(cartItems).flatMap(([itemId, sizes]) => {
            const product = productMap.get(itemId);
            if (!product) return []; // Skip if product data hasn't loaded yet

            return Object.entries(sizes)
                .filter(([, quantity]) => quantity > 0)
                .map(([size, quantity]) => ({
                    ...product, // Includes name, price, image, etc.
                    size,
                    quantity,
                }));
        });
    }, [cartItems, productMap]);

    useEffect( () => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems))
    },[cartItems] )

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
        toast.success("Item added to cart 🎉")
        console.log(cartData)
    }
    
    const updateQuantity = (itemId, size, quantity) => {
        if (!Number.isInteger(quantity) || quantity < 0) return;

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
    };

    const subtotal = cartData.reduce((total, item) => total + item.price * item.quantity, 0);

   

    const value = {
        currency, products, deliveryFee,
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