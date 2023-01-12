<template>
	<n-result v-if="!state" status="404" title="嘿,等等,你是不是忘记登录了？" description="想要蒙混过关的可不是好孩子哦">
		<template #footer>
			<n-button @click="autoGo">行吧，让我去登录账号</n-button>
		</template>
	</n-result>
	<div v-else class="common-layout">
		<el-container>
			<el-header>
				<MenuBar></MenuBar>
			</el-header>
			<el-main>
				<div style="margin-left: 20%; margin-right: 20%;">
					<el-card class="box-card">
					    <template #header>
					      <div class="card-header">
					        <span>个人资料</span>
					      </div>
					    </template>
						<n-space v-bind="userInfo">
							<n-layout has-sider>
							      <n-layout-sider content-style="padding: 5px;">
							        <div class="pic"/>
							      </n-layout-sider>
							      <n-layout>
							        <n-layout-header style="font-size: 16px;">{{userInfo.username}}</n-layout-header>
							        <n-layout-content content-style="padding: 12px;">
							          <el-tag v-if="userInfo.role == 0">普通用户</el-tag>
									  <el-tag v-if="userInfo.role == 1" type="success">管理员</el-tag>
									  <n-statistic label="已通过题目数" style="margin-top: 4%">
									          {{userInfo.completedCount}}
									        </n-statistic>
							        </n-layout-content>
							        <n-layout-footer>
										注册日期：{{userInfo.time}}
										<!-- <n-time :time="userInfo.time"/> -->
									</n-layout-footer>
							      </n-layout>
							    </n-layout>
						</n-space>
					  </el-card>
				</div>
				<n-message-provider>
					<Calendar style="margin-left: 20%; margin-right: 20%;"></Calendar>
				</n-message-provider>
			</el-main>
			<el-footer>
				<Footer></Footer>
			</el-footer>
		</el-container>
	</div>
</template>

<script setup>
	import {
		computed
	} from 'vue'
	import MenuBar from "../components/MenuBar.vue"
	import Login from "./LogIn.vue"
	import {
		useUserInfo
	} from '../utils/userInfo.js'
	import {
		toPage
	} from '../utils/toPage.js'
	import Calendar from '../components/Calendar.vue'
	import Footer from '../components/Footer.vue'
	import qs from 'qs'
	import axios from 'axios'
	
	let {
		userInfo,
		changeInfo,
		clear,
		loginInfo
	} = useUserInfo()

	let state = computed(() => {
		return userInfo.value.hasLogin
	})

	const autoGo = () => {
		toPage('/login')
	}
	
</script>

<style scoped>
	.pic {
		background-image: url("/src/assets/avater.jpeg");
		width: 150px; 
		height: 150px;
		background-size: cover;
	}
	
	.box-card {
		margin-bottom: 5%;
	}
</style>
