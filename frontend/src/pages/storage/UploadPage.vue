<template>
  <div class="upload-page">
    <div class="container mx-auto px-4 py-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-green-400 flex items-center">
          <div class="i-carbon-cloud-upload text-3xl mr-2"></div>
          去中心化存储
        </h1>
        <p class="text-gray-400 mt-2">
          安全地将数据上传到去中心化存储网络，并获取唯一的内容标识符(CID)用于后续访问
        </p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <UploadForm />
        </div>
        
        <div class="info-panel bg-white/5 border border-green-800/30 rounded-xl p-6 shadow-lg h-fit">
          <h3 class="text-lg font-semibold text-green-400 mb-4 flex items-center">
            <div class="i-carbon-information text-xl mr-2"></div>
            关于去中心化存储
          </h3>
          
          <div class="space-y-4 text-gray-300 text-sm">
            <div>
              <h4 class="font-medium text-green-400 mb-1">什么是IPFS?</h4>
              <p>星际文件系统(IPFS)是一个分布式系统，用于存储和访问文件、网站、应用程序和数据。使用内容寻址而非位置寻址，确保数据持久性和抗审查性。</p>
            </div>
            
            <div>
              <h4 class="font-medium text-green-400 mb-1">什么是Ceramic?</h4>
              <p>Ceramic是一个去中心化数据网络，允许用户创建可变的、可升级的数据流。特别适合于DID链接的数据和用户生成的内容。</p>
            </div>
            
            <div>
              <h4 class="font-medium text-green-400 mb-1">内容标识符(CID)</h4>
              <p>CID是一个基于内容的唯一标识符，代表您的数据在去中心化网络中的地址。通过CID，无论数据存储在何处，都可以准确定位。</p>
            </div>
            
            <div class="pt-2 border-t border-gray-700">
              <div class="flex items-center justify-between">
                <router-link to="/storage/view" class="text-green-400 hover:text-green-300 flex items-center">
                  <span class="i-carbon-view mr-1"></span>
                  查看数据
                </router-link>
                
                <router-link to="/storage/indexes" class="text-green-400 hover:text-green-300 flex items-center">
                  <span class="i-carbon-list mr-1"></span>
                  索引记录
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UploadForm from '../../components/storage/UploadForm.vue';
</script>

<style scoped>
.info-panel {
  background-image: radial-gradient(circle at center, rgba(52, 211, 153, 0.03) 0%, rgba(0, 0, 0, 0) 70%);
  backdrop-filter: blur(2px);
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 