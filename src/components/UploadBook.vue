<template>
<n-spin :show="show">
  <n-form ref="formRef" :model="model" :rules="rules">
    <n-form-item path="title" label="书籍标题">
      <n-input 
		v-model:value="model.title" 
		@keydown.enter.prevent 
		show-count
		clearable
		style="text-align: left;"
		/>
    </n-form-item>
	<n-form-item path="author" label="书籍作者">
	  <n-input 
		v-model:value="model.author" 
		@keydown.enter.prevent 
		show-count
		clearable
		style="text-align: left;"
		/>
	</n-form-item>
	<n-form-item path="content" label="书籍介绍">
	  <n-input
	    round
		type="textarea"
		maxlength="500"
		show-count
		clearable
		style="text-align: left;"
		v-model:value="model.content"
		placeholder="在此输入书籍的介绍, 不能超过500字哦"
		/>
	</n-form-item>
    <n-form-item path="tags" label="书籍标签">
      <n-input
        v-model:value="model.tags"
        type="text"
        @keydown.enter.prevent
		show-count
		clearable
		style="text-align: left;"
		placeholder="输入书籍的标签,每个标签最长为15字,最多10个标签,多个标签使用';'作间隔"
      />
    </n-form-item>
	<n-from-item>
		  <n-upload
		    ref="upload"
			:model="model"
			accept=".pdf, .epub, .mobi"
		    action="https://localhost:11451/books/upload"
		    :default-upload="false"
			:data="{
				title: model.title,
				author: model.author,
				content: model.content,
				tags: model.tags
			}"
			max="1"
		    @change="handleChange"
			@before-upload="beforeUpload"
			:custom-request="customRequest"
		  >
		      <n-upload-dragger>
		        <div style="margin-bottom: 12px">
		          <n-icon size="48" :depth="3">
		            <archive-icon />
		          </n-icon>
		        </div>
		        <n-text style="font-size: 16px">
		          点击或者拖动文件到该区域来上传
		        </n-text>
		        <n-p depth="3" style="margin: 8px 0 0 0">
		          只允许上传pdf、mobi、epub文件，且大小不得超过100MB
		        </n-p>
		      </n-upload-dragger>
		    <!-- <n-button>选择文件</n-button> -->
		  </n-upload>
	</n-from-item>
    <n-row :gutter="[0, 24]">
      <n-col :span="24">
        <div style="display: flex; justify-content: flex-end">
          <n-button
            round
            type="primary"
			size="large"
            @click="handleValidateButtonClick"
			style="background-color: #00a5db; border-color: #00a5db;" 
          >
            提交
          </n-button>
        </div>
      </n-col>
    </n-row>
  </n-form>
  <template #description>
    文件上传中～～稍等一下下～～
  </template>
</n-spin>
</template>

<script>
import { defineComponent, ref } from "vue";
import {
  useMessage
} from "naive-ui";
import { ArchiveOutline as ArchiveIcon } from "@vicons/ionicons5";
import { useStore } from 'vuex'
import { useUserInfo } from '../utils/userInfo.js'
import { toPage } from '../utils/toPage.js'
import axios from 'axios'
import qs from 'qs'
import { ElMessageBox } from 'element-plus'

var store = useStore()

var {
	userInfo,
	changeInfo,
	clear,
	loginInfo
} = useUserInfo()


export default defineComponent({
  setup() {
    const formRef = ref(null);
    const rPasswordFormItemRef = ref(null);
    const message = useMessage();
	const fileListLengthRef = ref(0);
	const uploadRef = ref(null);
	let show = ref(false);
    const modelRef = ref({
      title: null,
	  author: null,
      content: null,
	  tags: null,
    });
	const {
		userInfo,
		changeInfo,
		clear,
		loginInfo
	} = useUserInfo();

    const rules = {
      title: [
        {
          required: true,
          validator(rule, value) {
            if (!value) {
              return new Error("要填写上传的书籍的名字哦");
            } 
            return true;
          },
          trigger: ["input", "blur"]
        }
      ],
	  author: [
	    {
	      required: true,
	      validator(rule, value) {
	        if (!value) {
	          return new Error("要填写作者的名字哦");
	        } 
	        return true;
	      },
	      trigger: ["input", "blur"]
	    }
	  ],
      content: [
      		{
      			required: true,
      			validator(rule, value) {
      			  if (!value) {
      			    return new Error("要介绍一下这本书哦");
      			  } 
      			  return true;
      			},
      			trigger: ["input", "blur"]
      		}
      ],
	  tags: [
	    {
	      required: false,
	  		  validator(rule, value) {
	  			if (!value) {
	  				// return new Error("给它起个标签吧");
	  				return true;
	  			}
	  			let tags = value.split(";")
	  		    if (tags.length > 10) {
	  		      return new Error("标签数量太多了哦");
	  		    } 
	  			
	  			let flag = false;
	  			tags.forEach((tag) => {
	  				if (tag.length > 15) {
	  					flag = true;
	  				}
	  			})	    
	  			if (flag) {
	  				return new Error("有标签超过15个字了哦，再检查一下吧");
	  			}
	  			return true;
	  		  },
	      trigger: ["input", "blur"]
	    }
	  ],
    };
	const customRequest = ({
	      file,
	      data,
	      headers,
	      withCredentials,
	      action,
	      onFinish,
	      onError,
	      onProgress
	    }) => {
	      const formData = new FormData()
	      formData.append('files', file.file);
		  formData.append('content', data.content);
		  formData.append('title', data.title);
		  formData.append('tags', data.tags);
		  formData.append('author', data.author);
		  const options = {
		  	method: 'POST',
			transformRequest: [function(data, headers) {
			      delete headers.post['Content-Type']
			      return data
			    }],
		  	headers: {
				'Content-Type': 'multipart/form-data',
		  		'Token': userInfo.value.token
		  	},
		  	data: formData,
		  	url: 'api/book/upload'
		  };
		  axios(options)
		  	.then((response) => {
		  		let data = response.data.data
				show = false;
				if (data.state == -1) {
					ElMessageBox.alert('只允许管理员上传书籍哦', '提示', {
						confirmButtonText: '真糟糕',
						callback: (() => {
							toPage('/')
						}),
					})
				}
				else if (data.state == 1) {
					ElMessageBox.alert('有人上传过相同标题的书籍了哦', '提示', {
						confirmButtonText: '他来的真早',
						callback: (() => {
							  
						}),
					})
				}
		  		else if (response.data.data.code == 403) {
		  			ElMessageBox.alert('上传书籍时出现了问题呢，再试一次吧', '提示', {
		  				confirmButtonText: '哦不',
		  				callback: (() => {
		  
		  				}),
		  			})
		  		} else {
		  			ElMessageBox.alert('上传成功！', '恭喜！', {
		  				confirmButtonText: '芜湖！🥳',
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
	    }
    return {
      formRef,
      rPasswordFormItemRef,
      model: modelRef,
      rules,
	  upload: uploadRef,
	  fileListLength: fileListLengthRef,
	  customRequest,
	  show,
	  handleChange(options) {
        fileListLengthRef.value = options.fileList.length;
	  },
	  handleClick() {
        uploadRef.value?.submit();
	  },
	  async beforeUpload(data) {
	    if (data.file.file?.size > 100 * 1024 * 1024) {
	        message.error("文件不得大于100MB！");
	        return false;
        }
	        return true;
	  },
      handleValidateButtonClick(e) {
        e.preventDefault();
        formRef.value?.validate((errors) => {
          if (!errors && fileListLengthRef.value) {
			show = true;
			uploadRef.value?.submit();
          } else {
            message.error("你好像还有内容没有填写哦？");
          }
        });
      }
    };
  },
  components: {
      ArchiveIcon
    }
});
</script>
<style>
</style>