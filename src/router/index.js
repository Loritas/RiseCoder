import {
	createRouter,
	createWebHashHistory
} from "vue-router"

import Home from '../page/HomePage.vue'
import Profile from '../page/UserProfile.vue'
import Login from '../page/LogIn.vue'
import Signup from '../page/UserSignUp.vue'
import Questions from '../page/QuestionCollection.vue'
import Book from '../page/BookStore.vue'

const routes = [{
		path: '/',
		name: '首页',
		component: Home
	},
	{
		path: '/profile',
		name: '个人中心',
		component: Profile
	},
	{
		path: '/login',
		name: '登录',
		component: Login
	},
	{
		path: '/signup',
		name: '注册',
		component: Signup
	},
	{
		path: '/questions',
		name: '题库',
		component: Questions
	},
	{
		path: '/books',
		name: '资料库',
		component: Book
	},
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

export default router
