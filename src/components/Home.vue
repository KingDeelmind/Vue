<!-- src/views/Home.vue -->
<template>
    <div class="home">
      <h1>商品列表</h1>
      <div class="products">
        <Product 
          v-for="product in products" 
          :key="product.id"
          :product="product"
          @add-to-cart="addToCart"
        />
      </div>
    </div>
  </template>
  
  <script>
  import Product from '@/components/Product.vue'
  
  export default {
    components: { Product },
    data() {
      return {
        products: []
      }
    },
    async created() {
      const { data } = await this.$http.get('/products')
      this.products = data
    },
    methods: {
      async addToCart(productId) {
        try {
          await this.$http.post('/cart', {
            product_id: productId,
            quantity: 1
          })
        } catch (error) {
          console.error('添加购物车失败')
        }
      }
    }
  }
  </script>