<template>
	<el-popconfirm v-if="state" confirm-button-text="我意已决" cancel-button-text="容我三思" :icon="InfoFilled"
		icon-color="#fe0000" title="你确定要退出登录吗？" @confirm="confirmEvent" @cancel="cancelEvent">
		<template #reference>
			<n-button quaternary size="large">Log Out</n-button>
		</template>
	</el-popconfirm>
	<n-button v-else quaternary size="large" @click="logIn">Log In</n-button>
</template>

<script setup>
	import {
		computed
	} from "vue"
	import {
		InfoFilled
	} from '@element-plus/icons-vue'
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

	const confirmEvent = () => {
		clear()
		toPage('/')
	}
	const cancelEvent = () => {

	}

	const state = computed(() => {
		return userInfo.value.hasLogin
	})

	function logIn() {
		toPage('/login')
	}
</script>

<style>
</style>
