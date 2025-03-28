<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Username" />
      <input type="password" v-model="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      this.$axios.post('/api/login', {
        username: this.username,
        password: this.password
      })
      .then(() => {
        this.$router.push('/');
      })
      .catch(error => {
        console.error(error);
      });
    }
  }
}
</script>

<style scoped>
form {
  max-width: 300px;
  margin: 0 auto;
}
</style>
