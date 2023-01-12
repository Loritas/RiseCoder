<template>
  <el-row class="tac">
    <el-col :span="20">
      <h5 class="mb-2">题库</h5>
      <el-menu
        default-active="0"
        class="el-menu-vertical-demo"
      >
        <el-menu-item index="0" @click="changePage(0)">
          <el-icon><Aim /></el-icon>
          <span>选择题</span>
        </el-menu-item>
        <el-menu-item index="1" @click="changePage(1)">
          <el-icon><EditPen /></el-icon>
          <span>填空题</span>
        </el-menu-item>
        <el-menu-item index="2" @click="changePage(2)">
          <el-icon><document /></el-icon>
          <span>上传题目</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script setup>
import {
  Document,
  Menu as IconMenu,
  EditPen,
  Aim,
  Setting,
} from '@element-plus/icons-vue'

import { useStore } from 'vuex'
	
var store = useStore()

function changePage(page) {
	store.commit('questionStore/setQuestion', null)
	store.commit('questionStore/isBack')
	store.commit('questionPageStore/changePage', page)
}
</script>
