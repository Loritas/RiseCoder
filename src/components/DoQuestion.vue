<template>
	<div v-if="(checkReady &&!isBack) || init()" >
		<el-card class="box-card" v-if="checkReady">
		    <template #header>
		      <div class="card-header">
		        <span>
					<n-h1 style="font-size: 36px;">
						{{questionData.title}}
					</n-h1>
				</span>
				<span style="box-align: end;">
					<el-tag
					  v-for="tag in questionData.tags"
					  :key="tag"
					  class="mx-1"
					  effect="light"
					  size="small"
					  round
					>
						{{ tag }}
					</el-tag>
				</span>
		      </div>
		    </template>
			<div style="text-align: left;">
				<span>
					<el-tag
						v-if="questionData.difficult == '简单'"
						size="large"
						type="success"
						effect="dark"
					>
						{{ questionData.difficult }}
					</el-tag>
					<el-tag
						v-if="questionData.difficult == '中等'"
						size="large"
						type="warning"
						effect="dark"
					>
						{{ questionData.difficult }}
					</el-tag>
					<el-tag
						v-if="questionData.difficult == '困难'"
						size="large"
						type="danger"
						effect="dark"
					>
						{{ questionData.difficult }}
					</el-tag>
				</span>
			</div>
		    <n-p style="text-align: left;font-size: 24px;">
		    	{{questionData.context}}
		    </n-p>
			  <n-gradient-text
				@click="eggs"
			    :gradient="{
			      deg: 180,
			      from: 'rgb(198,226,255)',
			      to: 'rgb(64,158,255)'
			    }"
			  >
			    Rise Coder
			  </n-gradient-text>
		</el-card>
		<el-card style="margin-top: 2%;">
		    <div style="text-align: left; ">
				<n-p>输入答案</n-p>
				<span>
					<n-input
						v-model:value="value"
						size="large"
						style="margin-bottom: 2%;"
						placeholder="请输入答案,多个答案使用';'分割～" 
						show-count 
						clearable
					/>
				</span>
			</div>
			<div style="text-align: end;">
				<n-button
					size="large"
					strong
					secondary 
					type="info"
					@click="commit"
				>
					提交
				</n-button>
			</div>
		</el-card>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import qs from 'qs'
import axios from 'axios'
import { useUserInfo } from '../utils/userInfo.js'
import { toPage } from '../utils/toPage.js'
import { ElMessageBox, ElMessage } from 'element-plus'

var {
	userInfo,
	changeInfo,
	clear,
	loginInfo
} = useUserInfo()

var store = useStore()
var already = ref(false)
var value = ref(null)

const checkReady = computed(() => {
	return already && store.state.questionStore.question != null
})

const isBack = computed(() => {
	return store.state.questionStore.back
})

var questionData = computed(() => {
	return store.state.questionStore.question
})

const eggs = () => {
	ElMessage({
	    message: '嘿，这个小彩蛋居然给你发现啦',
	    type: 'success',
		// icon: 'Trophy'
	  })
}

function commit() {
	const data = {
		answers: value.value
	}
	const options = {
		method: 'POST',
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			'Token': userInfo.value.token
		},
		data: qs.stringify(data),
		params: {
			questionId: store.state.questionStore.questionId
		},
		url: 'api/question/commit'
	};
	axios(options)
		.then((response) => {
			let res = response.data.data
			if (res.status == 403) {
				ElMessageBox.alert('登录信息已经过期，请重新登录！', '提示', {
					confirmButtonText: '哦不',
					callback: (() => {
						clear();
						toPage('/login')
					}),
				})
			}
			if (res.state == 1) {
				ElMessageBox.alert('答案有错误哦，检查一下吧～', '提示', {
					confirmButtonText: '好吧',
					callback: (() => {
						
					}),
				})
			}
			else if (res.state == 0) {
				ElMessageBox.alert('恭喜，提交通过了，答案正确！', '恭喜🎉', {
					confirmButtonText: '如我所料✌️',
					callback: (() => {
						
					}),
				})
			}
		})
		.catch(function(error) {
			console.log(error)
		})
		.then(function() {
	
		})
	return true;
}

function init() {
	const options = {
		method: 'GET',
		headers: {
			'Token': userInfo.value.token
		},
		params: {
			questionId: store.state.questionStore.questionId
		},
		url: 'api/question/get'
	};
	axios(options)
		.then((response) => {
			let question = response.data.data.question
			if (question.difficult == 0) {
				question.difficult = '简单'
			}
			else if (question.difficult == 1) {
				question.difficult = '中等'
			}
			else if (question.difficult == 2) {
				question.difficult = '困难'
			}
			question.tags = question.tags.split(";")
			store.commit('questionStore/setQuestion', question)
			store.commit('questionStore/isBack')
			already = true
		})
		.catch(function(error) {
			console.log(error)
		})
		.then(function() {
	
		})
	return true;
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>