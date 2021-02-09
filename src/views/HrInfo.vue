<template>
  <div>
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>个人中心</span>
          <el-button style="float: right; padding: 3px 0; color: #F56C6C;" type="text" @click="showHrInfo = true">修改个人资料
          </el-button>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <div>
            <p>UID：{{ hr.id }}</p>
            <p>用户名：{{ hr.username }}</p>
            <p>姓名：{{ hr.name }}</p>
            <p>地址：{{ hr.address }}</p>
            <p>电话号码：{{ hr.telephone }}</p>
            <p>手机号码：{{ hr.phone }}</p>
          </div>
          <div>
            <img :src="hr.userFace" alt="head" width="100px" height="100px">
          </div>
        </div>
      </el-card>
    </div>
    <div>
      <el-dialog
          size="small"
          title="修改个人资料"
          :visible.sync="showHrInfo"
          width="30%">
        <div>
          <table>
            <tr>
              <td>
                <el-tag>姓名：</el-tag>
              </td>
              <td>
                <el-input v-model="hrCopy.name"></el-input>
              </td>
            </tr>
            <tr>
              <td>
                <el-tag>地址：</el-tag>
              </td>
              <td>
                <el-input v-model="hrCopy.address"></el-input>
              </td>
            </tr>
            <tr>
              <td>
                <el-tag>电话号码：</el-tag>
              </td>
              <td>
                <el-input v-model="hrCopy.telephone"></el-input>
              </td>
            </tr>
            <tr>
              <td>
                <el-tag>手机号码：</el-tag>
              </td>
              <td>
                <el-input v-model="hrCopy.phone"></el-input>
              </td>
            </tr>
          </table>
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="showHrInfo = false">取 消</el-button>
    <el-button size="small" type="primary" @click="updateHrInfo">确 定</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "HrInfo",
  data() {
    return {
      hr: null,
      hrCopy: null,
      showHrInfo: false
    }
  },
  mounted() {
    this.initHrInfo()
  },
  methods: {
    initHrInfo() {
      this.getRequest('/hr/info').then(resp => {
        if (resp) {
          this.hr = resp;
          this.hrCopy = Object.assign({}, this.hr);
          window.sessionStorage.setItem('user', JSON.stringify(resp));
          this.$store.commit('initCurrentHr', resp);
        }
      })
    },
    updateHrInfo() {
      this.putRequest('/hr/info', this.hrCopy).then(resp => {
        if (resp) {
          this.showHrInfo = false;
          this.initHrInfo();
        }
      })
    }
  }
}
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 600px;
}
</style>