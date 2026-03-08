import type {Product} from "./Product.ts";

export default class Cart {
  private items: Map<number, {product: Product; quantity: number}>;

  constructor(items?: Map<number, {product: Product; quantity: number}>) {
    this.items = items ? new Map(items) : new Map();
  }

  addItem(product: Product): Cart {
    const next = new Map(this.items);
    const entry = next.get(product.id);
    if (entry) {
      next.set(product.id, {product: entry.product, quantity: entry.quantity + 1});
    } else {
      next.set(product.id, {product, quantity: 1});
    }
    return new Cart(next);
  }

  removeItem(product: Product): Cart {
    const next = new Map(this.items);
    const entry = next.get(product.id);
    if (!entry) {
      return this;
    }

    if (entry.quantity <= 1) {
      next.delete(product.id);
    } else {
      next.set(product.id, {product: entry.product, quantity: entry.quantity - 1});
    }

    return new Cart(next);
  }

  getTotalPrice(): number {
    let total = 0
    this.items.forEach(({product, quantity}) => {
      total += product.price * quantity;
    });
    return total;
  }

  getCount(): number {
    let count = 0
    this.items.forEach(({quantity}) => {
      count += quantity;
    });
    return count;
  }
}
