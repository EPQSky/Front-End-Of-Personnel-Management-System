<template>
  <div>
    <div>
      <el-input style="width: 250px;margin-right: 6px;" size="small"
                placeholder="请输入角色英文名" v-model="role.name">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input style="width: 250px;margin-right: 6px;" size="small"
                placeholder="请输入角色中文名" v-model="role.nameZh">
      </el-input>
      <el-button size="small" icon="el-icon-plus" type="primary" @click="addRole">添加</el-button>
    </div>
    <div>
      <el-collapse v-model="activeName" class="PerMissManaMain" size="medium" accordion>
        <el-collapse-item v-for="(role, index) in roles" :title="role.nameZh" :name="role.id" :key="index">
          <el-card size="medium" class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问的资源</span>
              <el-button style="float: right; padding: 3px 0; color: red;" icon="el-icon-delete" type="text"
                         @click="deleteRole(role.id, role.nameZh)">删除
              </el-button>
            </div>
            <div>
              <el-tree
                  :data="menus"
                  :props="defaultProps"
                  ref="tree"
                  node-key="id"
                  :default-checked-keys="role.menuIds"
                  show-checkbox>
              </el-tree>
              <div style="display: flex;justify-content: flex-end;">
                <el-button size="small" @click="updateCancel">取消修改</el-button>
                <el-button size="small" type="primary" @click="doUpdate(role.id, index)">确认修改</el-button>
              </div>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: "PerMissMana",
  data() {
    return {
      role: {
        name: '',
        nameZh: ''
      },
      roles: [],
      menus: [],
      activeName: -1,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted() {
    this.GetAllMenus()
    this.InitPerMisses()
  },
  methods: {
    deleteRole(id, name) {
      this.$confirm('此操作将永久删除【' + name + '】角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/perMiss/' + id).then(resp => {
          if (resp) {
            this.InitPerMisses();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    addRole() {
      if (this.role.name && this.role.nameZh) {
        this.postRequest('/system/basic/perMiss/', this.role).then(resp => {
          if (resp) {
            this.role.name = '';
            this.role.nameZh = '';
            this.InitPerMisses();
          }
        })
      } else {
        this.$message.error('请正确输入角色英文名以及中文名！');
      }
    },
    updateCancel() {
      this.$message({
        type: 'info',
        message: '已取消修改'
      });
      this.activeName = -1;
    },
    doUpdate(rid, index) {
      let tree = this.$refs.tree[index];
      let treeIds = tree.getCheckedKeys(true);
      let url = '/system/basic/perMiss/?rid=' + rid;
      treeIds.forEach(id => {
        url += '&mids=' + id;
      })
      this.putRequest(url).then(resp => {
        if (resp) {
          this.InitPerMisses();
        }
      })
    },
    InitPerMisses() {
      this.getRequest('/system/basic/perMiss/').then(resp => {
        if (resp) {
          this.roles = resp;
        }
      })
    },
    GetAllMenus() {
      this.getRequest('/system/basic/perMiss/menus').then(resp => {
        if (resp) {
          this.menus = resp;
        }
      })
    }
  }
}
</script>

<style>

.PerMissManaMain {
  width: 800px;
  margin-top: 10px;
}

</style>