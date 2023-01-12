<template>
  <el-row class="tac">
    <el-col :span="20">
      <h5 class="mb-2">资料库</h5>
      <el-menu
        default-active="0"
        class="el-menu-vertical-demo"
      >
        <el-menu-item index="0" @click="changePage(0)">
          <el-icon><Reading /></el-icon>
          <span>下载书籍</span>
        </el-menu-item>
        <el-menu-item index="1" @click="changePage(1)">
          <el-icon><UploadFilled /></el-icon>
          <span>上传书籍</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  UploadFilled,
  Reading
}from '@element-plus/icons-vue'

import { useStore } from 'vuex'
	
var store = useStore()

function changePage(page) {
	store.commit('bookPageStore/changePage', page)
}
</script>

<style>
</style>