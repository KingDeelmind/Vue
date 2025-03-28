<template>
  <div class="product">
    <h3>{{ product.name }}</h3>
    <p v-html="product.description"></p> <!-- 存储型XSS漏洞 -->
    <button @click="addToCart(product)">Add to Cart</button>
  </div>
</template>

<script>
export default {
  props: ['product'],
  methods: {
    addToCart(product) {
      this.$axios.post('/api/add-to-cart', { productId: product.id })
        .then(() => {
          console.log('Added to cart');
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
}
</script>

<style scoped>
.product {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
}
</style>
