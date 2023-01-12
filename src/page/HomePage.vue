<template>
	<div class="common-layout">
		<el-container>
			<el-header>
				<MenuBar></MenuBar>
			</el-header>
			<el-main
				class="back"
			>
				<n-h1 
					class="title">
					刷  客
				</n-h1>
				<n-p
					style="color: rgb(234, 234, 234);font-size: 56px;"
				>
					在线练习系统
				</n-p>
				<n-button 
					v-if="!state"
					color="#409EFF"
					type="info"
					size="large"
					round
					@click="toPage('/login')"
				>
					前往登录
				</n-button>
			</el-main>
			<el-footer>
				<Footer></Footer>
			</el-footer>
		</el-container>
	</div>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import MenuBar from '../components/MenuBar.vue'
	import Footer from '../components/Footer.vue'
	import {
		useUserInfo
	} from '../utils/userInfo.js'
	import {
		toPage
	} from '../utils/toPage.js'
	
	let {
		userInfo,
		changeInfo,
		clear,
		loginInfo
	} = useUserInfo()
	
	let state = computed(() => {
		return userInfo.value.hasLogin
	})
	
	
</script>

<style scoped>
	.back {
		background-image: url("/src/assets/homePageBackground.jpeg");
		height: 600px;
		background-size: cover;
		margin-bottom: 2%;
		margin-left: 2%;
		margin-right: 2%;
		border: 1px solid var(--el-border-color);
		border-radius: 0;
	}
	.title {
		margin-top: 7%;
		font-size: 136px;
		color: white;
		font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
		'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
	}
</style>
