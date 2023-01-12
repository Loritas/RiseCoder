<template>
	<n-result v-if="state" status="success" title="嘿,你已经登录啦!" description="换个浏览器也许能同时登录另一个账号哦？">
		<template #footer>
			<n-button @click="autoGo">该回到刷客首页啦</n-button>
		</template>
	</n-result>
	<div v-else class="common-layout">
		<el-container>
			<el-header height="45px">
				<n-page-header subtitle="在线练习系统">
					<template #title>
						<a href="/" style="text-decoration: none; color: inherit">RiseCoder</a>
					</template>
					<template #extra>
						<n-space>
							<n-button quaternary @click="toPage('/login')">现在就去登录！</n-button>
						</n-space>
					</template>
					<template #footer>
						<td class="line">
							<div></div>
						</td>
					</template>
				</n-page-header>
			</el-header>
			<el-main class="backImg">
				<el-row justify="center">
					<el-col :span="10">
						<div class="radius" :style="{
						borderRadius: `var(--el-border-radius-base)`,
						}">
							<el-row justify="center">
								<n-icon-wrapper :size="140" color="#00a5db" :border-radius="360"
									style="margin-top: 5%;">
									<n-icon :size="120" style="margin-right: 2%;">
										<brand-telegram />
									</n-icon>
								</n-icon-wrapper>
							</el-row>
							<el-row justify="center">
								<h1 style="font-size: 27px; margin-bottom: -2%;">注册账号～</h1>
							</el-row>
							<el-row justify="center">
								<el-col>
									<div style="margin: 20px; justify-content: center;">
										<el-form :label-position="top" label-width="100px" :model="formLabelAlign"
											style="max-width: 460px">
											<el-form-item label="用户名">
												<el-input v-model="formLabelAlign.username" />
												<span v-if="!nameEntered" style="color: red;">别忘了输入用户名</span>
											</el-form-item>
											<el-form-item label="密码">
												<el-input v-model="formLabelAlign.password" type="password" />
												<span v-if="!passwordEntered" style="color: red;">要输入你的密码哦</span>
											</el-form-item>
											<el-form-item label="确认密码">
												<el-input v-model="formLabelAlign.passwordRepeat" type="password" />
												<span v-if="!passwordRepeatEntered" style="color: red;">请再输入一遍密码哦</span>
												<span v-if="!passwordCorrect" style="color: red;">两次输入的密码好像不一样呢</span>
											</el-form-item>
										</el-form>
									</div>
								</el-col>
							</el-row>
							<el-row justify="center">
								<el-button type="primary" style="margin-bottom: 5%;" @click="userLogin(formLabelAlign)">
									确认登录
								</el-button>
							</el-row>
						</div>
					</el-col>
				</el-row>
			</el-main>
			<el-footer>
				<Footer></Footer>
			</el-footer>
		</el-container>
	</div>
</template>

<script setup>
	import {
		ref,
		reactive,
		computed
	} from 'vue'
	import {
		ElMessageBox
	} from 'element-plus'
	import {
		BrandTelegram
	} from '@vicons/tabler'
	import {
		useStore
	} from 'vuex'
	import axios from 'axios'
	import qs from 'qs'
	import {
		useUserInfo
	} from '../utils/userInfo.js'
	import {
		toPage
	} from '../utils/toPage.js'
	import Footer from '../components/Footer.vue'

	let nameEntered = ref(true)
	let passwordEntered = ref(true)
	let passwordRepeatEntered = ref(true)
	let passwordCorrect = ref(true)
	var store = useStore()

	let formLabelAlign = reactive({
		username: '',
		password: '',
		passwordRepeat: '',
	})

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
		toPage('/')
	}


	function userLogin(formLabelAlign) {
		let preReturn = false
		this.nameEntered = true
		this.passwordEntered = true
		this.passwordRepeatEntered = true
		this.passwordCorrect = true
		if (formLabelAlign.username == '') {
			this.nameEntered = false
			preReturn = true
		}
		if (formLabelAlign.password == '') {
			this.passwordEntered = false
			preReturn = true
		} else if (formLabelAlign.passwordRepeat == '') {
			this.passwordRepeatEntered = false
			preReturn = true
		} else if (formLabelAlign.password != formLabelAlign.passwordRepeat) {
			this.passwordCorrect = false
			preReturn = true
		}
		if (preReturn) {
			return
		}

		const data = {
			username: formLabelAlign.username,
			password: formLabelAlign.password
		}
		const options = {
			method: 'POST',
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: qs.stringify(data),
			url: 'api/user/signup'
		};

		axios(options)
			.then((response) => {
				let userData = response.data.data
				if (Object.getOwnPropertyNames(userData) == 0) {
					ElMessageBox.alert('用户名已经被注册了哦，换个名字吧？', '提示', {
						confirmButtonText: '真是可惜',
						callback: (() => {

						}),
					})
				} else {
					store.commit('userStore/updateState', true, userData.token, userData.userId, userData.role)
					changeInfo(true, userData.token, userData.userId, userData.role, formLabelAlign.username,userData.completedCount, userData.createTime)
					ElMessageBox.alert('注册成功! 欢迎来到刷客, ' + formLabelAlign.username + ', 希望你能过的快乐！', '欢迎！', {
						confirmButtonText: '让我们开始吧！🥳',
						callback: (() => {
							toPage('/profile')
						}),
					})
				}
			})
			.catch(function(error) {
				console.log(error)
				ElMessageBox.alert('好像出了一些问题哦，看看网络吧？', '提示', {
					confirmButtonText: '再试试！',
					callback: (() => {
				
					}),
				})
			})
			.then(function() {

			})
		this.nameEntered = true
		this.passwordEntered = true
	}
</script>

<style scoped>
	.radius {
		border: 1px solid var(--el-border-color);
		border-radius: 10;
		margin-top: 20px;
		background-color: white;
	}

	.backImg {
		background-image: url("/src/assets/signupBackground.jpg");
		/* 	margin-left: 2%;
	margin-right: 2%; */
		height: 600px;
		background-size: cover;
		border: 1px solid var(--el-border-color);
		border-radius: 0;
	}

	.line div {
		width: 100%;
		height: 2px;
		border-top: 2px solid var(--el-border-color);
	}
</style>
