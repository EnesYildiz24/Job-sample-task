import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import type {Product} from "./Product.ts";
import Cart from "./Cart.ts";

type ProductListProps = {
  cart: Cart
  onAddToCart: (product: Product) => void
}

export function ProductList({cart, onAddToCart}: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        const data: Product[] = await response.json()
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unbekannter Fehler")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-600">Lädt...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-red-600">Fehler beim Laden: {error}</div>
      </div>
    )
  }

  return (<>
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Produktliste</h1>

    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {products.map((product, i) => {
          const isEven = (i % 2) === 0
          return (
            <li
              key={product.id}
              className={`p-4 ${isEven ? "hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"} transition-colors`}
            >
              <div className={`flex justify-between items-center ${isEven ? "pl-6" : "pl-3"}`}>
                <Link
                  to={`/products/${product.id}`}
                  className="flex-1 pr-4 block hover:underline"
                >
                  <span className="text-lg font-medium text-gray-800">
                    {product.name}
                  </span>
                  <p className="text-sm text-gray-500">
                    {product.description}
                  </p>
                </Link>
                <span className="text-lg font-semibold text-blue-600">
                  €{product.price.toFixed(2)}
                </span>
                <button
                  className={isEven ? undefined : "mr-1"}
                  onClick={() => onAddToCart(product)}
                >
                  +
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
    <div className="mt-4 text-center text-gray-600">
      {cart.getCount()} Produkte im Warenkorb (€{cart.getTotalPrice().toFixed(2)})
    </div>
  </>)
}
