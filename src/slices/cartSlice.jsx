import { createSlice } from "@reduxjs/toolkit";

const initializerCart = () => {
  try {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const initialState = {
  items: initializerCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const payload = action.payload;

      const idx = state.items.findIndex(
        (item) =>
          item.ITEM_CODE === payload.ITEM_CODE &&
          item.ITEM_FINISH === payload.ITEM_FINISH &&
          item.ITEM_SIZE === payload.ITEM_SIZE &&
          item.ITEM_TYPE === payload.ITEM_TYPE,
      );

      if (idx > -1) {
        state.items[idx].itemQty += payload.itemQty;
      } else {
        const newItem = { ...payload, image: undefined }; // Exclude blob URLs
        state.items.push(newItem);
      }
    },

    removeItem: (state, action) => {
      const id = action.payload.id;
      state.items = state.items.filter((item) => {
        const lineKey = item.SUB_MATERIAL_NO ?? item.ITEM_CODE;
        return lineKey !== id;
      });
    },

    updateItemQuantity: (state, action) => {
      const { id, qty } = action.payload;
      state.items = state.items.map((item) => {
        const lineKey = item.SUB_MATERIAL_NO ?? item.ITEM_CODE;
        if (lineKey !== id) return item;
        return { ...item, itemQty: Math.max(1, qty) };
      });
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

// Save to localStorage on state change
export const persistCartMiddleware = (storeAPI) => (next) => (action) => {
  const result = next(action);
  const state = storeAPI.getState();
  localStorage.setItem("cart", JSON.stringify(state.cart.items));
  return result;
};

export const { addItem, removeItem, updateItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
