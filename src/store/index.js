import {
	createStore
} from 'vuex'

const userStore = {
	namespaced: true,
	state() {
		return {
			hasLogin: false,
			token: "",
			userId: 0,
			role: -1, // -1未登录，0普通用户，1管理员
		}
	},
	mutations: {
		updateState(state, nHasLogin, nToken, nUserId, nRole) {
			state.hasLogin = nHasLogin
			state.token = nToken
			state.userId = nUserId
			state.role = nRole
		},
	}
}

const questionPageStore = {
	namespaced: true,
	state() {
		return {
			curPage: 0,
		}
	},
	mutations: {
		changePage(state, page) {
			state.curPage = page
		}
	}
}

const questionInfoStore = {
	namespaced: true,
	state() {
		return {
			questionList: [],
			curPage: 1,
			type: 0,
			pageNum: 0,
		}
	},
	mutations: {
		getList(state, list) {
			state.questionList = list
		},
		setPage(state, page) {
			state.curPage = page
		},
		setType(state, type) {
			state.type = type
		},
		setPageNum(state, pageNum) {
			state.pageNum = pageNum
		}
	}
}

const questionStore = {
	namespaced: true,
	state() {
		return {
			questionId: 0,
			question: null,
			back: false
		}
	},
	mutations: {
		setId(state, id) {
			state.questionId = id
		},
		setQuestion(state, question) {
			state.question = question
		},
		isBack(state) {
			state.back = !state.back
		}
	}
}

const bookPageStore = {
	namespaced: true,
	state() {
		return {
			curPage: 0,
		}
	},
	mutations: {
		changePage(state, page) {
			state.curPage = page
		}
	}
}

const bookInfoStore = {
	namespaced: true,
	state() {
		return {
			bookList: [],
			curPage: 1,
			pageNum: 0,
		}
	},
	mutations: {
		getList(state, list) {
			state.bookList = list
		},
		setPage(state, page) {
			state.curPage = page
		},
		setPageNum(state, pageNum) {
			state.pageNum = pageNum
		}
	}
}

const store = createStore({
	modules: {
		userStore: userStore,
		questionPageStore: questionPageStore,
		questionInfoStore: questionInfoStore,
		questionStore: questionStore,
		bookPageStore: bookPageStore,
		bookInfoStore: bookInfoStore,
	}
})

export default store
