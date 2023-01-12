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
				<BookBar></BookBar>
			</el-aside>
	        <el-container>
				<el-main>
					<n-message-provider>
						<BookList v-if="state == 0"></BookList>
						<UploadBook v-if="state == 1"></UploadBook>
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
	import {
		computed
	} from 'vue'
	import MenuBar from "../components/MenuBar.vue"
	import BookBar from "../components/BookBar.vue"
	import Login from "./LogIn.vue"
	import {
		useUserInfo
	} from '../utils/userInfo.js'
	import {
		toPage
	} from '../utils/toPage.js'
	import UploadBook from '../components/UploadBook.vue'
	import BookList from '../components/BookList.vue'
	import { useStore } from 'vuex'
	import Footer from '../components/Footer.vue'
	
	var store = useStore()
	
	let {
		userInfo,
		changeInfo,
		clear,
		loginInfo
	} = useUserInfo()

	let state = computed(() => {
		return store.state.bookPageStore.curPage
	})
	
	let loginState = computed(() => {
		return userInfo.value.hasLogin
	})

	const autoGo = () => {
		toPage('/login')
	}
</script>

<style>
</style>