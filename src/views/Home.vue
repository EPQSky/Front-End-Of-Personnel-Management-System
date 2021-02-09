<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title">
          微人事
        </div>
        <el-dropdown class="userInfo" @command="commandHandler">
  <span class="el-dropdown-link">
    <p>{{ user.name }}</p>
    <i><img :src="user.userface" alt=""></i>
  </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
            <el-dropdown-item command="setting">设置</el-dropdown-item>
            <el-dropdown-item command="logout" divided>注销登陆</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router>
            <el-submenu v-for="(item, index) in routes"
                        v-if="!item.hidden"
                        :index="index.toString()" :key="index">
              <template slot="title">
                <i style="color: #409EFF;margin-right: 5px;" :class="item.iconCls"></i>
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item v-for="(child, childIndex) in item.children"
                            :index="child.path" :key="childIndex">
                {{ child.name }}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb class="navigationHead" separator-class="el-icon-arrow-right"
                         v-if="this.$router.currentRoute.path !== '/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="homeWelcome" v-else>
            <h2>欢迎来到微人事管理系统！</h2>
          </div>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      // user: JSON.parse(window.sessionStorage.getItem('user'))
    }
  },
  computed: {
    routes() {
      return this.$store.state.routes;
    },
    user() {
      return this.$store.state.currentHr;
    }
  },
  methods: {
    commandHandler(cmd) {
      if (cmd === 'logout') {
        this.$confirm('是否确定注销登陆？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getRequest('/doLogout');
          window.sessionStorage.removeItem('user');
          this.$store.commit('initRoutes', [])
          this.$router.replace('/');
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消注销'
          });
        });
      } else if (cmd === 'userinfo') {
        this.$router.push('/hrInfo');
      }
    }
  }
}
</script>

<style>
.homeHeader {
  background-color: #409EFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
}

.homeHeader .title {
  font-size: 30px;
  font-family: 华文行楷, monospace;
  color: white;
}

.homeHeader .userInfo {
  cursor: pointer;
}

.el-dropdown-link img {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-left: 8px;
}

.el-dropdown-link p {
  font-size: 16px;
  text-align: center;
  color: white;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
}

.homeWelcome {
  text-align: center;
  font-size: 30px;
  font-family: 华文行楷;
  color: #409EFF;
  padding-top: 50px;
}

.navigationHead {
  margin-bottom: 15px;
}

</style>