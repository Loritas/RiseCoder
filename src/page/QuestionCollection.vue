<template>
	<n-result v-if="!loginState" status="404" title="嘿,等等,你是不是忘记登录了？" description="想要蒙混过关的可不是好孩子哦">
		<template #footer>
			<n-button @click="autoGo">行吧，让我去登录账号</n-button>
		</template>
	</n-result>
	<div v-else class="common-layout">
		<el-container>
			<el-header>
				<MenuBar></MenuBar>
			</el-header>
			<el-container>
				<el-aside width="200px">
					<QuestionBar></QuestionBar>
				</el-aside>
				<el-container>
					<el-main>
						<List v-if="state == 0"></List>
						<List v-if="state == 1"></List>
						<n-message-provider>
							<Upload v-if="state == 2"></Upload>
						</n-message-provider>
					</el-main>
					<el-footer>
						<Footer></Footer>
					</el-footer>
				</el-container>
			</el-container>
		</el-container>
	</div>
</template>

<script setup>
	import { computed } from 'vue'
	import MenuBar from '../components/MenuBar.vue'
	import Upload from '../components/UploadQuestion.vue'
	import QuestionBar from '../components/QuestionBar.vue'
	import List from '../components/QuestionList.vue'
	import { useStore } from 'vuex'
	import {
		useUserInfo
	} from '../utils/userInfo.js'
	import Footer from '../components/Footer.vue'

	var store = useStore()
	let {
		userInfo,
		changeInfo,
		clear,
		loginInfo
	} = useUserInfo()
	
	const state = computed(() => {
		return store.state.questionPageStore.curPage
	})
	
	let loginState = computed(() => {
		return userInfo.value.hasLogin
	})
</script>

<style>
</style>
