<template>
  <div class="cart-page">
    <header class="cart-header">
      <h1>Shopping Cart</h1>
      <p>View the items added to your cart and proceed to checkout</p>
    </header>

    <div v-if="cartItems.length === 0" class="empty-cart-message">
      Your cart is empty.
    </div>
    <div v-else class="cart-content">
      <ul class="cart-item-list">
        <li v-for="item in cartItems" :key="item.id" class="cart-item">
          <img :src="item.image" :alt="item.name" class="cart-item-image" />
          <div class="cart-item-info">
            <!-- <h3 class="item-name" v-html="item.name"></h3>
            <p class="item-price" v-html="item.price"></p> -->
            <h2 class="cart-item-name">{{ item.name }}</h2>
            <p class="cart-item-price">{{ item.price }}</p>
            <!-- <h2 class="cart-item-name" v-html="item.name"></h2>
            <p class="cart-item-price" v-html="item.price"></p> -->
            <button @click="removeFromCart(item.id)" class="remove-button">
              Remove
            </button>
          </div>
        </li>
      </ul>

      <div class="cart-summary">
        <h2>Total Price: <span class="total-price">${{ calculateTotalPrice }}</span></h2>
        <button class="checkout-button">Checkout</button>
      </div>
    </div>
    <button @click="generateShareLink" class="share-cart-button">Share Cart</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ShoppingCart',
  data() {
    return {
      cartItems: [],
      isLoading: false
    }
  },
  computed: {
    calculateTotalPrice() {
      return this.cartItems.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[^\d.]/g, ""))
        return total + price
      }, 0).toFixed(2)
    }
  },
  methods: {
    async removeFromCart(itemId) {
      try {
        this.isLoading = true
        const session_id = localStorage.getItem("session_id")
        
        // Unsafe version: directly using the unfiltered itemId
        await axios.delete(`http://127.0.0.1:5000/cart/${itemId}`, {
          headers: {
            Authorization: `Bearer ${session_id}`
          }
        })

        /* Safe version: filter the itemId
        const safeItemId = parseInt(itemId, 10)
        if (isNaN(safeItemId)) {
          throw new Error('Invalid item ID')
        }
        await axios.delete(`http://127.0.0.1:5000/cart/${safeItemId}`, {
          headers: {
            Authorization: `Bearer ${session_id}`
          }
        })
        */

        this.cartItems = this.cartItems.filter(item => item.id !== itemId)
        
        // Update the cart count in the navigation
        this.$root.$emit('update-cart-count')
        
        // Show success message
        alert('Item has been removed from the cart')
      } catch (error) {
        console.error("Failed to remove item", error)
        alert('Failed to remove item, please try again')
      } finally {
        this.isLoading = false
      }
    },
    generateShareLink() {
      this.$router.push({
        path: '/share',
        query: this.cartItems.reduce((acc, item) => {
          if (!acc.id) acc.id = []
          if (!acc.name) acc.name = []
          if (!acc.price) acc.price = []
          if (!acc.image) acc.image = []
          if (!acc.description) acc.description = []
          
          acc.id.push(item.id)
          acc.name.push(item.name)
          acc.price.push(item.price)
          acc.image.push(item.image)
          acc.description.push(item.description || '')
          
          return acc
        }, {})
      })
    },
    async loadCartItems() {
      try {
        this.isLoading = true
        const session_id = localStorage.getItem("session_id")
        const response = await axios.get("http://127.0.0.1:5000/cart", {
          headers: {
            Authorization: `Bearer ${session_id}`
          }
        })
        this.cartItems = response.data
      } catch (error) {
        console.error("Failed to get cart data", error)
        alert('Failed to get cart data, please refresh the page and try again')
      } finally {
        this.isLoading = false
      }
    }
  },
  created() {
    this.loadCartItems()
  }
}
</script>

<style scoped>
.cart-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.cart-header {
  text-align: center;
  margin-bottom: 20px;
}

.cart-header h1 {
  font-size: 2em;
  color: #333;
}

.cart-header p {
  font-size: 1em;
  color: #666;
}

.empty-cart-message {
  text-align: center;
  font-size: 1.2em;
  color: #888;
}

.cart-content {
  display: flex;
  flex-direction: column;
}

.cart-item-list {
  list-style-type: none;
  padding: 0;
  margin: 0 0 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #ddd;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-image {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  margin-right: 15px;
  border: 1px solid #ddd;
  object-fit: cover;
}

.cart-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cart-item-name {
  font-size: 1.1em;
  color: #333;
  margin: 5px 0;
}

.cart-item-price {
  font-size: 1em;
  color: #4CAF50;
  margin: 5px 0;
}

.remove-button {
  padding: 8px 12px;
  background-color: #ff6f61;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  align-self: flex-start;
  transition: background-color 0.3s ease;
}

.remove-button:hover {
  background-color: #e65a50;
}

.cart-summary {
  text-align: right;
  padding: 20px;
  background-color: #fff;
  border-top: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.05);
}

.share-cart-button {
  padding: 12px 20px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  margin-top: 20px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.share-cart-button:hover {
  background-color: #357abd;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}
</style> 