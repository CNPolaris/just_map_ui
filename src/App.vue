<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="main">
    <el-container>
      <el-header class="header">
          海韵湖智能船实验监控平台
      </el-header>
      <el-main class="content">
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.main {
  width: 100%;
  flex: 1;
  overflow-x: hidden;
}
.header {
  text-align: center;
  font-family: 宋体,serif;
  font-size: 30px;
  background-color: #a6a6ff;
  /*height: 50px;*/
  position:fixed; width:100%;
  height:auto;
  /*background:#ffc;*/
  overflow-y:auto;
  min-height: 30px;
  /* line-height: 60px; */
}
.content {
  text-align: center;
  margin-top: 35px;
}
.footer {
  text-align: center;
}
</style>
