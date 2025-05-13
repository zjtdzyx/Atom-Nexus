<template>
  <div class="container mx-auto py-10 px-4">
    <div class="flex items-center mb-8">
      <router-link to="/credential" class="btn-secondary mr-4">
        <span class="i-carbon-arrow-left mr-1"></span>返回
      </router-link>
      <h1 class="text-3xl font-bold text-textlight">颁发凭证</h1>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- 左侧表单 -->
      <div class="card p-6">
        <form @submit.prevent="submitCredential">
          <div class="mb-6">
            <label class="block text-textlight text-sm font-medium mb-2">
              凭证类型 <span class="text-red-500">*</span>
            </label>
            <select v-model="formData.type"
              class="w-full bg-darkbg rounded-lg p-3 text-textlight border border-metal/30 focus:border-neon outline-none"
              required>
              <option value="EducationCredential">教育凭证</option>
              <option value="EmploymentCredential">就业凭证</option>
              <option value="CertificateCredential">证书凭证</option>
              <option value="AwardCredential">奖项凭证</option>
            </select>
          </div>

          <div class="mb-6">
            <label class="block text-textlight text-sm font-medium mb-2">
              持有者DID <span class="text-red-500">*</span>
            </label>
            <input v-model="formData.holderDid" type="text"
              class="w-full bg-darkbg rounded-lg p-3 text-textlight border border-metal/30 focus:border-neon outline-none"
              placeholder="输入凭证持有者的DID" required />
          </div>

          <div class="mb-6">
            <label class="block text-textlight text-sm font-medium mb-2">
              凭证名称 <span class="text-red-500">*</span>
            </label>
            <input v-model="formData.name" type="text"
              class="w-full bg-darkbg rounded-lg p-3 text-textlight border border-metal/30 focus:border-neon outline-none"
              placeholder="输入凭证名称" required />
          </div>

          <div class="mb-6">
            <label class="block text-textlight text-sm font-medium mb-2">
              有效期至
            </label>
            <input v-model="formData.expirationDate" type="date"
              class="w-full bg-darkbg rounded-lg p-3 text-textlight border border-metal/30 focus:border-neon outline-none" />
          </div>

          <div class="mb-6">
            <label class="block text-textlight text-sm font-medium mb-2">
              凭证描述
            </label>
            <textarea v-model="formData.description"
              class="w-full bg-darkbg rounded-lg p-3 text-textlight border border-metal/30 focus:border-neon outline-none"
              rows="3" placeholder="输入凭证描述"></textarea>
          </div>

          <div class="mb-8">
            <label class="block text-textlight text-sm font-medium mb-2">
              凭证内容 <span class="text-red-500">*</span>
            </label>
            <div class="bg-darkbg rounded-lg p-3 border border-metal/30">
              <div v-for="(field, index) in credentialFields" :key="index" class="mb-4 grid grid-cols-5 gap-2">
                <input v-model="field.key" type="text"
                  class="col-span-2 bg-transparent text-textlight border-b border-metal/30 focus:border-neon outline-none py-2"
                  placeholder="字段名称" />
                <input v-model="field.value" type="text"
                  class="col-span-2 bg-transparent text-textlight border-b border-metal/30 focus:border-neon outline-none py-2"
                  placeholder="字段值" />
                <button type="button" class="text-red-400 hover:text-red-500" @click="removeField(index)">
                  <span class="i-carbon-trash-can"></span>
                </button>
              </div>
              <button type="button" class="text-neon mt-2 flex items-center text-sm" @click="addField">
                <span class="i-carbon-add mr-1"></span> 添加字段
              </button>
            </div>
          </div>

          <div class="flex justify-end space-x-4">
            <button type="button" class="btn-secondary" @click="resetForm">
              重置
            </button>
            <button type="submit" class="btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="i-carbon-circle-dash animate-spin mr-2"></span>
              颁发凭证
            </button>
          </div>
        </form>
      </div>

      <!-- 右侧预览 -->
      <div class="card p-6">
        <h2 class="text-xl font-semibold text-textlight mb-4">凭证预览</h2>
        <div class="bg-darkbg/50 rounded-lg p-4 mb-4">
          <div v-if="formData.name" class="mb-4">
            <h3 class="text-lg font-medium text-textlight">{{ formData.name }}</h3>
            <p class="text-textgray text-sm">{{ formData.description || '无描述' }}</p>
          </div>
          <div class="space-y-3">
            <div>
              <div class="text-xs text-textgray">凭证类型</div>
              <div class="text-sm text-textlight">{{ formData.type || '未选择' }}</div>
            </div>
            <div>
              <div class="text-xs text-textgray">持有者</div>
              <div class="text-sm text-textlight truncate">{{ formData.holderDid || '未指定' }}</div>
            </div>
            <div>
              <div class="text-xs text-textgray">签发日期</div>
              <div class="text-sm text-textlight">{{ new Date().toLocaleDateString() }}</div>
            </div>
            <div v-if="formData.expirationDate">
              <div class="text-xs text-textgray">过期日期</div>
              <div class="text-sm text-textlight">{{ formatDate(formData.expirationDate) }}</div>
            </div>
          </div>
        </div>

        <h3 class="text-md font-medium text-textlight mb-2">凭证内容</h3>
        <div class="bg-darkbg/50 rounded-lg p-4 max-h-80 overflow-auto">
          <div v-if="credentialFields.length === 0" class="text-textgray text-sm text-center py-4">
            尚未添加凭证内容
          </div>
          <div v-for="(field, index) in credentialFields" :key="index" class="mb-2 last:mb-0">
            <div v-if="field.key" class="grid grid-cols-5">
              <div class="col-span-2 text-xs text-textgray">{{ field.key }}</div>
              <div class="col-span-3 text-sm text-textlight">{{ field.value || '无值' }}</div>
            </div>
          </div>
        </div>

        <!-- 结果提示 -->
        <div v-if="resultMessage.text" class="mt-6 p-4 rounded-lg text-sm"
          :class="resultMessage.success ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'">
          {{ resultMessage.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { credentialService } from '../../../services/credential'

  const router = useRouter()
  const isSubmitting = ref(false)
  const resultMessage = reactive({
    text: '',
    success: false
  })

  // 表单数据
  const formData = reactive({
    type: 'EducationCredential',
    holderDid: '',
    name: '',
    description: '',
    expirationDate: ''
  })

  // 凭证字段
  const credentialFields = ref([
    { key: '', value: '' }
  ])

  // 添加字段
  const addField = () => {
    credentialFields.value.push({ key: '', value: '' })
  }

  // 移除字段
  const removeField = (index: number) => {
    if (credentialFields.value.length > 1) {
      credentialFields.value.splice(index, 1)
    }
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // 重置表单
  const resetForm = () => {
    Object.assign(formData, {
      type: 'EducationCredential',
      holderDid: '',
      name: '',
      description: '',
      expirationDate: ''
    })
    credentialFields.value = [{ key: '', value: '' }]
    resultMessage.text = ''
  }

  // 提交表单
  const submitCredential = async () => {
    try {
      isSubmitting.value = true
      resultMessage.text = ''

      // 构建凭证主体内容
      const credentialSubject: Record<string, any> = {}
      for (const field of credentialFields.value) {
        if (field.key) {
          credentialSubject[field.key] = field.value
        }
      }

      // 构建请求数据
      const requestData = {
        type: formData.type,
        holderDid: formData.holderDid,
        metadata: {
          name: formData.name,
          description: formData.description
        },
        expirationDate: formData.expirationDate || undefined,
        credentialSubject
      }

      // 发送请求
      const response = await credentialService.issueCredential(requestData)

      // 处理成功响应
      resultMessage.text = '凭证签发成功!'
      resultMessage.success = true

      // 3秒后跳转到凭证列表
      setTimeout(() => {
        router.push('/credential')
      }, 3000)

    } catch (error: any) {
      console.error('凭证签发失败:', error)
      resultMessage.text = `凭证签发失败: ${error.message || '未知错误'}`
      resultMessage.success = false
    } finally {
      isSubmitting.value = false
    }
  }
</script>

<style scoped>
  .card {
    background-color: rgba(var(--color-primary), 0.4);
    border-radius: 0.5rem;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(var(--color-neon), 0.8);
    color: rgba(var(--color-textlight), 1);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    transition: all 0.2s;
  }

  .btn-primary:hover {
    background-color: rgba(var(--color-neon), 1);
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(var(--color-metal), 0.2);
    color: rgba(var(--color-textlight), 0.8);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    transition: all 0.2s;
  }

  .btn-secondary:hover {
    background-color: rgba(var(--color-metal), 0.3);
    color: rgba(var(--color-textlight), 1);
  }
</style>