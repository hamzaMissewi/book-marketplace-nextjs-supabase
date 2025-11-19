"use client"

import { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { CartState, CartItem } from '@/lib/types/cart'

const CartContext = createContext<CartState | undefined>(undefined)

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState }

const CART_STORAGE_KEY = 'bookstore_cart'

function cartReducer(state: CartState, action: CartAction): CartState {
  let newState: CartState
  
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        newState = {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + action.payload.price
        }
      } else {
        newState = {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + action.payload.price
        }
      }
      break
    }
      
    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => item.id === action.payload)
      if (!itemToRemove) return state
      
      newState = {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        totalItems: Math.max(0, state.totalItems - itemToRemove.quantity),
        totalPrice: Math.max(0, state.totalPrice - (itemToRemove.price * itemToRemove.quantity))
      }
      break
    }
      
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      if (quantity < 1) return state
      
      const itemToUpdate = state.items.find(item => item.id === id)
      if (!itemToUpdate) return state
      
      const quantityDiff = quantity - itemToUpdate.quantity
      
      newState = {
        ...state,
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        ),
        totalItems: state.totalItems + quantityDiff,
        totalPrice: state.totalPrice + (quantityDiff * itemToUpdate.price)
      }
      break
    }
      
    case 'CLEAR_CART':
      newState = { items: [], totalItems: 0, totalPrice: 0, addItem: () => {},
        removeItem: () => {}, updateQuantity: () => {}, clearCart: () => {}}
      break
      
    case 'LOAD_CART':
      return action.payload
      
    default:
      return state
  }
  
  // Save to localStorage whenever cart changes
  if (typeof window !== 'undefined') {
    const { addItem, removeItem, updateQuantity, clearCart, ...persistableState } = newState
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(persistableState))
  }
  
  return newState
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    addItem: () => {},
    removeItem: () => {},
    updateQuantity: () => {},
    clearCart: () => {}
  })
  
  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: { ...parsedCart, addItem, removeItem, updateQuantity, clearCart } })
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage', error)
    }
  }, [])
  
  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }, [])
  
  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }, [])
  
  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }, [])
  
  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])
  
  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
