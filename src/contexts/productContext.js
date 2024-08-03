import { useContext, createContext, useState, useEffect } from "react";
import { UseAuthValue } from "./authContext";
import { db } from "../firebaseInit";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

// Create contextAPI for product
export const productContext = createContext();

// Custom context hook
export function useProductContext() {
  const value = useContext(productContext);
  return value;
}

// Custom provider
export function ProductContext({ children }) {
  // User's login status and loggedIn user
  const { isLoggedIn, userLoggedIn, setLoggedIn, setUserLoggedIn } = UseAuthValue();

  // Number of items in Cart
  const [itemInCart, setItemInCart] = useState(0);

  // All products in Cart
  const [cart, setCart] = useState([]);

  // All orders placed by user
  const [myOrders, setMyOrders] = useState([]);

  // Total amount of user's cart
  const [total, setTotal] = useState(0);

  // Product data
  const [data, setData] = useState([]);

  // Fetch product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        let result = await response.json();
        result = result.map(product => ({
          ...product,
          price: Math.round(product.price * 83) // Convert price to rupees without decimal places
        }));
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Return date in yy/mm/dd format
  function getDate() {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  // Check if the user is still logged in on page refresh
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      const index = window.localStorage.getItem("index");
      const user = JSON.parse(index);
      setLoggedIn(token);
      setUserLoggedIn(user);
    }
  }, []);

  // Get real-time update of user's cart
  useEffect(() => {
    if (isLoggedIn) {
      const unSub = onSnapshot(doc(db, "buybusy", userLoggedIn.id), (doc) => {
        const cartData = doc.data().cart || [];
        setCart(cartData);
        setMyOrders(doc.data().orders || []);

        // Total amount of products in cart
        let sum = 0;
        cartData.forEach((item) => {
          sum += item.price * item.quantity;
        });
        setTotal(sum);
        setItemInCart(cartData.reduce((acc, item) => acc + item.quantity, 0));
      });
      return () => unSub();
    }
  }, [isLoggedIn, userLoggedIn]);

  // Increase item's quantity
  async function increaseQuant(product) {
    const index = cart.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      const newCart = [...cart];
      newCart[index].quantity++;
      setCart(newCart);

      const userRef = doc(db, "buybusy", userLoggedIn.id);
      await updateDoc(userRef, {
        cart: newCart,
      });

      setItemInCart(itemInCart + 1);
      setTotal(total + product.price);
    }
  }

  // Decrease item's quantity
  async function decreaseQuant(product) {
    const index = cart.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      const newCart = [...cart];
      if (newCart[index].quantity > 1) {
        newCart[index].quantity--;
        setTotal(total - product.price);
      } else {
        newCart.splice(index, 1);
        setTotal(total - product.price * product.quantity);
      }
      setCart(newCart);
      setItemInCart(itemInCart - 1);

      const userRef = doc(db, "buybusy", userLoggedIn.id);
      await updateDoc(userRef, {
        cart: newCart,
      });
    }
  }

  // Add product to cart
  async function addToCart(product) {
    if (!isLoggedIn) {
      toast.error("Please login first!");
      return;
    }

    const index = cart.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      await increaseQuant(product);
      toast.success("Product quantity increased!");
      return;
    }

    const newProduct = { ...product, quantity: 1 };
    const newCart = [...cart, newProduct];
    setCart(newCart);

    const userRef = doc(db, "buybusy", userLoggedIn.id);
    await updateDoc(userRef, {
      cart: arrayUnion(newProduct),
    });

    setTotal(total + newProduct.price);
    setItemInCart(itemInCart + 1);
    toast.success("Added to your cart");
  }

  // Remove product from cart
  async function removeFromCart(product) {
    const newCart = cart.filter((item) => item.id !== product.id);
    setCart(newCart);

    const userRef = doc(db, "buybusy", userLoggedIn.id);
    await updateDoc(userRef, {
      cart: newCart,
    });

    setTotal(total - product.quantity * product.price);
    setItemInCart(itemInCart - product.quantity);
    toast.success("Removed from cart!");
  }

  // Clear cart
  async function clearCart() {
    if (itemInCart === 0) {
      toast.error("Nothing to remove from cart");
      return;
    }

    const userRef = doc(db, "buybusy", userLoggedIn.id);
    await updateDoc(userRef, {
      cart: [],
    });

    setCart([]);
    setTotal(0);
    setItemInCart(0);
    toast.success("Cart cleared");
  }

  // Purchase all items in cart
  async function purchaseAll() {
    const currentDate = getDate();

    const userRef = doc(db, "buybusy", userLoggedIn.id);
    await updateDoc(userRef, {
      orders: arrayUnion({ date: currentDate, list: cart, amount: total }),
    });

    await clearCart();
  }

  return (
    <productContext.Provider
      value={{
        data,
        addToCart,
        cart,
        total,
        setTotal,
        removeFromCart,
        clearCart,
        purchaseAll,
        myOrders,
        increaseQuant,
        decreaseQuant,
        itemInCart,
      }}
    >
      {children}
    </productContext.Provider>
  );
}
