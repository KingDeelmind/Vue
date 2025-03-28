<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="navbar-brand">
        <img src="@/assets/logo.png" alt="Mall Logo" class="navbar-logo" />
        <span class="brand-name">Online Mall</span>
      </router-link>

      <div class="navbar-links">
        <template v-if="!isLoggedIn">
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/register" class="nav-link">Register</router-link>
        </template>
        <template v-else>
          <router-link to="/products" class="nav-link">Product List</router-link>
          <div class="cart-wrapper">
            <router-link to="/cart" class="nav-link cart-link">
              <i class="fas fa-shopping-cart"></i>
              <span v-if="cartCount" class="cart-count">{{ cartCount }}</span>
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from 'axios'

export default {
  name: 'NavBar',
  data() {
    return {
      searchQuery: '',
      cartCount: 0,
      showUserMenu: false,
      userAvatar: 'https://via.placeholder.com/40', 
    }
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('session_id')
    }
  },
  methods: {
    handleSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push(`/products?search=${encodeURIComponent(this.searchQuery)}`)
      }
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu
    },
    closeUserMenu() {
      this.showUserMenu = false
    },
    handleLogout() {
      localStorage.removeItem('session_id')
      this.$router.push('/login')
    },
    loadCartCount() {
      if (!this.isLoggedIn) return
      
      const session_id = localStorage.getItem('session_id')
      axios.get('http://127.0.0.1:5000/cart',  {
        headers: {
          Authorization: `Bearer ${session_id}`
        }
      })
      .then(response => {
        this.cartCount = response.data.length
      })
      .catch(error => {
        console.error('Failed to retrieve cart count', error)
      })
    }
  },
  created() {
    this.loadCartCount()
  },
  directives: {
    clickOutside: {
      bind(el, binding) {
        el.clickOutsideEvent = function(event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value()
          }
        }
        document.addEventListener('click', el.clickOutsideEvent)
      },
      unbind(el) {
        document.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  }
}
</script>

<style scoped>
.navbar {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #2c3e50;
}

.navbar-logo {
  height: 40px;
  margin-right: 10px;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #3498db;
}

.cart-wrapper {
  position: relative;
}

.cart-link {
  font-size: 1.2rem;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #e74c3c;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
}

.user-menu {
  position: relative;
  cursor: pointer;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 200px;
  margin-top: 10px;
  padding: 8px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  color: #2c3e50;
  text-decoration: none;
  transition: background-color 0.3s;
}

.dropdown-item i {
  margin-right: 10px;
  width: 20px;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-divider {
  height: 1px;
  background-color: #eee;
  margin: 8px 0;
}

.logout-btn {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #e74c3c;
}

.logout-btn:hover {
  background-color: #fee;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar-links {
    gap: 1rem;
  }
}

@media (max-width: 576px) {
  .brand-name {
    display: none;
  }
}
</style> 