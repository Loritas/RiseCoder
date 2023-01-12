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
							<n-button quaternary @click="toPage('/signup')">注册账号</n-button>
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
								<h1 style="font-size: 27px; margin-bottom: -2%;">登录系统～</h1>
							</el-row>
							<el-row justify="center">
								<el-col>
									<div style="margin: 20px; justify-content: center;">
										<el-form :label-position="top" label-width="100px" :model="formLabelAlign"
											style="max-width: 460px">
											<el-form-item label="用户名">
												<el-input v-model="formLabelAlign.username" />
												<span v-if="!nameEntered" style="color: red;">别忘了输入用户名呀</span>
											</el-form-item>
											<el-form-item label="密码">
												<el-input v-model="formLabelAlign.password" type="password" />
												<span v-if="!passwordEntered" style="color: red;">要输入你的密码哦</span>
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
		ElMessage,
		ElMessageBox
	} from 'element-plus'
	import {
		BrandTelegram
	} from '@vicons/tabler'
	import {
		useStore
	} from 'vuex'
	import router from '../router/index.js'
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
	var store = useStore()

	let formLabelAlign = reactive({
		username: '',
		password: '',
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
		if (formLabelAlign.username == '') {
			this.nameEntered = false
			preReturn = true
		}
		if (formLabelAlign.password == '') {
			this.passwordEntered = false
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
			url: 'api/user/login'
		};
		// axios.post('api/user/login', {
		// 	username: formLabelAlign.username,
		// 	password: formLabelAlign.password
		// })
		axios(options)
			.then((response) => {
				let userData = response.data.data
				if (userData.status == 1) {
					ElMessageBox.alert('一个账号24小时内最多登录三次哦', '登录失败', {
						confirmButtonText: '哦不',
						callback: (() => {
							toPage('/signup')
						}),
					})
				}
				if (Object.getOwnPropertyNames(userData) == 0) {
					ElMessageBox.alert('你的用户名或者密码有点问题欸，不能登录喔', '提示', {
						confirmButtonText: '让我们再来一次！',
						callback: (() => {

						}),
					})
				} else {
					let role = userData.role == 1 ? '管理员' : ''
					store.commit('userStore/updateState', true, userData.token, userData.userId, userData.role)
					changeInfo(true, userData.token, userData.userId, userData.role, formLabelAlign.username,userData.completedCount, userData.createTime)
					ElMessageBox.alert('登录成功! 欢迎回来, ' + role + '  ' + formLabelAlign.username, '欢迎！', {
						confirmButtonText: '哦耶✌️',
						callback: (() => {
							toPage('/profile')
						}),
					})
				}
			})
			.catch(function(error) {
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
		background-image: url("/src/assets/loginBackground.jpeg");
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
