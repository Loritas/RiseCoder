<template>
  <n-form ref="formRef" :model="model" :rules="rules" lable-placement="left" :show-require-mark = "false">
    <n-form-item path="title" label="题目标题" placeholder="请输入标题,不能超过20字哦">
      <n-input 
		round 
		v-model:value="model.title" 
		@keydown.enter.prevent 
		show-count
		clearable
		maxlength="20"
		style="text-align: left;"
		/>
    </n-form-item>
	<n-form-item path="content" label="题目正文">
	  <n-input
	    round
		type="textarea"
		v-model:value="model.content"
		maxlength="500"
		show-count
		clearable
		style="text-align: left;"
		placeholder="在此输入题目的正文, 不能超过500字哦"
		/>
	</n-form-item>
    <n-form-item path="tags" label="题目标签">
      <n-input
        v-model:value="model.tags"
        type="text"
        @keydown.enter.prevent
		show-count
		clearable
		style="text-align: left;"
		placeholder="输入题目的标签,每个标签最长为15字,最多10个标签,多个标签使用';'作间隔"
      />
    </n-form-item>
	<n-form-item path="answer" label="题目答案">
	  <n-input
	    v-model:value="model.answer"
	    type="textarea"
	    @keydown.enter.prevent
		show-count
		clearable
		style="text-align: left;"
		placeholder="请按顺序输入题目的答案,多个答案使用';'作间隔,合计最多500字"
	  />
	</n-form-item>
	<n-form-item path="difficult" label="题目难度">
			<n-radio-group v-model:value="model.difficult" name="radiogroup">
			    <n-space>
			      <n-radio-button v-for="difficult in difficults" :key="difficult.difficultType" :value="difficult.difficultType">
			        {{ difficult.label }}
			      </n-radio-button>
			    </n-space>
			</n-radio-group>
		</n-form-item>
	<n-form-item path="type" label="题目类型">
		<n-radio-group v-model:value="model.type" name="radiogroup">
		    <n-space>
		      <n-radio-button v-for="question in questions" :key="question.questionType" :value="question.questionType">
		        {{ question.label }}
		      </n-radio-button>
		    </n-space>
		</n-radio-group>
	</n-form-item>
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
	<!-- <Editor></Editor> -->
<!--  <pre>{{ JSON.stringify(model, null, 2) }}
</pre> -->
</template>

<script>
import { defineComponent, ref } from "vue";
import {
  useMessage
} from "naive-ui";
import { ElMessageBox } from 'element-plus'
import Editor from './Editor.vue'
import axios from 'axios'
import qs from 'qs'
import { useStore } from 'vuex'
import { useUserInfo } from '../utils/userInfo.js'
import { toPage } from '../utils/toPage.js'

var store = useStore()

var {
	userInfo,
	changeInfo,
	clear,
	loginInfo
} = useUserInfo()

function commitQuestion(title, content, type, answer, tags, difficult, userInfo) {
	// 
	const data = {
		title: title,
		context: content,
		type: type,
		answer: answer,
		tags: tags,
		difficult: difficult
	}
	const options = {
		method: 'POST',
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			'Token': userInfo.value.token
		},
		data: qs.stringify(data),
		url: 'api/question/upload'
	};
	axios(options)
		.then((response) => {
			let data = response.data.data
			if (data.code == 403) {
				ElMessageBox.alert('上传题目时出现了问题呢，再试一次吧', '提示', {
					confirmButtonText: '哦不',
					callback: (() => {
	
					}),
				})
			} else {
				// store.commit('userStore/updateState', 
				// 	true, data.token, userInfo.value.userId, userInfo.value.role)
				changeInfo(true, data.token, userInfo.value.userId, userInfo.value.role)
				ElMessageBox.alert('上传成功！', '恭喜！', {
					confirmButtonText: '芜湖！🥳',
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
}


export default defineComponent({
  setup() {
    const formRef = ref(null);
    const rPasswordFormItemRef = ref(null);
    const message = useMessage();
    const modelRef = ref({
      title: null,
	  content: null,
      tags: null,
	  answer: null,
	  difficult: null,
	  type: null,
    });
    // function validatePasswordStartWith(rule, value) {
    //   return !!modelRef.value.password && modelRef.value.password.startsWith(value) && modelRef.value.password.length >= value.length;
    // }
    // function validatePasswordSame(rule, value) {
    //   return value === modelRef.value.password;
    // }
    const rules = {
      title: [
        {
          required: true,
          validator(rule, value) {
            if (!value) {
              return new Error("要给你上传的题目取个名字哦");
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
			    return new Error("没有内容的话，这题可没法做呀");
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
	  answer: [
	    {
	      required: true,
	  		  validator(rule, value) {
	  			if (!value) {
	  				return new Error("题目没有答案是不被允许的");
	  			}
	  		    if (value.length > 500) {
	  		      return new Error("答案的长度超出限制了哦");
	  		    } 
	  			return true;
	  		  },
	      trigger: ["input", "blur"]
	    }
	  ],
	  type: [
		  {
			  required: true,
			  message: "请选择题目类型"
		  }
	  ],
	  difficult: [
	  		  {
	  			  required: true,
	  			  message: "请选择题目难度"
	  		  }
	  ]
    };
    return {
      formRef,
      rPasswordFormItemRef,
      model: modelRef,
      rules,
      handleValidateButtonClick(e) {
        e.preventDefault();
        formRef.value?.validate((errors) => {
          if (!errors) {
			console.log(modelRef.value.difficult)
            commitQuestion(modelRef.value.title, modelRef.value.content, modelRef.value.type, 
					modelRef.value.answer, modelRef.value.tags, modelRef.value.difficult, userInfo)
          } else {
            console.log(errors);
            message.error("还有内容没有填写哦，快去检查一下吧！");
          }
        });
		},
		questionType: ref(null),
		questions: [
		    {
		      questionType: '0',
	          label: '选择题'
	        },
	        {
	          questionType: '1',
			  label: '填空题'
		    }
		    ].map((s) => {
		        return s
		    }),
		difficultType: ref(null),
		difficults: [
		    {
		      difficultType: '0',
		      label: '简单'
		    },
		    {
		      difficultType: '1',
			  label: '中等'
		    },
			{
			  difficultType: '2',
			  label: '困难'
			}
		    ].map((s) => {
		        return s
		    })
      
    };
  },
  components: {
  	Editor
  },
});
</script>
