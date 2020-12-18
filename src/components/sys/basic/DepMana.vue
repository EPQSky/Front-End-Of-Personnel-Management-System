<template>
  <div style="width: 500px;">
    <el-input
        style="margin-bottom: 6px;"
        size="medium"
        prefix-icon="el-icon-search"
        placeholder="请输入部门名称进行搜索..."
        v-model="filterText">
    </el-input>
    <el-tree
        size="medium"
        :data="deps"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        ref="tree">
      <span class="custom-tree-node" style="display: flex;justify-content: space-between;width: 100%"
            slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
              class="depBtn"
              type="primary"
              size="mini"
              @click="() => showAddDepView(data)">
            添加部门
          </el-button>
          <el-button
              class="depBtn"
              type="danger"
              size="mini"
              @click="() => deleteDep(data)">
            删除部门
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog
        title="添加部门"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
      <div style="margin-bottom: 10px;">
        <el-tag size="medium" style="margin-right: 6px;">上级部门</el-tag>
        <span>{{ pName }}</span>
      </div>
      <div>
        <el-tag size="medium" style="margin-right: 6px;">部门名称</el-tag>
        <el-input style="width: 200px;" v-model="dep.name" placeholder="请输入部门名称..."></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="doAddDep">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DepMana",
  data() {
    return {
      filterText: '',
      dep: {
        name: '',
        parentId: -1
      },
      pName: '',
      deps: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dialogVisible: false
    }
  },
  mounted() {
    this.initDeps();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    removeDepFromDeps(deps, id) {
      for (let i = 0; i < deps.length; i++) {
        let d = deps[i];
        if (d.id === id) {
          deps.splice(i, 1);
          return;
        } else {
          this.removeDepFromDeps(d.children, id);
        }
      }
    },
    addDepToDeps(deps, dep) {
      for (let i = 0; i < deps.length; i++) {
        let d = deps[i];
        if (d.id === dep.parentId) {
          d.children = d.children.concat(dep);
          return;
        } else {
          this.addDepToDeps(d.children, dep);
        }
      }
    },
    doAddDep() {
      if (this.dep.name) {
        this.postRequest('/system/basic/department/', this.dep).then(resp => {
          if (resp) {
            this.addDepToDeps(this.deps, resp.obj);
            this.dep.name = '';
            this.dep.parentId = -1;
            this.pName = '';
            this.dialogVisible = false;
          }
        })
      } else {
        this.$message.error('请正确输入部门名称！');
      }
    },
    showAddDepView(data) {
      this.pName = data.name;
      this.dep.parentId = data.id;
      this.dialogVisible = true;
    },
    deleteDep(data) {
      this.$confirm('此操作将永久删除【' + data.name + '】部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (data.isParent) {
          this.$message.error('父部门删除失败！');
        } else {
          this.deleteRequest('/system/basic/department/' + data.id).then(resp => {
            if (resp) {
              this.removeDepFromDeps(this.deps, data.id);
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    initDeps() {
      this.getRequest('/system/basic/department/').then(resp => {
        if (resp) {
          this.deps = resp;
        }
      })
    }
  }
}
</script>

<style>

.depBtn {
  padding: 3px;
}

</style>