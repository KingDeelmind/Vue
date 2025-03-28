<template>
  <div class="share-page">
    <div v-if="isLoading" class="loading-message">
      Loading...
    </div>
    <template v-else>
      <header class="share-header">
        <h1>Shared Cart</h1>
        <p>Below are the items in the cart you shared:</p>
      </header>

      <div v-if="sharedItems.length === 0" class="empty-cart-message">
        The cart is empty.
      </div>
      
      <div v-else class="shared-items">
        <div v-for="(item, index) in sharedItems" :key="index" class="shared-item">
          <div class="item-image">
            <img :src="item.image || defaultImage" :alt="item.name" />
          </div>
          <div class="item-details">
            <h3 class="item-name" v-html="item.name"></h3>
            <p class="item-price" v-html="item.price"></p>
            <p class="item-description" v-html="item.description"></p>
            <button @click="addToCart(item)" class="add-to-cart-button">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div class="share-actions">
        <button @click="copyShareLink" class="share-button">
          <i class="fas fa-copy"></i> Copy Share Link
        </button>
        <button @click="$router.push('/products')" class="browse-button">
          <i class="fas fa-shopping-bag"></i> Continue Shopping
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ShareView',
  data() {
    return {
      sharedItems: [],
      defaultImage: 'https://via.placeholder.com/150',
      isLoading: true
    }
  },
  methods: {
    async parseSharedItems() {
      try {
        this.isLoading = true
        // Directly use URL parameters without decoding or filtering
        const searchParams = window.location.hash.includes('?') 
          ? window.location.hash.split('?')[1] 
          : window.location.search.slice(1)
        
        const params = new URLSearchParams(searchParams)
        
        const ids = params.getAll('id')
        const names = params.getAll('name')
        const prices = params.getAll('price')
        const images = params.getAll('image')
        const descriptions = params.getAll('description')

        if (!ids.length) {
          this.sharedItems = []
          return
        }

        // Directly use unfiltered parameters
        const items = []
        for (let i = 0; i < ids.length; i++) {
          const item = {
            id: ids[i],
            name: names[i] || '',
            price: prices[i] || '',
            image: images[i] || this.defaultImage,
            description: descriptions[i] || ''
          }
          items.push(item)
        }

        this.sharedItems = items.filter(item => item.id)
      } catch (error) {
        console.error('Failed to parse shared data:', error)
        this.sharedItems = []
      } finally {
        this.isLoading = false
      }
    },
    copyShareLink() {
      const url = window.location.href
      navigator.clipboard.writeText(url)
        .then(() => {
          alert('Link copied to clipboard')
        })
        .catch(() => {
          alert('Copy failed, please manually copy the link')
        })
    },
    addToCart(item) {
      const session_id = localStorage.getItem('session_id')
      if (!session_id) {
        this.$router.push('/login')
        return
      }

      axios.post('http://127.0.0.1:5000/cart', item, {
        headers: {
          Authorization: `Bearer ${session_id}`
        }
      })
      .then(() => {
        alert(`${item.name} has been added to the cart`)
      })
      .catch((error) => {
        alert('Failed to add to cart, please try again')
        console.error('Failed to add to cart', error)
      })
    }
  },
  watch: {
    // Watch changes in both hash and search
    '$route': {
      immediate: true,
      deep: true,
      handler(to) {
        console.log('Route changed:', to) // Debug log
        this.parseSharedItems()
      }
    }
  },
  mounted() {
    console.log('Component mounted, current URL:', window.location.href) // Debug log
    this.parseSharedItems()
  }
}
</script>


<style scoped>
.share-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.share-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.share-header h1 {
  font-size: 2em;
  color: #2c3e50;
  margin-bottom: 10px;
}

.share-header p {
  color: #7f8c8d;
  font-size: 1.1em;
}

.empty-cart-message {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  color: #7f8c8d;
  font-size: 1.2em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.shared-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.shared-item {
  display: flex;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.shared-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.item-image {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 1.4em;
  color: #2c3e50;
  margin-bottom: 10px;
}

.item-price {
  font-size: 1.2em;
  color: #e74c3c;
  font-weight: bold;
  margin-bottom: 10px;
}

.item-description {
  color: #7f8c8d;
  line-height: 1.5;
  margin-bottom: 20px;
  flex-grow: 1;
}

.add-to-cart-button {
  align-self: flex-start;
  padding: 10px 20px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.add-to-cart-button:hover {
  background-color: #27ae60;
}

.share-actions {
  margin-top: 30px;
  display: flex;
  gap: 15px;
  justify-content: center;
}

.share-button, .browse-button {
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-size: 1em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.share-button {
  background-color: #3498db;
  color: white;
}

.share-button:hover {
  background-color: #2980b9;
}

.browse-button {
  background-color: #2ecc71;
  color: white;
}

.browse-button:hover {
  background-color: #27ae60;
}

@media (max-width: 768px) {
  .shared-item {
    flex-direction: column;
  }

  .item-image {
    width: 100%;
    height: 250px;
  }

  .share-actions {
    flex-direction: column;
  }

  .share-button, .browse-button {
    width: 100%;
    justify-content: center;
  }
}

.loading-message {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
  color: #666;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

.loading-message {
  animation: pulse 1.5s infinite;
}
</style> 