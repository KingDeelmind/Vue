<template>
  <div>
    <h2>Your Cart</h2>
    <ul>
      <li v-for="item in cartItems" :key="item.id">
        {{ item.name }} - {{ item.price }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartItems: []
    }
  },
  created() {
    this.fetchCart();
  },
  methods: {
    fetchCart() {
      this.$axios.get('/api/cart')
        .then(response => {
          this.cartItems = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
}
</script>
