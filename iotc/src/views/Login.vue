<template>
  <div class="login">
    <form action="" @submit="login">
      <ul class="login-check">
        <li>登录</li>
        <li>
          <label class="iconfont icon-wo" for="na"></label
          ><input id="na" v-model="model.username" />
        </li>
        <li>
          <label class="iconfont icon-suo" for="pass"></label
          ><input type="password" v-model="model.password" id="pass" />
        </li>
        <li>
          <button type="submit">
            NEXT DOOR
          </button>
        </li>
      </ul>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: "",
      model: {}
    };
  },
  methods: {
    login() {
      if (this.model.username == "mycar" && this.model.password == "1234") {
        sessionStorage.setItem("token", "true");
        this.$message.success(`登录成功！`);
        this.$router.push("/home");
      } else {
        this.$message.success(`账号或密码错误！`);
        this.$router.push("/Login");
      }
      return;
    }
  },
  mounted() {}
};
</script>

<style scoped>
#svg {
  position: relative;
  top: 8px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

li {
  list-style: none;
}

html {
  background: linear-gradient(45deg, #08a, #04a);
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.login {
  position: absolute;
  opacity: 1;
  top: 50%;
  left: 50%;
  margin-left: -150px;
  margin-top: -200px;
  padding-top: 10px;
  width: 300px;
  height: 400px;
  background: linear-gradient(
    45deg,
    #0ac,
    #08d 95%,
    rgba(255, 255, 255, 0) 5px
  );
  transition-duration: 1s;
  transition-delay: 300ms;
  border-radius: 3px;
  box-shadow: -15px 15px 10px 1px #333;
  text-align: center;
  color: rgba(200, 200, 200, 0.8);
}

form {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 280px;
  height: 380px;
  justify-content: center;
  flex-wrap: wrap;
  z-index: 1;
}

form li:nth-child(1) {
  padding: 20px;
  user-select: none;
  color: #fff;
}

form label {
  position: relative;
  top: 3px;
  width: 25px;
  transition-duration: 1s;
}

form li:not(:nth-child(1)) {
  position: relative;
  padding: 15px;
  z-index: 2;
  width: 250px;
}

form input {
  justify-self: center;
  background-color: rgba(150, 150, 150, 0.6);
  border: 0;
  margin-left: 5px;
  width: 150px;
  height: 25px;
  flex: 1;
  font-size: 16px;
  transition-duration: 1s;
}

#ch {
  width: 80px;
}
#ch + span {
  display: inline-block;
  width: 70px;
  font-weight: 500;
  user-select: none;
  cursor: pointer;
}

form button {
  user-select: none;
  outline: none;
  cursor: pointer;
  margin-top: 20px;
  width: 120px;
  height: 30px;
  border-radius: 20px;
  border: 2px solid #cef;
  color: #fff;
  font-weight: 700;
  transition-duration: 500ms;
  background: linear-gradient(0deg, #0af, #0af);
}

form button:hover {
  transform: scale(1.1, 1.1);
}

form button:active {
  transition-duration: 100ms;
  transform: scale(0.9, 0.9);
}
</style>
