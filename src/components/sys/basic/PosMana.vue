<template>
  <div>
    <div>
      <el-input
          size="small"
          class="addPosManaInput"
          placeholder="添加职位..."
          prefix-icon="el-icon-plus"
          v-model="pos.name">
      </el-input>
      <el-button size="small" icon="el-icon-plus" type="primary" @click="addPosition">添加</el-button>
    </div>
    <div class="posManaMain">
      <el-table
          :data="positions"
          stripe
          border
          size="medium"
          style="width: 100%;"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="50">
        </el-table-column>
        <el-table-column
            prop="id"
            label="编号"
            width="60">
        </el-table-column>
        <el-table-column
            prop="name"
            label="职位名称"
            width="200">
        </el-table-column>
        <el-table-column
            prop="createDate"
            label="创建时间"
            width="200">
        </el-table-column>
        <el-table-column
            label="是否启用"
            width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.enabled" size="mini" type="success">已启用</el-tag>
            <el-tag v-else size="mini" type="danger">未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="showEditView(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="deleteMany" type="danger" size="small" style="margin-top: 6px;"
                 :disabled="multipleSelection.length===0">批量删除
      </el-button>
    </div>
    <el-dialog
        title="修改职位信息"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <div>
          <el-tag>职位名称</el-tag>
          <el-input style="width: 300px; margin-left: 6px;" size="medium" v-model="updatePos.name"></el-input>
        </div>
        <div style="margin-top: 10px;">
          <el-tag>是否启用</el-tag>
          <el-switch
              style="margin-left: 8px;"
              size="medium"
              v-model="updatePos.enabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="禁用">
          </el-switch>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="doUpdateCancel">取 消</el-button>
    <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PosMana",
  data() {
    return {
      pos: {
        name: ''
      },
      updatePos: {
        name: '',
        enabled: false
      },
      dialogVisible: false,
      multipleSelection: [],
      positions: []
    }
  },
  mounted() {
    this.initPositions();
  },
  methods: {
    doUpdateCancel() {
      this.dialogVisible = false;
      this.$message({
        type: 'info',
        message: '已取消更新'
      });
    },
    deleteMany() {
      this.$confirm('此操作将永久删除这【' + this.multipleSelection.length + '】条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/pos/', this.multipleSelection).then(resp => {
          if (resp) {
            this.initPositions();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    doUpdate() {
      this.putRequest('/system/basic/pos/', this.updatePos).then(resp => {
        if (resp) {
          this.initPositions();
          this.updatePos.name = '';
          this.dialogVisible = false;
        }
      })
    },
    addPosition() {
      if (this.pos.name) {
        this.postRequest('/system/basic/pos/', this.pos).then(resp => {
          if (resp) {
            this.initPositions();
            this.pos.name = '';
          }
        })
      } else {
        this.$message.error('请正确输入职位名称！');
      }
    },
    showEditView(index, data) {
      Object.assign(this.updatePos, data);
      this.dialogVisible = true;
    },
    handleDelete(index, data) {
      this.$confirm('此操作将永久删除【' + data.name + '】职位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/pos/' + data.id).then(resp => {
          if (resp) {
            this.initPositions();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    initPositions() {
      this.getRequest('/system/basic/pos/').then(resp => {
        if (resp) {
          this.positions = resp;
        }
      })
    }
  }
}
</script>

<style>

.addPosManaInput {
  width: 300px;
  margin-right: 6px;
}

.posManaMain {
  width: 950px;
  margin-top: 10px;
}

</style>