<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="部门管理" name="depMana">
        <DepMana></DepMana>
      </el-tab-pane>
      <el-tab-pane label="职位管理" name="posMana">
        <PosMana></PosMana>
      </el-tab-pane>
      <el-tab-pane label="职称管理" name="jobLevelMana">
        <JobLevelMana></JobLevelMana>
      </el-tab-pane>
      <el-tab-pane label="奖惩规则" name="ecMana">
        <EcMana></EcMana>
      </el-tab-pane>
      <el-tab-pane label="权限组" name="perMissMana">
        <PerMissMana></PerMissMana>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DepMana from "@/components/sys/basic/DepMana";
import EcMana from "@/components/sys/basic/EcMana";
import JobLevelMana from "@/components/sys/basic/JobLevelMana";
import PerMissMana from "@/components/sys/basic/PerMissMana";
import PosMana from "@/components/sys/basic/PosMana";

export default {
  name: "SysBasic",
  data() {
    return {
      activeName: 'depMana'
    }
  },
  components: {
    DepMana,
    EcMana,
    JobLevelMana,
    PerMissMana,
    PosMana
  }
}
</script>

<style scoped>

</style>