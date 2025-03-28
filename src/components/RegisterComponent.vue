<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="register">
      <input v-model="username" placeholder="Username" />
      <input type="password" v-model="password" placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    register() {
      this.$axios
        .post('/api/register', {
          username: this.username,
          password: this.password
        })
        .then(() => {
          this.$router.push('/login');
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
};
</script>

<style scoped>
form {
  max-width: 300px;
  margin: 0 auto;
}
</style>
