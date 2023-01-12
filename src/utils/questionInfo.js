import {
	ref,
	// watchEffect,
	computed
} from 'vue'

export function useQuestionInfo() {
	// 0: 选择题 1: 填空题 2: 上传题目
	let ori = JSON.stringify({
		curQuestionPage: 0,
	})
	let curQuestionPage = ref(JSON.parse(localStorage.getItem('curQuestionPage') || ori))

	// watchEffect(() => {
	// 	localStorage.setItem('curQuestionPage', JSON.stringify(curQuestionPage.value))
	// })

	function changePage(curPage) {
		curQuestionPage.value = {
			curQuestionPage: curPage,
		}
	}

	function questionPageClear() {
		curQuestionPage.value = {
			curQuestionPage: 0,
		}
	}

	let questionPageInfo = computed(() => {
		return curQuestionPage.value.curQuestionPage
	})

	return {
		curQuestionPage,
		changePage,
		questionPageClear,
		questionPageInfo,
	}
}
