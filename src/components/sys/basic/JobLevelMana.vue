<template>
  <div>
    <div>
      <el-input
          class="addJobLevelManaInput"
          size="small"
          placeholder="添加职称..."
          prefix-icon="el-icon-plus"
          v-model="jobLevel.name">
      </el-input>
      <el-select class="addJobLevelManaSelect" size="small" v-model="jobLevel.titleLevel" placeholder="职称等级">
        <el-option
            v-for="level in titleLevels"
            :key="level.id"
            :label="level.name"
            :value="level.name">
        </el-option>
      </el-select>
      <el-button size="small" icon="el-icon-plus" type="primary" @click="addJobLevel">添加</el-button>
    </div>
    <div class="jobLevelManaMain">
      <el-table
          :data="jobLevels"
          stripe
          border
          size="medium"
          style="width: 100%"
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
            label="职称名称"
            width="200">
        </el-table-column>
        <el-table-column
            prop="titleLevel"
            label="职称级别"
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
        title="修改职称信息"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <div>
          <el-tag>职称名称</el-tag>
          <el-input style="width: 300px;margin-left: 6px;" size="medium" v-model="updateJobLevel.name"></el-input>
        </div>
        <div style="margin-top: 10px;">
          <el-tag>职称级别</el-tag>
          <el-select style="margin-left: 6px;" size="medium" v-model="updateJobLevel.titleLevel" placeholder="职称等级">
            <el-option
                v-for="level in titleLevels"
                :key="level.id"
                :label="level.name"
                :value="level.name">
            </el-option>
          </el-select>
        </div>
        <div style="margin-top: 10px;">
          <el-tag>是否启用</el-tag>
          <el-switch
              style="margin-left: 8px;"
              size="medium"
              v-model="updateJobLevel.enabled"
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
  name: "JobLevelMana",
  data() {
    return {
      jobLevel: {
        name: '',
        titleLevel: ''
      },
      updateJobLevel: {
        name: '',
        titleLevel: '',
        enabled: false
      },
      titleLevels: [
        {
          id: 0,
          name: '初级'
        },
        {
          id: 1,
          name: '中级'
        },
        {
          id: 2,
          name: '副高级'
        },
        {
          id: 3,
          name: '正高级'
        },
        {
          id: 4,
          name: '员级'
        }
      ],
      dialogVisible: false,
      multipleSelection: [],
      jobLevels: []
    }
  },
  mounted() {
    this.initJobLevels();
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
        this.deleteRequest('/system/basic/jobLevel/', this.multipleSelection).then(resp => {
          if (resp) {
            this.initJobLevels();
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
      this.putRequest('/system/basic/jobLevel/', this.updateJobLevel).then(resp => {
        if (resp) {
          this.initJobLevels();
          this.updateJobLevel.name = '';
          this.updateJobLevel.titleLevel = '';
          this.dialogVisible = false;
        }
      })
    },
    showEditView(index, data) {
      Object.assign(this.updateJobLevel, data);
      this.dialogVisible = true;
    },
    handleDelete(index, data) {
      this.$confirm('此操作将永久删除【' + data.name + '】职称, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/jobLevel/' + data.id).then(resp => {
          if (resp) {
            this.initJobLevels();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    addJobLevel() {
      if (this.jobLevel.name && this.jobLevel.titleLevel) {
        this.postRequest('/system/basic/jobLevel/', this.jobLevel).then(resp => {
          this.initJobLevels();
          this.jobLevel.name = '';
          this.jobLevel.titleLevel = '';
        })
      } else {
        this.$message.error('请正确输入职称名称或职称级别！');
      }
    },
    initJobLevels() {
      this.getRequest('/system/basic/jobLevel/').then(resp => {
        if (resp) {
          this.jobLevels = resp;
        }
      })
    }
  }
}
</script>

<style>

.jobLevelManaMain {
  width: 1150px;
  margin-top: 10px;
}

.addJobLevelManaInput {
  width: 300px;
  margin-right: 6px;
}

.addJobLevelManaSelect {
  width: 200px;
  margin-right: 6px;
}

</style>