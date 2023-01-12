<template>
	<div v-if="!ready">
		<n-p>点击对应题目标题即可开始做题～</n-p>
		<el-table v-if="init" :data="tableData" style="width: 100%">
			<el-table-column prop="questionId" label="序号"></el-table-column>
			<el-table-column prop="title" label="标题" >
				<template #default="scope">
					<n-text 
						strong
						@click="handleClickQuestion(scope.row.questionId)"> {{scope.row.title}}
					</n-text>
				</template>
			</el-table-column>
		  <el-table-column prop="tags" label="标签" >
				<template #default="scope">
				    <el-tag
				        disable-transitions
						v-for="tag in scope.row.tags"
				    >
						{{ tag }}
					</el-tag>
				</template>
			</el-table-column>
		  <el-table-column prop="difficult" label="难度">
				<template #default="scope">
					<el-tag
						v-if="scope.row.difficult == '简单'"
						type="success"
					    disable-transitions
						effect="dark"
					>
						{{ scope.row.difficult }}
					</el-tag>
					<el-tag
						v-if="scope.row.difficult == '中等'"
						type="warning"
					    disable-transitions
						effect="dark"
					>
						{{ scope.row.difficult }}
					</el-tag>
				    <el-tag
						v-if="scope.row.difficult == '困难'"
						type="danger"
				        disable-transitions
						effect="dark"
				    >
						{{ scope.row.difficult }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="acTimes" label="通过次数" />
			<el-table-column prop="updateTime" label="更新时间">
				<template #default="scope">
					<n-time :time="scope.row.updateTime" type="date" />
				</template>
			</el-table-column>
		</el-table>
		
		<el-pagination
		    :page-size="20"
		    :pager-count="7"
			  background
			  v-model:current-page="curPage"
			  :total="pages"
		    layout="prev, pager, next"
			  :hide-on-single-page="false"
			  @current-change="changeList"
		  />
	</div>
	<div style="text-align: left;" v-if="ready" :key="backButton">
		<n-button quaternary type="info" size="large" @click="back()">
			<el-icon><ArrowLeftBold /></el-icon>
			返回上一页
		</n-button>
		<span></span>
		
	</div>
	<div v-if="ready" :key="doQuestion" style="margin-top: 3%">
		<DoQuestion></DoQuestion>
	</div>
	
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import qs from 'qs'
import axios from 'axios'
import DoQuestion from './DoQuestion.vue'
import {
	ArrowLeftBold
} from '@element-plus/icons-vue'

var store = useStore()
const states = ref(false)

const ready = computed(() => {
	return states.value
})

const returns = computed(() => {
	return states == true
})

const tableData = computed(() => {
	return store.state.questionInfoStore.questionList
})

const pages = computed(() => {
	return 20 * store.state.questionInfoStore.pageNum
})

var curPage = ref(1)

const state = computed(() => {
	return store.state.questionPageStore.curPage
})

function handleClickQuestion(questionId) {
	store.commit('questionStore/setId', questionId)
	states.value = true
}

function back() {
	states.value = false;
	store.commit('questionStore/setQuestion', null)
	store.commit('questionStore/isBack')
}

function changeList (page) {
	let type = 0;
	if (store.state.questionPageStore.curPage == 1) {
		type = 1;
	}

	const options = {
		method: 'GET',
		params: {
			curPage: page,
			questionType: type
		},
		url: 'api/question/getPage'
	};
	axios(options)
		.then((response) => {
			let lists = response.data.data
			for (var i = 0; i < lists.questions.length; i++) {
				if (lists.questions[i].difficult == 0) {
					lists.questions[i].difficult = '简单';
				}
				else if (lists.questions[i].difficult === 1) {
					lists.questions[i].difficult = '中等';
				}
				else if (lists.questions[i].difficult === 2) {
					lists.questions[i].difficult = '困难';
				}
				lists.questions[i].tags = lists.questions[i].tags.split(";")
			}
			store.commit('questionInfoStore/getList', lists.questions)
			store.commit('questionInfoStore/setPage', page)
			store.commit('questionInfoStore/setType', type)
		})
		.catch(function(error) {
			console.log(error)
		})
		.then(function() {
	
		})
	return true
}

const init = computed(() => {
	let type = 0;
	if (store.state.questionPageStore.curPage == 1) {
		type = 1;
	}
	
	const data = {
		questionType: type
	}
	
	const options = {
		method: 'GET',
		params: {
			questionType: type
		},
		url: 'api/question/list'
	};
	axios(options)
		.then((response) => {
			let lists = response.data.data
			for (var i = 0; i < lists.questions.length; i++) {
				if (lists.questions[i].difficult == 0) {
					lists.questions[i].difficult = '简单';
				}
				else if (lists.questions[i].difficult === 1) {
					lists.questions[i].difficult = '中等';
				}
				else if (lists.questions[i].difficult === 2) {
					lists.questions[i].difficult = '困难';
				}
				lists.questions[i].tags = lists.questions[i].tags.split(";")
			}
			store.commit('questionInfoStore/getList', lists.questions)
			store.commit('questionInfoStore/setPage', 1)
			store.commit('questionInfoStore/setType', type)
			store.commit('questionInfoStore/setPageNum', lists.pageNum)
		})
		.catch(function(error) {
			console.log(error)
		})
		.then(function() {
	
		})
	return true
})
</script>


<style>
</style>