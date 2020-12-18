<template>
  <div>
    <div style="margin: 15px auto;width: 500px;display: flex;justify-content: center">
      <el-input style="margin-right: 6px;" size="medium" prefix-icon="el-icon-search" v-model="keyWords"
                placeholder="通过用户名搜索用户..."></el-input>
      <el-button size="medium" type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
    </div>
    <div class="hr-container">
      <el-card class="hr-card" v-for="(hr, index) in hrs" :key="index">
        <div slot="header" class="clearfix">
          <span>{{ hr.name }}</span>
          <el-button style="float: right; padding: 3px 0;color: red;" type="text" icon="el-icon-delete"
                     @click="doDeleteHr(hr)"></el-button>
        </div>
        <div>
          <div style="display: flex;justify-content: center;width: 100%;margin-bottom: 10px;">
            <img :src="hr.userFace" :alt="hr.name" :title="hr.name" class="userFace-img">
          </div>
          <div class="userInfo-container">
            <div>用户名：{{ hr.name }}</div>
            <div>手机号码：{{ hr.phone }}</div>
            <div>电话号码：{{ hr.telephone }}</div>
            <div>地址：{{ hr.address }}</div>
            <div style="display: flex;justify-content: flex-start;">用户状态：
              <el-switch
                  style="display: block"
                  size="medium"
                  v-model="hr.enabled"
                  @change="enabledChange(hr)"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="启用"
                  inactive-text="禁用">
              </el-switch>
            </div>
            <div style="display: flex;justify-content: flex-start;">用户角色：
              <el-tag style="margin-right: 3px;" size="medium" type="success" v-for="(role, index) in hr.roles"
                      :key="index">{{ role.nameZh }}
              </el-tag>
              <el-popover
                  placement="right"
                  title="角色列表"
                  @show="showRoles(hr)"
                  @hide="hideRoles(hr)"
                  width="200"
                  trigger="click">
                <el-select v-model="selectRoles" multiple placeholder="请选择">
                  <el-option
                      v-for="(r, rindex) in allRoles"
                      :key="rindex"
                      :label="r.nameZh"
                      :value="r.id">
                  </el-option>
                </el-select>
                <el-button slot="reference" style="color: #67C23A;" size="small" type="text"
                           icon="el-icon-more"></el-button>
              </el-popover>
            </div>
            <div>备注：{{ hr.remark }}</div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "SysHr",
  data() {
    return {
      keyWords: '',
      hrs: [],
      allRoles: [],
      selectRoles: []
    }
  },
  mounted() {
    this.initHrs()
  },
  methods: {
    doDeleteHr(hr) {
      this.$confirm('此操作将永久删除【' + hr.name + '】操作员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/hr/' + hr.id).then(resp => {
          if (resp) {
            this.initHrs();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    doSearch() {
      this.initHrs();
    },
    hideRoles(hr) {
      let roles = hr.roles;
      let flag = false;
      let roleIds = [];
      roles.forEach(role => {
        roleIds.push(role.id);
      })

      if (this.selectRoles.length !== roleIds.length) {
        flag = true;
      } else {
        for (let i = 0; i < this.selectRoles.length; i++) {
          if (!roleIds.includes(this.selectRoles[i])) {
            flag = true;
            break;
          }
        }
      }

      if (flag) {
        this.$confirm('此操作将永久更新这【' + this.selectRoles.length + '】个角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = '/system/hr/roles?hid=' + hr.id;
          this.selectRoles.forEach(r => {
            url += '&rids=' + r;
          })
          this.putRequest(url).then(resp => {
            if (resp) {
              this.initHrs();
              this.selectRoles = [];
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消更新'
          });
        });
      }
    },
    showRoles(hr) {
      this.initAllRoles();
      let roles = hr.roles;
      this.selectRoles = [];
      roles.forEach(r => {
        this.selectRoles.push(r.id);
      })
    },
    initAllRoles() {
      this.getRequest('/system/hr/roles').then(resp => {
        if (resp) {
          this.allRoles = resp;
        }
      })
    },
    enabledChange(hr) {
      delete hr.roles;
      this.putRequest('/system/hr/', hr).then(resp => {
        if (resp) {
          this.initHrs();
        }
      })
    },
    initHrs() {
      this.getRequest('/system/hr/?keyWords=' + this.keyWords).then(resp => {
        if (resp) {
          this.hrs = resp;
        }
      })
    }
  }
}
</script>

<style>

.hr-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.hr-container .hr-card {
  width: 32%;
  margin: 15px 10px;
}

.hr-container .userFace-img {
  width: 96px;
  height: 96px;
  border-radius: 50%;
}

.hr-container .userInfo-container {
  font-size: 16px;
  color: #409EFF;
}

</style>