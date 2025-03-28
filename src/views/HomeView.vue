<template>
    <div>
      <h1>Welcome to the Mall</h1>
      <div v-for="product in products" :key="product.id">
        <ProductComponent :product="product" />
      </div>
    </div>
  </template>
  
  <script>
  import ProductComponent from '../components/ProductComponent.vue'
  
  export default {
    components: {
      ProductComponent
    },
    data() {
      return {
        products: []
      }
    },
    created() {
      this.fetchProducts();
    },
    methods: {
      fetchProducts() {
        this.$axios.get('/api/products')
          .then(response => {
            this.products = response.data;
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  }
  </script>
  