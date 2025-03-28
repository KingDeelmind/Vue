<template>
  <div class="auth-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input
        type="text"
        v-model="username"
        placeholder="Username"
        required
      />
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
      />
      <button type="submit" class="submit-button">Login</button>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MutiLogin',
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    handleLogin(e) {
      e.preventDefault()
      axios.post("http://127.0.0.1:5000/login", {
        username: this.username,
        password: this.password
      })
      .then((response) => {
        const session_id = response.data.session_id
        localStorage.setItem("session_id", session_id)
        this.$router.push("/products")
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          this.errorMessage = "Incorrect username or password"
        } else {
          this.errorMessage = "Login failed, please try again later"
        }
      })
    }
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: #f5f5f5;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.auth-container h2 {
  margin-bottom: 20px;
  color: #333;
}

.auth-container input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
}

.submit-button:hover {
  background-color: #45a049;
}

.error-message {
  color: #ff6b6b;
  margin-top: 10px;
}
</style> 