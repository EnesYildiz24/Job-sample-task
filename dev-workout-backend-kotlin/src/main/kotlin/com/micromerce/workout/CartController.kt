package com.micromerce.workout

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/cart")
class CartController {
    private var cart: Cart = Cart(mutableListOf())

    @GetMapping
    fun getCart(): Cart = cart

    @PostMapping("/items")
    fun addToCart(@RequestBody request: AddItemRequest): Cart {
        val product = Products.findById(request.productId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found")
        cart.addProduct(product)
        return cart
    }

    @DeleteMapping("/items/{productId}")
    fun removeFromCart(@PathVariable productId: Int): Cart {
        val product = Products.findById(productId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found")
        cart.removeProduct(product)
        return cart
    }
}

data class AddItemRequest(val productId: Int)
