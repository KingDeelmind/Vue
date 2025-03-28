<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2>创建账号</h2>
        <p>登录开始购物</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="username">
            <i class="fas fa-user"></i>
            用户名
          </label>
          <input
            id="username"
            type="text"
            v-model="username"
            placeholder="请输入用户名"
            required
            :class="{ 'input-error': errors.username }"
          />
          <span class="error-message" v-if="errors.username">{{ errors.username }}</span>
        </div>

        <div class="form-group">
          <label for="password">
            <i class="fas fa-lock"></i>
            密码
          </label>
          <div class="password-input">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="请输入密码"
              required
              :class="{ 'input-error': errors.password }"
            />
            <button 
              type="button" 
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label for="confirmPassword">
            <i class="fas fa-lock"></i>
            确认密码
          </label>
          <div class="password-input">
            <input
              id="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              placeholder="请再次输入密码"
              required
              :class="{ 'input-error': errors.confirmPassword }"
            />
            <button 
              type="button" 
              class="toggle-password"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <span class="error-message" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
        </div>

        <div class="form-group">
          <button type="submit" class="register-button" :disabled="isLoading">
            <span v-if="!isLoading">注册</span>
            <span v-else class="loading-spinner"></span>
          </button>
        </div>

        <div class="form-footer">
          <p>已有账号？ <router-link to="/login">立即登录</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserRegisterView',
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      isLoading: false,
      errors: {
        username: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    validateForm() {
      let isValid = true
      this.errors = {
        username: '',
        password: '',
        confirmPassword: ''
      }

      if (!this.username.trim()) {
        this.errors.username = '用户名不能为空'
        isValid = false
      } else if (this.username.length < 3) {
        this.errors.username = '用户名至少需要3个字符'
        isValid = false
      }

      if (!this.password) {
        this.errors.password = '密码不能为空'
        isValid = false
      } else if (this.password.length < 6) {
        this.errors.password = '密码至少需要6个字符'
        isValid = false
      }

      if (this.password !== this.confirmPassword) {
        this.errors.confirmPassword = '两次输入的密码不一致'
        isValid = false
      }

      return isValid
    },
    async handleRegister() {
      if (!this.validateForm()) return

      this.isLoading = true
      try {
        await axios.post("http://127.0.0.1:5000/register", {
          username: this.username,
          password: this.password
        })
        this.$router.push({
          path: '/login',
          query: { registered: 'success' }
        })
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.errors.username = "用户名已存在"
        } else {
          alert("注册失败，请稍后重试")
        }
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.register-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  padding: 40px;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  color: #2c3e50;
  font-size: 2em;
  margin-bottom: 10px;
}

.register-header p {
  color: #7f8c8d;
  font-size: 1em;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #2c3e50;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group label i {
  color: #3498db;
}

.form-group input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1em;
  transition: all 0.3s ease;
}

.form-group input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  outline: none;
}

.input-error {
  border-color: #e74c3c !important;
}

.error-message {
  color: #e74c3c;
  font-size: 0.9em;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #95a5a6;
  cursor: pointer;
  padding: 0;
}

.register-button {
  background-color: #3498db;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: relative;
}

.register-button:hover {
  background-color: #2980b9;
}

.register-button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.form-footer {
  text-align: center;
  margin-top: 20px;
  color: #7f8c8d;
}

.form-footer a {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}

.form-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-card {
    padding: 20px;
  }
}
</style> 