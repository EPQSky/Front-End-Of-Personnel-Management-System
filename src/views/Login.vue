<template>
  <div>
    <el-form v-loading="loading"
             element-loading-text="正在登陆中..."
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)"
             size="normal"
             :model="loginForm"
             :rules="rules"
             status-icon
             ref="loginForm" class="loginContainer">
      <h3 class="loginTitle">微人事管理系统登陆</h3>
      <el-form-item size="normal" label="账号" prop="username">
        <el-input type="username" v-model="loginForm.username" autocomplete="off" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item size="normal" label="密码" prop="password">
        <el-input size="normal" type="password" v-model="loginForm.password" autocomplete="off"
                  placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item size="normal" label="验证码" prop="code">
        <el-input size="normal" type="text" v-model="loginForm.code" autocomplete="off"
                  placeholder="点击图片更换验证码"
                  @keydown.enter.native="submitLogin"></el-input>
        <img :src="vcUrl" @click="updateVerifyCode" alt="验证码">
      </el-form-item>
      <el-button size="normal" class="loginButton" type="primary" @click="submitLogin" round>登陆</el-button>
    </el-form>
  </div>
</template>

<script>
// import {postKeyValueRequest} from "@/utils/api";

export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      vcUrl: 'verifyCode?time=' + new Date(),
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }
        ],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }
        ]
        ,
        code: [{
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        }
        ]
      }
    }
  },
  methods: {
    updateVerifyCode() {
      this.vcUrl = 'verifyCode?time=' + new Date();
    },
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.postKeyValueRequest('/doLogin', this.loginForm).then(resp => {
            this.loading = false;
            if (resp) {
              window.sessionStorage.setItem('user', JSON.stringify(resp.obj));
              let path = this.$route.query.redirect;
              this.$router.replace((path == '/' || path == undefined) ? '/home' : path);
            }
          })
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style>
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 150px auto 0 auto;
  width: 350px;
  padding: 50px 35px 25px 25px;
  background: white;
  border: 1px solid #EAEAEA;
  box-shadow: 0 0 15px #CAC6C6;
}

.loginTitle {
  margin: 5px auto 15px auto;
  text-align: center;
}

.loginButton {
  display: block;
  margin: 35px auto 20px auto;
  width: 300px;
}

.el-form-item__content {
  display: flex;
  align-items: center;
}
</style>
