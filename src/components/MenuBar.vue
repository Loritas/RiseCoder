<template>
	<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
		@select="handleSelect">
		<el-menu-item index="/" @click="goto('/')">刷客</el-menu-item>
		<el-menu-item v-if="state" index="/profile" @click="goto('/profile')">个人中心</el-menu-item>
		<el-menu-item v-if="state" index="/questions" @click="goto('/questions')">题库</el-menu-item>
<!-- 		<el-sub-menu v-if="state" index="/questions" @click="toPage('/questions')">
			<template #title>题库</template>
			<el-sub-menu index="2-1">
				<template #title>做题</template>
				<el-menu-item index="2-1-1">编程题</el-menu-item>
				<el-menu-item index="2-1-2">选择题</el-menu-item>
				<el-menu-item index="2-1-3">填空题</el-menu-item>
			</el-sub-menu>
			<el-menu-item index="2-2">上传题目</el-menu-item>
		</el-sub-menu> -->
		<el-menu-item v-if="state" index="/books" @click="goto('/books')">资料库</el-menu-item>
<!-- 		<el-sub-menu v-if="state" index="3">
			<template #title>资料库</template>
			<el-menu-item index="3-1">资料下载</el-menu-item>
			<el-menu-item index="3-2">上传资料</el-menu-item>
		</el-sub-menu> -->
		<div class="flex-grow" />
		<!-- <el-button size="large">Log out</el-button> -->
		<Logout />
	</el-menu>
</template>
<script setup>
	import {
		ref,
		computed
	} from 'vue'
	import Logout from './LogOut.vue'
	import {
		toPage
	} from '../utils/toPage.js'
	import {
		useUserInfo
	} from '../utils/userInfo.js'
	import { useStore } from 'vuex'

	let {
		userInfo,
		changeInfo,
		clear,
		loginInfo
	} = useUserInfo()

	const state = computed(() => {
		return userInfo.value.hasLogin
	})
	
	const stores = useStore()
	
	function goto(path) {
		stores.commit('bookPageStore/changePage', 0)
		stores.commit('questionPageStore/changePage', 0)
		stores.commit('questionStore/setQuestion', null)
		stores.commit('questionStore/isBack')
		toPage(path)
	}
	const activeIndex = ref('1')

</script>

<style>
	.flex-grow {
		flex-grow: 1;
	}
</style>
