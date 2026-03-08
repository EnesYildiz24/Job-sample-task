import {useState} from "react";
import {Route, Routes} from "react-router-dom";
import Cart from "./Cart.ts";
import type {Product} from "./Product.ts";
import {ProductDetail} from "./ProductDetail.tsx";
import {ProductList} from "./ProductList";

export default function App() {
  const [cart, setCart] = useState<Cart>(() => new Cart())

  const addToCart = (product: Product) => {
    setCart((prev) => prev.addItem(product))
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Routes>
          <Route path="/" element={<ProductList cart={cart} onAddToCart={addToCart} />} />
          <Route path="/products/:id" element={<ProductDetail cart={cart} onAddToCart={addToCart} />} />
        </Routes>
      </div>
    </div>
  )
}
