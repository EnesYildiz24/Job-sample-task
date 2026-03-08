import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import type {Product} from "./Product.ts";
import Cart from "./Cart.ts";

type ProductDetailProps = {
  cart: Cart
  onAddToCart: (product: Product) => void
}

export function ProductDetail({cart, onAddToCart}: ProductDetailProps) {
  const {id} = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Produkt nicht gefunden")
        setLoading(false)
        return
      }

      try {
        const response = await fetch("/api/products")
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        const data: Product[] = await response.json()
        const found = data.find((item) => String(item.id) === id)
        if (!found) {
          setError("Produkt nicht gefunden")
          return
        }
        setProduct(found)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unbekannter Fehler")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-600">Lädt...</div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-red-600">Fehler: {error ?? "Produkt nicht gefunden"}</div>
      </div>
    )
  }

  return (<>
    <Link className="mb-4 inline-block text-blue-600 hover:underline" to="/">
      Zurück zur Liste
    </Link>
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        {product.name}
      </h1>
      <p className="text-gray-600 mb-4">
        {product.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold text-blue-600">
          €{product.price.toFixed(2)}
        </span>
        <button onClick={() => onAddToCart(product)}>+</button>
      </div>
    </div>
    <div className="mt-4 text-center text-gray-600">
      {cart.getCount()} Produkte im Warenkorb (€{cart.getTotalPrice().toFixed(2)})
    </div>
  </>)
}
