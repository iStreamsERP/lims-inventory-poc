import { createContext, useContext, useEffect, useReducer } from "react";

const CartContext = createContext();

const ADD_ITEM = "ADD_ITEM";
const REMOVE_ITEM = "REMOVE_ITEM";
const CLEAR_CART = "CLEAR_CART";
const UPDATE_QUANTITY = "UPDATE_QUANTITY";

// Initialize cart from localStorage
function initializerCart() {
  try {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case ADD_ITEM: {
      const { payload } = action;
      const idx = state.findIndex(
        (item) =>
          item.itemCode === payload.itemCode &&
          item.itemColor === payload.itemColor &&
          item.itemSize === payload.itemSize &&
          item.itemVariant === payload.itemVariant,
      );
      if (idx > -1) {
        // merge quantities
        const newState = [...state];
        newState[idx].itemQty += payload.itemQty;
        return newState;
      }
      return [...state, payload];
    }

    case REMOVE_ITEM:
      return state.filter((item) => {
        const lineKey = item.subProductNo ?? item.itemCode;
        return lineKey !== action.payload.id;
      });

    case UPDATE_QUANTITY: {
      const { id, qty } = action.payload;
      return state.map((item) => {
        const lineKey = item.subProductNo ?? item.itemCode;
        if (lineKey !== id) return item;
        return { ...item, itemQty: Math.max(1, qty) };
      });
    }

    case CLEAR_CART:
      return [];

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [], initializerCart);

  // Persist cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (item) => dispatch({ type: ADD_ITEM, payload: item });
  const removeItem = (id) => dispatch({ type: REMOVE_ITEM, payload: { id } });
  const updateItemQuantity = (id, qty) => dispatch({ type: UPDATE_QUANTITY, payload: { id, qty } });
  const clearCart = () => dispatch({ type: CLEAR_CART });

  return <CartContext.Provider value={{ cart, addItem, removeItem, updateItemQuantity, clearCart }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
