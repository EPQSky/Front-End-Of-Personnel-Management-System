<template>
  <div>
    <div>
      <div style="display: flex;justify-content: space-between;">
        <div style="display: flex;justify-content: flex-start;width: 600px;">
          <el-input clearable style="margin-right: 10px;" prefix-icon="el-icon-search" size="medium"
                    placeholder="请通过员工名进行搜索员工" v-model="keyword" @keydown.enter.native="initEmployees"
                    :disabled="showAdvanceSearch"
                    @clear="initEmployees"></el-input>
          <el-button icon="el-icon-search" type="primary" size="medium" @click="initEmployees"
                     :disabled="showAdvanceSearch">搜索
          </el-button>
          <el-button style="margin-right: 10px;" type="primary" size="medium"
                     @click="showAdvanceSearch = !showAdvanceSearch">
            <i :class="showAdvanceSearch?'fa fa-angle-double-up':'fa fa-angle-double-down'" aria-hidden="true"></i>
            高级搜索
          </el-button>
        </div>
        <div style="display: flex;justify-content: flex-start;width: 500px;">
          <el-button icon="el-icon-upload2" type="success" size="medium">导入数据</el-button>
          <el-button icon="el-icon-download" type="success" size="medium">导出数据</el-button>
          <el-button icon="el-icon-plus" type="primary" size="medium" @click="showAddEmpView">添加员工</el-button>
        </div>
      </div>
      <transition name="fade">
        <div
            v-show="showAdvanceSearch"
            style="border: 1px solid #409EFF;border-radius: 5px;box-sizing: border-box;padding: 5px 0;margin: 10px 0;width: 1552px;">
          <el-row style="margin: 3px 3px;" size="medium" :gutter=6>
            <el-col :span="5">
              <el-tag style="margin: 1px 1px;">政治面貌:</el-tag>
              <el-select style="width: 180px;" size="medium" v-model="searchValue.politicId" placeholder="请选择政治面貌">
                <el-option
                    size="medium"
                    v-for="(politic, index) in politicsstatus"
                    :key="index"
                    :label="politic.name"
                    :value="politic.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-tag style="margin: 1px 1px;">民族:</el-tag>
              <el-select style="width: 150px;" size="medium" v-model="searchValue.nationId" placeholder="请选择民族">
                <el-option
                    size="medium"
                    v-for="(nation, index) in nations"
                    :key="index"
                    :label="nation.name"
                    :value="nation.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-tag style="margin: 1px 1px;">职位:</el-tag>
              <el-select style="width: 180px;" size="medium" v-model="searchValue.posId" placeholder="请选择职位">
                <el-option
                    size="medium"
                    v-for="(position, index) in positions"
                    :key="index"
                    :label="position.name"
                    :value="position.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-tag style="margin: 1px 1px;">职称:</el-tag>
              <el-select style="width: 180px;" size="medium" v-model="searchValue.jobLevelId" placeholder="请选择职称">
                <el-option
                    size="medium"
                    v-for="(jobLevel, index) in jobLevels"
                    :key="index"
                    :label="jobLevel.name"
                    :value="jobLevel.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-tag style="margin: 1px 1px;">聘用形式:</el-tag>
              <el-radio-group size="medium" v-model="searchValue.engageForm">
                <el-radio size="medium" label="劳动合同">劳动合同</el-radio>
                <el-radio size="medium" label="劳务合同">劳务合同</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row style="margin: 6px 3px 3px 3px;" size="medium" :gutter=6>
            <el-col :span="5">
              <el-tag style="margin: 1px 1px;">所属部门:</el-tag>
              <el-select style="width: 180px;" size="medium" v-model="searchValue.departmentId" placeholder="请选择所属部门">
                <el-option
                    size="medium"
                    v-for="(department, index) in departments"
                    :key="index"
                    :label="department.name"
                    :value="department.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="10">
              <el-tag style="margin: 1px 1px;">入职时间:</el-tag>
              <el-date-picker
                  size="medium"
                  unlink-panels
                  v-model="searchValue.dates"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
              </el-date-picker>
            </el-col>
            <el-col :span="3" :offset="6">
              <el-button size="small" @click="cancelSearch">清空</el-button>
              <el-button type="primary" icon="el-icon-search" size="small" @click="initEmployees('advanced')">高级搜索
              </el-button>
            </el-col>
          </el-row>
        </div>
      </transition>
    </div>
    <div style="width: 1552px;margin-top: 10px;">
      <el-table
          v-loading="loading"
          element-loading-text="正在加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :data="employees"
          size="medium"
          stripe
          border
          style="width: 100%">
        <el-table-column
            align="center"
            type="selection"
            width="40">
        </el-table-column>
        <el-table-column
            fixed
            align="left"
            prop="name"
            label="姓名"
            width="100">
        </el-table-column>
        <el-table-column
            align="left"
            prop="workID"
            label="工号"
            width="100">
        </el-table-column>
        <el-table-column
            align="center"
            prop="gender"
            label="性别"
            width="50">
        </el-table-column>
        <el-table-column
            align="left"
            prop="birthday"
            label="出生日期"
            width="100">
        </el-table-column>
        <el-table-column
            align="left"
            prop="idCard"
            label="身份证号码"
            width="170">
        </el-table-column>
        <el-table-column
            align="center"
            prop="wedlock"
            label="婚姻状况"
            width="80">
        </el-table-column>
        <el-table-column
            align="center"
            prop="nation.name"
            label="民族"
            width="50">
        </el-table-column>
        <el-table-column
            align="left"
            prop="nativePlace"
            label="籍贯"
            width="80">
        </el-table-column>
        <el-table-column
            align="center"
            prop="politicsstatus.name"
            label="政治面貌"
            width="120">
        </el-table-column>
        <el-table-column
            align="left"
            prop="email"
            label="电子邮件"
            width="170">
        </el-table-column>
        <el-table-column
            align="center"
            prop="phone"
            label="电话号码"
            width="120">
        </el-table-column>
        <el-table-column
            align="left"
            prop="address"
            label="联系地址"
            width="200">
        </el-table-column>
        <el-table-column
            align="left"
            prop="department.name"
            label="所属部门"
            width="80">
        </el-table-column>
        <el-table-column
            align="left"
            prop="position.name"
            label="职位"
            width="100">
        </el-table-column>
        <el-table-column
            align="left"
            prop="jobLevel.name"
            label="职称"
            width="100">
        </el-table-column>
        <el-table-column
            align="left"
            prop="engageForm"
            label="聘用形式"
            width="80">
        </el-table-column>
        <el-table-column
            align="left"
            prop="beginDate"
            label="入职日期"
            width="100">
        </el-table-column>
        <el-table-column
            align="left"
            prop="conversionTime"
            label="转正日期"
            width="100">
        </el-table-column>
        <el-table-column
            align="left"
            prop="beginContract"
            label="合同起始日期"
            width="110">
        </el-table-column>
        <el-table-column
            align="left"
            prop="endContract"
            label="合同截至日期"
            width="110">
        </el-table-column>
        <el-table-column
            align="center"
            label="合同期限"
            width="80">
          <template slot-scope="scope">
            {{ scope.row.contractTerm }}年
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="tiptopDegree"
            label="最高学历"
            width="80">
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="260">
          <template slot-scope="scope">
            <el-button size="small" @click="showEditEmpView(scope.row)">编辑</el-button>
            <el-button size="small" type="primary">查看高级资料</el-button>
            <el-button size="small" type="danger" @click="deleteEmp(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: flex-end;width: 100%;margin-top: 10px;">
        <el-pagination
            size="medium"
            background
            @size-change="sizeChange"
            @current-change="currentChange"
            layout="sizes, prev, pager, next, jumper, ->, total, slot"
            :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="72%">
      <div>
        <el-form size="medium"
                 :model="employee"
                 :rules="rules"
                 status-icon
                 ref="employee">
          <el-row style="margin-left: 6px;" size="medium" :gutter=20>
            <el-col :span="6">
              <el-form-item size="medium" label="姓名：" prop="name">
                <el-input prefix-icon="el-icon-edit" size="medium" type="name"
                          style="width: 200px;"
                          v-model="employee.name" autocomplete="off"
                          placeholder="请输入姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="medium" label="性别：" prop="gender">
                <el-radio-group size="medium" v-model="employee.gender">
                  <el-radio size="medium" label="男">男</el-radio>
                  <el-radio size="medium" label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="medium" label="出生日期：" prop="birthday">
                <el-date-picker size="medium" type="date" placeholder="出生日期"
                                v-model="employee.birthday" value-format="yyyy-MM-dd"
                                style="width: 200px;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="medium" label="政治面貌：" prop="politicId">
                <el-select style="width: 200px;" size="medium" v-model="employee.politicId" placeholder="请选择政治面貌">
                  <el-option
                      size="medium"
                      v-for="(politic, index) in politicsstatus"
                      :key="index"
                      :label="politic.name"
                      :value="politic.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-left: 6px;" size="medium" :gutter=20>
            <el-col :span="6">
              <el-form-item size="medium" label="民族：" prop="nationId">
                <el-select style="width: 200px;" size="medium" v-model="employee.nationId" placeholder="请选择民族">
                  <el-option
                      size="medium"
                      v-for="(nation, index) in nations"
                      :key="index"
                      :label="nation.name"
                      :value="nation.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="medium" label="籍贯：" prop="nativePlace">
                <el-input size="medium" type="nativePlace"
                          style="width: 200px;"
                          v-model="employee.nativePlace" autocomplete="off"
                          placeholder="请输入籍贯"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="medium" label="电子邮箱：" prop="email">
                <el-input size="medium" type="email"
                          style="width: 200px;"
                          v-model="employee.email" autocomplete="off"
                          placeholder="请输入电子邮箱地址"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="medium" label="联系地址：" prop="address">
                <el-input size="medium" type="address"
                          style="width: 200px;"
                          v-model="employee.address" autocomplete="off"
                          placeholder="请输入联系地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-left: 6px;" size="medium" :gutter=20>
            <el-col :span="6">
              <el-form-item size="medium" label="职位：" prop="posId">
                <el-select style="width: 200px;" size="medium" v-model="employee.posId" placeholder="请选择职位">
                  <el-option
                      size="medium"
                      v-for="(position, index) in positions"
                      :key="index"
                      :label="position.name"
                      :value="position.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="medium" label="职称：" prop="jobLevelId">
                <el-select style="width: 200px;" size="medium" v-model="employee.jobLevelId" placeholder="请选择职称">
                  <el-option
                      size="medium"
                      v-for="(jobLevel, index) in jobLevels"
                      :key="index"
                      :label="jobLevel.name"
                      :value="jobLevel.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="medium" label="所属部门：" prop="departmentId">
                <el-select style="width: 200px;" size="medium" v-model="employee.departmentId" placeholder="请选择所属部门">
                  <el-option
                      size="medium"
                      v-for="(department, index) in departments"
                      :key="index"
                      :label="department.name"
                      :value="department.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="medium" label="电话号码：" prop="phone">
                <el-input prefix-icon="el-icon-phone" size="medium" type="phone"
                          style="width: 200px;"
                          v-model="employee.phone" autocomplete="off"
                          placeholder="请输入电话号码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-left: 6px;" size="medium" :gutter=20>
            <el-col :span="6">
              <el-form-item size="medium" label="工号：" prop="workID">
                <el-input size="medium" type="workID"
                          style="width: 200px;" :disabled="true"
                          v-model="employee.workID" autocomplete="off"
                          placeholder="请输入工号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="medium" label="学历：" prop="tiptopDegree">
                <el-select style="width: 200px;" size="medium" v-model="employee.tiptopDegree" placeholder="请选择最高学历">
                  <el-option
                      size="medium"
                      v-for="(tiptopDegree, index) in tiptopDegrees"
                      :key="index"
                      :label="tiptopDegree.value"
                      :value="tiptopDegree.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="medium" label="毕业院校：" prop="school">
                <el-input prefix-icon="el-icon-edit" size="medium" type="school"
                          style="width: 200px;"
                          v-model="employee.school" autocomplete="off"
                          placeholder="请输入毕业院校"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="medium" label="专业名称：" prop="specialty">
                <el-input prefix-icon="el-icon-edit" size="medium" type="specialty"
                          style="width: 200px;"
                          v-model="employee.specialty" autocomplete="off"
                          placeholder="请输入专业名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-left: 6px;" size="medium" :gutter=20>
            <el-col :span="6">
              <el-form-item size="medium" label="入职日期：" prop="beginDate">
                <el-date-picker size="medium" type="date" placeholder="入职日期"
                                v-model="employee.beginDate" value-format="yyyy-MM-dd"
                                style="width: 200px;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="medium" label="转正日期：" prop="conversionTime">
                <el-date-picker size="medium" type="date" placeholder="转正日期"
                                v-model="employee.conversionTime" value-format="yyyy-MM-dd"
                                style="width: 200px;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="medium" label="合同起始日期：" prop="beginContract">
                <el-date-picker size="medium" type="date" placeholder="合同起始日期"
                                v-model="employee.beginContract" value-format="yyyy-MM-dd"
                                style="width: 200px;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="medium" label="合同终止日期：" prop="endContract">
                <el-date-picker size="medium" type="date" placeholder="合同终止日期"
                                v-model="employee.endContract" value-format="yyyy-MM-dd"
                                style="width: 200px;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-left: 6px;" size="medium" :gutter=20>
            <el-col :span="8">
              <el-form-item size="medium" label="身份证号码：" prop="idCard">
                <el-input prefix-icon="el-icon-edit" size="medium" type="idCard"
                          style="width: 300px;"
                          v-model="employee.idCard" autocomplete="off"
                          placeholder="请输入身份证号码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="medium" label="聘用形式：" prop="engageForm">
                <el-radio-group size="medium" v-model="employee.engageForm">
                  <el-radio size="medium" label="劳动合同">劳动合同</el-radio>
                  <el-radio size="medium" label="劳务合同">劳务合同</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="medium" label="婚姻状况：" prop="wedlock">
                <el-radio-group size="medium" v-model="employee.wedlock">
                  <el-radio size="medium" label="已婚">已婚</el-radio>
                  <el-radio size="medium" label="未婚">未婚</el-radio>
                  <el-radio size="medium" label="离异">离异</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button size="medium" @click="cancel">取 消</el-button>
    <el-button size="medium" type="primary" @click="doAddEmp">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "EmpBasic",
  data() {
    return {
      title: '',
      employees: [],
      loading: false,
      dialogVisible: false,
      showAdvanceSearch: false,
      total: 0,
      page: 1,
      size: 10,
      keyword: '',
      searchValue: {
        politicId: '',
        nationId: '',
        posId: '',
        jobLevelId: '',
        engageForm: '',
        departmentId: '',
        dates: ''
      },
      employee: {
        name: '',
        gender: '',
        birthday: '',
        idCard: '',
        wedlock: '',
        nationId: '',
        nativePlace: '',
        politicId: '',
        email: '',
        phone: '',
        address: '',
        departmentId: '',
        jobLevelId: '',
        posId: '',
        engageForm: '',
        tiptopDegree: '',
        specialty: '',
        school: '',
        beginDate: '',
        workState: '',
        workID: '',
        contractTerm: '',
        conversionTime: '',
        notWorkDate: '',
        beginContract: '',
        endContract: '',
        workAge: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入员工姓名',
            trigger: 'blur'
          }
        ],
        gender: [
          {
            required: true,
            message: '请选择性别',
            trigger: 'change'
          }
        ],
        birthday: [
          {
            required: true,
            message: '请选择出生日期',
            trigger: 'change'
          }
        ],
        idCard: [
          {
            required: true,
            message: '请输入身份证号码',
            trigger: 'blur'
          },
          {min: 18, max: 18, message: '请正确输入18位数字', trigger: 'blur'}
        ],
        wedlock: [
          {
            required: true,
            message: '请选择婚姻状况',
            trigger: 'change'
          }
        ],
        nationId: [
          {
            required: true,
            message: '请选择你的民族',
            trigger: 'change'
          }
        ],
        nativePlace: [
          {
            required: true,
            message: '请输入你的籍贯',
            trigger: 'blur'
          }
        ],
        politicId: [
          {
            required: true,
            message: '请选择政治面貌',
            trigger: 'change'
          }
        ],
        email: [
          {
            type: 'email',
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: '请输入电话号码',
            trigger: 'blur'
          }
        ],
        address: [
          {
            required: true,
            message: '请输入联系地址',
            trigger: 'blur'
          }
        ],
        departmentId: [
          {
            required: true,
            message: '请选择所在的部门',
            trigger: 'change'
          }
        ],
        jobLevelId: [
          {
            required: true,
            message: '请选择职称',
            trigger: 'change'
          }
        ],
        posId: [
          {
            required: true,
            message: '请选择职位',
            trigger: 'change'
          }
        ],
        engageForm: [
          {
            required: true,
            message: '请选择聘用形式',
            trigger: 'change'
          }
        ],
        tiptopDegree: [
          {
            required: true,
            message: '请选择最高学历',
            trigger: 'change'
          }
        ],
        specialty: [
          {
            required: true,
            message: '请输入专业名称',
            trigger: 'blur'
          }
        ],
        school: [
          {
            required: true,
            message: '请输入学校名称',
            trigger: 'blur'
          }
        ],
        beginDate: [
          {
            required: true,
            message: '请选择入职日期',
            trigger: 'change'
          }
        ],
        conversionTime: [
          {
            required: true,
            message: '请选择转正日期',
            trigger: 'change'
          }
        ],
        beginContract: [
          {
            required: true,
            message: '请选择合同起始日期',
            trigger: 'change'
          }
        ],
        endContract: [
          {
            required: true,
            message: '请选择合同截止日期',
            trigger: 'change'
          }
        ]
      },
      nations: [],
      politicsstatus: [],
      positions: [],
      jobLevels: [],
      departments: [],
      tiptopDegrees: [
        {value: '其他'},
        {value: '小学'},
        {value: '初中'},
        {value: '高中'},
        {value: '大专'},
        {value: '本科'},
        {value: '硕士'},
        {value: '博士'}
      ]
    }
  },
  mounted() {
    this.initEmployees()
    this.initClassesData()
  },
  methods: {
    showEditEmpView(data) {
      this.title = '编辑员工';
      this.employee = data;
      this.initClassesData();
      this.dialogVisible = true;
    },
    deleteEmp(data) {
      this.$confirm('此操作将永久删除【' + data.name + '】员工, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/emp/basic/empBasic/' + data.id).then(resp => {
          if (resp) {
            this.initEmployees();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    cancel() {
      this.dialogVisible = false;
      this.employee = {
        name: '',
        gender: '',
        birthday: '',
        idCard: '',
        wedlock: '',
        nationId: '',
        nativePlace: '',
        politicId: '',
        email: '',
        phone: '',
        address: '',
        departmentId: '',
        jobLevelId: '',
        posId: '',
        engageForm: '',
        tiptopDegree: '',
        specialty: '',
        school: '',
        beginDate: '',
        workState: '',
        workID: '',
        contractTerm: '',
        conversionTime: '',
        notWorkDate: '',
        beginContract: '',
        endContract: '',
        workAge: ''
      }
    },
    cancelSearch() {
      this.showAdvanceSearch = false;
      this.searchValue = {
        politicId: '',
        nationId: '',
        posId: '',
        jobLevelId: '',
        engageForm: '',
        departmentId: '',
        dates: ''
      };
      this.initEmployees();
    },
    doAddEmp() {
      this.$refs.employee.validate((valid) => {
        if (valid) {
          if (this.employee.id) {
            this.putRequest('/emp/basic/empBasic/', this.employee).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.employee = {
                  name: '',
                  gender: '',
                  birthday: '',
                  idCard: '',
                  wedlock: '',
                  nationId: '',
                  nativePlace: '',
                  politicId: '',
                  email: '',
                  phone: '',
                  address: '',
                  departmentId: '',
                  jobLevelId: '',
                  posId: '',
                  engageForm: '',
                  tiptopDegree: '',
                  specialty: '',
                  school: '',
                  beginDate: '',
                  workState: '',
                  workID: '',
                  contractTerm: '',
                  conversionTime: '',
                  notWorkDate: '',
                  beginContract: '',
                  endContract: '',
                  workAge: ''
                }
                this.initEmployees();
              }
            })
          } else {
            this.postRequest('/emp/basic/empBasic/', this.employee).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.employee = {
                  name: '',
                  gender: '',
                  birthday: '',
                  idCard: '',
                  wedlock: '',
                  nationId: '',
                  nativePlace: '',
                  politicId: '',
                  email: '',
                  phone: '',
                  address: '',
                  departmentId: '',
                  jobLevelId: '',
                  posId: '',
                  engageForm: '',
                  tiptopDegree: '',
                  specialty: '',
                  school: '',
                  beginDate: '',
                  workState: '',
                  workID: '',
                  contractTerm: '',
                  conversionTime: '',
                  notWorkDate: '',
                  beginContract: '',
                  endContract: '',
                  workAge: ''
                }
                this.initEmployees();
              }
            })
          }
        } else {
          return false;
        }
      });
    },
    getMaxWordID() {
      this.getRequest('/emp/basic/empBasic/maxWorkID').then(resp => {
        if (resp) {
          this.employee.workID = resp.obj;
        }
      })
    },
    initClassesData() {
      this.getRequest('/emp/basic/empBasic/nations').then(resp => {
        if (resp) {
          this.nations = resp;
        }
      })
      this.getRequest('/emp/basic/empBasic/politicsstatus').then(resp => {
        if (resp) {
          this.politicsstatus = resp;
        }
      })
      this.getRequest('/emp/basic/empBasic/positions').then(resp => {
        if (resp) {
          this.positions = resp;
        }
      })
      this.getRequest('/emp/basic/empBasic/jobLevels').then(resp => {
        if (resp) {
          this.jobLevels = resp;
        }
      })
      this.getRequest('/emp/basic/empBasic/departments').then(resp => {
        if (resp) {
          this.departments = resp;
        }
      })
    },
    showAddEmpView() {
      this.title = '添加员工';
      this.getMaxWordID();
      this.dialogVisible = true;
    },
    currentChange(currentPage) {
      this.page = currentPage;
      this.initEmployees();
    },
    sizeChange(currentSize) {
      this.size = currentSize;
      this.initEmployees();
    },
    initEmployees(type) {
      this.loading = true;
      let url = '/emp/basic/empBasic/?page=' + this.page + '&size=' + this.size
      if ((type && type === 'advanced') || this.searchValue.politicId || this.searchValue.nationId || this.searchValue.jobLevelId ||
          this.searchValue.posId || this.searchValue.engageForm || this.searchValue.departmentId || this.searchValue.dates) {
        url += '&politicId=' + this.searchValue.politicId + '&nationId=' + this.searchValue.nationId +
            '&jobLevelId=' + this.searchValue.jobLevelId + '&posId=' + this.searchValue.posId + '&engageForm=' + this.searchValue.engageForm +
            '&departmentId=' + this.searchValue.departmentId + '&dates=' + this.searchValue.dates;
      } else {
        url += '&name=' + this.keyword;
      }
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.employees = resp.data;
          this.total = resp.total;
        }
      })
    }
  }
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
  opacity: 0;
}
</style>