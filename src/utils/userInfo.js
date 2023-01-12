import {
	ref,
	watchEffect,
	computed
} from 'vue'

export function useUserInfo() {
	let ori = JSON.stringify({
		hasLogin: false,
		token: "",
		userId: 0,
		role: -1,
		username: "",
		completedCount: 0,
		time: 0
	})
	let userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || ori))

	watchEffect(() => {
		localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
	})

	function changeInfo(hasLogin, token, userId, role, name, count, time) {
		userInfo.value = {
			hasLogin: hasLogin,
			token: token,
			userId: userId,
			role: role,
			username: name,
			completedCount: count,
			time: time,
		}
	}

	function clear() {
		userInfo.value = {
			hasLogin: false,
			token: "",
			userId: 0,
			role: -1,
			username: "",
			completedCount: 0,
			time: 0,
		}
	}

	let loginInfo = computed(() => {
		return userInfo.value.hasLogin == true
	})

	return {
		userInfo,
		changeInfo,
		clear,
		loginInfo
	}
}
