<template>
  <div class="app">
    <header class="header">
      <h1>Online Mall</h1>
      <p>Discover quality products and enhance your life</p>
      <div class="header-actions">
        <button @click="$router.push('/cart')" class="view-cart-button">
          🛒 Cart <span v-if="cartCount" class="cart-count">{{ cartCount }}</span>
        </button>
        <button @click="handleLogout" class="logout-button">
          Logout
        </button>
      </div>
    </header>

    <main>
      <section class="filters">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search products..."
          class="search-input"
        />
        <select v-model="sortBy" class="sort-select">
          <option value="default">Default Sorting</option>
          <option value="priceAsc">Price Low to High</option>
          <option value="priceDesc">Price High to Low</option>
        </select>
      </section>

      <section class="product-list">
        <div v-for="product in filteredProducts" :key="product.id" class="product-card">
          <div class="product-image-container">
            <img :src="product.image" :alt="product.name" class="product-image" />
            <div class="product-overlay">
              <button @click="addToCart(product)" class="add-to-cart-button">
                🛒 Add to Cart
              </button>
            </div>
          </div>
          <h2 class="product-name">{{ product.name }}</h2>
          <p class="product-price">{{ product.price }}</p>
          <p class="product-description">{{ product.description }}</p>
          <div class="product-rating">
            <span class="stars">★★★★☆</span>
            <span class="rating-count">({{ product.ratings || 0 }})</span>
          </div>
        </div>
      </section>

      <section class="review-section">
        <h2>User Reviews</h2>
        <div class="add-review">
          <textarea
            class="review-input"
            v-model="newReview"
            placeholder="Share your experience..."
            maxlength="200"
          ></textarea>
          <div class="review-actions">
            <span class="char-count">{{ 200 - newReview.length }}</span>
            <button 
              class="submit-button" 
              @click="handleAddReview"
              :disabled="!newReview.trim()"
            >
              Submit Review
            </button>
          </div>
        </div>
        <ul class="reviews">
          <li v-for="(review, index) in reviews" :key="index" class="review-item">
            <div class="review-header">
              <img :src="review.avatar || defaultAvatar" alt="User Avatar" class="avatar" />
              <div class="review-meta">
                <strong v-html="review.user"></strong>
                <span class="review-date">{{ review.date }}</span>
              </div>
            </div>
            <div class="review-content" v-html="review.content"></div>
          </li>
        </ul>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>About Us</h3>
          <p>Committed to providing you with a quality shopping experience</p>
        </div>
        <div class="footer-section">
          <h3>Contact Us</h3>
          <p>Email: support@mall.com</p>
          <p>Phone: 400-123-4567</p>
        </div>
        <div class="footer-section">
          <h3>Follow Us</h3>
          <div class="social-links">
            <a href="#" class="social-link">WeChat</a>
            <a href="#" class="social-link">Weibo</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2024 Online Mall. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ProductListView',
  data() {
    return {
      products: [
        {
          id: 1,
          name: "Smart Temperature Control Thermos Cup",
          price: "¥299",
          description: "Smart temperature control, 24 hours of insulation and cooling, LED touch display, long-lasting battery life.",
          image: "https://cbu01.alicdn.com/img/ibank/2018/874/280/8531082478_101075661.jpg",
          ratings: 128
        },
        {
          id: 2,
          name: "Wireless Noise Cancelling Headphones",
          price: "¥899",
          description: "Active noise cancellation, 40-hour battery life, high-definition sound quality, comfortable to wear.",
          image: "https://th.bing.com/th/id/OIP.RVJZ2Nmvn24ILGPA7vAeTQHaHa?w=189&h=189&c=7&r=0&o=5&pid=1.7",
          ratings: 256
        },
        {
          id: 3,
          name: "Portable Coffee Machine",
          price: "￥200.00",
          description: "Portable coffee machine, enjoy delicious coffee anytime, anywhere.",
          image: "https://th.bing.com/th/id/R.34304f2899cb6b682b74018710cadaaf?rik=32eSHNyKn0Vfdg&riu=http%3a%2f%2ffiles.toodaylab.com%2f2014%2f10%2fwacaco_minipresso_20141005211451_00.jpg&ehk=RAvIECHrWAmmdU38ds4ToOXxqVPwlJmo7g1g1qFtqeY%3d&risl=&pid=ImgRaw&r=0",
          ratings: 256
        },
      ],
      reviews: [],
      newReview: "",
      searchQuery: "",
      sortBy: "default",
      cartCount: 0,
      defaultAvatar: "path/to/default-avatar.png"
    }
  },
  computed: {
    filteredProducts() {
      let result = [...this.products]
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        )
      }
      
      // Sorting
      switch(this.sortBy) {
        case "priceAsc":
          result.sort((a, b) => this.extractPrice(a.price) - this.extractPrice(b.price))
          break
        case "priceDesc":
          result.sort((a, b) => this.extractPrice(b.price) - this.extractPrice(a.price))
          break
      }
      
      return result
    }
  },
  methods: {
    extractPrice(priceString) {
      return parseFloat(priceString.replace("¥", ""))
    },
    addToCart(product) {
      const session_id = localStorage.getItem("session_id")
      if (!session_id) {
        this.$router.push("/login")
        return
      }
      
      axios.post("http://127.0.0.1:5000/cart", product, {
        headers: {
          Authorization: `Bearer ${session_id}`
        }
      })
      .then(() => {
        this.cartCount++
        alert(`${product.name} has been added to the cart`)
      })
      .catch((error) => {
        alert('Failed to add to cart, please try again')
        console.error("Failed to add to cart", error)
      })
    },
    handleAddReview() {
      if (!this.newReview.trim()) return
      
      const reviewData = {
        content: this.newReview,
        date: new Date().toLocaleString(),
        user: "Anonymous User",
        avatar: this.defaultAvatar
      }
      
      axios.post("http://127.0.0.1:5000/comments", reviewData)
        .then(() => {
          this.reviews.unshift(reviewData)
          this.newReview = ""
          alert('Review has been submitted')
        })
        .catch((error) => {
          alert('Failed to submit review, please try again')
          console.error("Failed to submit review", error)
        })
    },
    handleLogout() {
      localStorage.removeItem("session_id")
      this.$router.push("/login")
    },
    loadCartCount() {
      const session_id = localStorage.getItem("session_id")
      if (!session_id) return
      
      axios.get("http://127.0.0.1:5000/cart", {
        headers: {
          Authorization: `Bearer ${session_id}`
        }
      })
      .then((response) => {
        this.cartCount = response.data.length
      })
      .catch((error) => {
        console.error("Failed to get cart count", error)
      })
    }
  },
  created() {
    this.loadCartCount()
    
    axios.get("http://127.0.0.1:5000/comments")
      .then((response) => {
        this.reviews = response.data
      })
      .catch((error) => {
        console.error("Failed to get reviews", error)
      })
  }
}
</script>


<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
}

.header h1 {
  font-size: 2.5em;
  color: #2c3e50;
  margin-bottom: 10px;
}

.header p {
  color: #7f8c8d;
  font-size: 1.2em;
}

.header-actions {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 15px;
}

.view-cart-button, .logout-button {
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.view-cart-button {
  background-color: #3498db;
  color: white;
}

.logout-button {
  background-color: #e74c3c;
  color: white;
}

.cart-count {
  background-color: #e74c3c;
  color: white;
  padding: 2px 6px;
  border-radius: 50%;
  font-size: 0.8em;
  margin-left: 5px;
}

.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.search-input, .sort-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1em;
}

.search-input {
  flex: 1;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.product-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image-container {
  position: relative;
  padding-top: 100%;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.review-section {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.review-input {
  width: 100%;
  min-height: 100px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  resize: vertical;
}

.review-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count {
  color: #7f8c8d;
}

.review-item {
  border-bottom: 1px solid #eee;
  padding: 20px 0;
}

.review-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
}

.review-meta {
  display: flex;
  flex-direction: column;
}

.review-date {
  color: #7f8c8d;
  font-size: 0.9em;
}

/* 页脚样式 */
.footer {
  margin-top: 50px;
  padding: 40px 0;
  background: #2c3e50;
  color: white;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-section h3 {
  margin-bottom: 15px;
  font-size: 1.2em;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-link {
  color: white;
  text-decoration: none;
}

.footer-bottom {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style> 