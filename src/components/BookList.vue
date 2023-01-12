<template>
  <el-table v-if="init" :data="tableData" style="width: 100%">
    <el-table-column prop="bookName" label="书籍名称"/>
	<el-table-column prop="author" label="作者"/>
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
	<el-table-column prop="downloadTimes" label="下载次数" />
	<el-table-column label="下载">
		<template #default="scope">
			<el-button @click="downloadBooks(scope.row.bookId, scope.row.title)" style="color:  #79bbff;">
				下载<el-icon><Download /></el-icon>
			</el-button>
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
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import qs from 'qs'
import axios from 'axios'
import { toPage } from '../utils/toPage.js'
import { useUserInfo } from '../utils/userInfo.js'
import { ElMessageBox } from 'element-plus'
import {
	Download
} from '@element-plus/icons-vue'

var store = useStore()

var {
	userInfo,
	changeInfo,
	clear,
	loginInfo
} = useUserInfo()

var curPage = ref(1)

function changeList (page) {
	const options = {
		method: 'GET',
		url: 'api/book/list',
		params: {
			curPage: page
		}
	};
	axios(options)
		.then((response) => {
			let lists = response.data.data
			for (var i = 0; i < lists.books.length; i++) {
				lists.books[i].tags = lists.books[i].tags.split(";")
			}
			store.commit('bookInfoStore/getList', lists.books)
			store.commit('bookInfoStore/setPage', page)
		})
		.catch(function(error) {
			console.log(error)
		})
		.then(function() {
	
		})
}

const tableData = computed(() => {
	return store.state.bookInfoStore.bookList
})

const pages = computed(() => {
	return 20 * store.state.bookInfoStore.pageNum
})

const state = computed(() => {
	return store.state.bookPageStore.curPage
})

const downloadBooks = (bookId, title) => {
	const data = {
		bookId: bookId
	}
	
	const options = {
		method: 'POST',
		headers: {
		    // 'Content-type': 'application/json;charset:utf-8;',
		    'Token': userInfo.value.token
		},
		data: qs.stringify(data),
		url: 'api/book/download',
		responseType: 'blob'
	};
	
	axios(options)
		.then((res) => {
			if (res.status == 403) {
				ElMessageBox.alert('登录信息已经过期，请重新登录！', '提示', {
					confirmButtonText: '哦不',
					callback: (() => {
						clear();
						toPage('/login')
					}),
				})
			}
			else if (res.status == 204) {
				ElMessageBox.alert('一个账号24小时内只允许下载十本书哦', '提示', {
					confirmButtonText: '贪多嚼不烂',
					callback: (() => {
						
					}),
				})
			}
			else {
				const { data, headers } = res
				const fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, ' ')
				// 此处当返回json文件时需要先对data进行JSON.stringify处理，其他类型文件不用做处理
				//const blob = new Blob([JSON.stringify(data)], ...)
				const blob = new Blob([data], {type: headers['content-type']})
				let dom = document.createElement('a')
				let url = window.URL.createObjectURL(blob)
				dom.href = url
				dom.download = decodeURI(headers['filename'])
				dom.style.display = 'none'
				document.body.appendChild(dom)
				dom.click()
				dom.parentNode.removeChild(dom)
				window.URL.revokeObjectURL(url)
			}
		})
		.catch(function(error) {
			console.log(error)
		})
		.then(function() {
			
		})
}

const init = computed(() => {
	const options = {
		method: 'GET',
		url: 'api/book/list'
	};
	axios(options)
		.then((response) => {
			let lists = response.data.data
			for (var i = 0; i < lists.books.length; i++) {
				lists.books[i].tags = lists.books[i].tags.split(";")
			}
			store.commit('bookInfoStore/getList', lists.books)
			store.commit('bookInfoStore/setPage', 1)
			store.commit('bookInfoStore/setPageNum', lists.pageNum)
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