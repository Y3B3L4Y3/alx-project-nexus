import { describe, it, expect, beforeEach, vi } from 'vitest';
import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from '../../redux/slices/cartSlice';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

describe('cartSlice', () => {
  let initialState: CartState;

  beforeEach(() => {
    initialState = {
      items: [],
    };
    vi.clearAllMocks();
  });

  it('should return the initial state', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual({
      items: [],
    });
  });

  describe('addToCart', () => {
    it('should add a new item to the cart', () => {
      const newItem = {
        id: 1,
        title: 'Test Product',
        price: 100,
        image: 'test.jpg',
      };

      const state = cartReducer(initialState, addToCart(newItem));

      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual({
        ...newItem,
        quantity: 1,
      });
    });

    it('should increment quantity if item already exists', () => {
      const existingItem: CartItem = {
        id: 1,
        title: 'Test Product',
        price: 100,
        image: 'test.jpg',
        quantity: 1,
      };

      const stateWithItem: CartState = {
        items: [existingItem],
      };

      const newState = cartReducer(
        stateWithItem,
        addToCart({
          id: 1,
          title: 'Test Product',
          price: 100,
          image: 'test.jpg',
        })
      );

      expect(newState.items).toHaveLength(1);
      expect(newState.items[0].quantity).toBe(2);
    });

    it('should handle multiple different items', () => {
      let state = initialState;

      state = cartReducer(
        state,
        addToCart({
          id: 1,
          title: 'Product 1',
          price: 100,
          image: 'test1.jpg',
        })
      );

      state = cartReducer(
        state,
        addToCart({
          id: 2,
          title: 'Product 2',
          price: 200,
          image: 'test2.jpg',
        })
      );

      expect(state.items).toHaveLength(2);
      expect(state.items[0].id).toBe(1);
      expect(state.items[1].id).toBe(2);
    });

    it('should persist to localStorage', () => {
      const newItem = {
        id: 1,
        title: 'Test Product',
        price: 100,
        image: 'test.jpg',
      };

      cartReducer(initialState, addToCart(newItem));
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  describe('removeFromCart', () => {
    it('should remove an item from the cart', () => {
      const stateWithItems: CartState = {
        items: [
          {
            id: 1,
            title: 'Product 1',
            price: 100,
            image: 'test1.jpg',
            quantity: 1,
          },
          {
            id: 2,
            title: 'Product 2',
            price: 200,
            image: 'test2.jpg',
            quantity: 1,
          },
        ],
      };

      const newState = cartReducer(stateWithItems, removeFromCart(1));

      expect(newState.items).toHaveLength(1);
      expect(newState.items[0].id).toBe(2);
    });

    it('should handle removing non-existent item gracefully', () => {
      const stateWithItems: CartState = {
        items: [
          {
            id: 1,
            title: 'Product 1',
            price: 100,
            image: 'test1.jpg',
            quantity: 1,
          },
        ],
      };

      const newState = cartReducer(stateWithItems, removeFromCart(999));

      expect(newState.items).toHaveLength(1);
      expect(newState.items[0].id).toBe(1);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const stateWithItems: CartState = {
        items: [
          {
            id: 1,
            title: 'Product 1',
            price: 100,
            image: 'test1.jpg',
            quantity: 1,
          },
        ],
      };

      const newState = cartReducer(
        stateWithItems,
        updateQuantity({ id: 1, quantity: 5 })
      );

      expect(newState.items[0].quantity).toBe(5);
    });

    it('should enforce minimum quantity of 1', () => {
      const stateWithItems: CartState = {
        items: [
          {
            id: 1,
            title: 'Product 1',
            price: 100,
            image: 'test1.jpg',
            quantity: 3,
          },
        ],
      };

      const newState = cartReducer(
        stateWithItems,
        updateQuantity({ id: 1, quantity: 0 })
      );

      // The reducer uses Math.max(1, quantity), so minimum is 1
      expect(newState.items[0].quantity).toBe(1);
    });

    it('should not update if item does not exist', () => {
      const stateWithItems: CartState = {
        items: [
          {
            id: 1,
            title: 'Product 1',
            price: 100,
            image: 'test1.jpg',
            quantity: 1,
          },
        ],
      };

      const newState = cartReducer(
        stateWithItems,
        updateQuantity({ id: 999, quantity: 5 })
      );

      expect(newState.items).toHaveLength(1);
      expect(newState.items[0].quantity).toBe(1);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from the cart', () => {
      const stateWithItems: CartState = {
        items: [
          {
            id: 1,
            title: 'Product 1',
            price: 100,
            image: 'test1.jpg',
            quantity: 1,
          },
          {
            id: 2,
            title: 'Product 2',
            price: 200,
            image: 'test2.jpg',
            quantity: 2,
          },
        ],
      };

      const newState = cartReducer(stateWithItems, clearCart());

      expect(newState.items).toHaveLength(0);
    });

    it('should handle clearing an already empty cart', () => {
      const newState = cartReducer(initialState, clearCart());

      expect(newState.items).toHaveLength(0);
    });

    it('should persist cleared state to localStorage', () => {
      const stateWithItems: CartState = {
        items: [
          {
            id: 1,
            title: 'Product 1',
            price: 100,
            image: 'test1.jpg',
            quantity: 1,
          },
        ],
      };

      cartReducer(stateWithItems, clearCart());
      expect(localStorageMock.setItem).toHaveBeenCalledWith('cart', '[]');
    });
  });
});
