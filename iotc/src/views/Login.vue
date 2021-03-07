<template>
  <div class="main">
    <h3 class="title">5102物联网控制平台</h3>
    <div class="login-container">
      <form action="" @submit="login">
        <ul class="login-check">
          <li class="login-title">登录</li>
          <li class="login-username">
            <label class="iconfont icon-wo" for="username"></label
            ><input id="username" v-model="model.username" />
          </li>
          <li class="login-password">
            <label class="iconfont icon-suo" for="password"></label
            ><input id="password" type="password" v-model="model.password" />
          </li>
          <li class="login-button">
            <button type="submit">
              登录
            </button>
            <button @click="register">
              注册
            </button>
          </li>
        </ul>
      </form>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5'
export default {
  data() {
    return {
      model: {},
    }
  },
  methods: {
    // 登录
    async login() {
      try {
        var res = await this.$http.post('/login', {
          user: this.model.username,
          password: md5(this.model.password),
        })
      } catch (error) {
        return this.$message.error(`登录失败！`)
      }
      if (res.data.state === 0 && res.data.token) {
        localStorage.setItem('iotc_token', res.data.token)
        localStorage.setItem('iotc_user', this.model.username)
        this.$message.success(res.data.message)
        this.$router.push('/home')
      } else {
        this.$message.warning(res.data.message)
      }
    },
    // 注册账号
    async register(e) {
      e.preventDefault();
      try {
        var res = await this.$http.post('/register', {
          user: this.model.username,
          password: md5(this.model.password),
        })
      } catch (error) {
        return this.$message.error(`注册失败！`)
      }
      if (res.data.state === 0) {
        this.$message.success(res.data.message)
      } else {
        this.$message.warning(res.data.message)
      }
      return false
    },
  },
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

li {
  list-style: none;
}

.title {
  text-align: center;
  margin: 5vh 0;
  color: skyblue;
  font-size: 24px;
  text-shadow: 0.125rem 0.125rem 0.125rem #999;
}

.main {
  position: relative;
  background: url('../assets/img/login.jpg') no-repeat;
  background-position: center;
  background-size: 100% 100%;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}

.login-container {
  position: absolute;
  width: 18.75rem;
  height: 25rem;
  opacity: 0.85;
  top: 50%;
  left: 50%;
  margin-left: -9.375rem;
  margin-top: -12.5rem;
  padding-top: 0.625rem;
  background: linear-gradient(
    45deg,
    #0ac,
    rgb(35, 99, 218) 95%,
    rgba(255, 255, 255, 0) 0.3125rem
  );
  transition-delay: 300ms;
  border-radius: 0.1875rem;
  box-shadow: -0.9375rem 0.9375rem 0.625rem 0.0625rem #0088dd55;
  text-align: center;
  color: rgba(200, 200, 200, 0.5);
}

form {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 17.5rem;
  height: 23.75rem;
  justify-content: center;
  flex-wrap: wrap;
  z-index: 1;
}

.login-title {
  padding: 1.25rem;
  user-select: none;
  color: #fff;
}
.login-username,
.login-password {
  color: #fff;
}
form label {
  position: relative;
  top: 0.1875rem;
  width: 1.5625rem;
  transition-duration: 1s;
}

form li:not(:nth-child(1)) {
  position: relative;
  padding: 0.9375rem;
  z-index: 2;
  width: 15.625rem;
}

form input {
  justify-self: center;
  background-color: rgba(54, 172, 240, 0.89);
  border-radius: 0.1875rem;
  margin-left: 0.3125rem;
  width: 9.375rem;
  height: 1.5625rem;
  flex: 1;
  font-size: 1rem;
  transition-duration: 1s;
  outline: none;
  border: 0.125rem solid #999;
  opacity: 0.5;
  transition-delay: 200ms;
  transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
}

form input:focus {
  opacity: 1;
  border: 0.125rem solid rgb(194, 189, 189);
}

.login-button button {
  user-select: none;
  outline: none;
  cursor: pointer;
  margin-top: 1.875rem;
  width: 7.5rem;
  height: 1.875rem;
  border-radius: 1.25rem;
  border: 0.125rem solid #cef;
  color: #fff;
  font-weight: 700;
  transition-duration: 500ms;
  background: linear-gradient(0deg, #0af, #0af);
}

.login-button button:hover {
  transform: scale(1.1, 1.1);
}

.login-button button:active {
  transition-duration: 100ms;
  transform: scale(0.9, 0.9);
}
</style>
