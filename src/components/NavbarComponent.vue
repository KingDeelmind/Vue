<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/cart">Cart</router-link>
    <router-link to="/login">Login</router-link>
    <router-link to="/register">Register</router-link>
  </nav>
</template>

<script>
export default {
  name: 'NavbarComponent'
}
</script>

<style scoped>
nav {
  background: #333;
  padding: 10px;
}
nav a {
  color: white;
  margin: 0 10px;
  text-decoration: none;
}
</style>
