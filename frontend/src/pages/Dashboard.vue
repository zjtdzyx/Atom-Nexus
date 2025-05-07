<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">仪表盘</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- 凭证概览卡片 -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">凭证概览</h3>
          <div class="i-carbon-certificate text-2xl text-primary"></div>
        </div>
        <div class="text-3xl font-bold mb-2">7</div>
        <div class="text-gray-500">有效凭证总数</div>
        <div class="mt-4">
          <RouterLink to="/credentials" class="text-primary text-sm hover:underline">查看全部凭证</RouterLink>
        </div>
      </div>

      <!-- 身份信息卡片 -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">身份信息</h3>
          <div class="i-carbon-user-profile text-2xl text-primary"></div>
        </div>
        <div class="mb-2">
          <div class="text-gray-500 mb-1">DID</div>
          <div class="text-sm font-mono bg-gray-100 p-2 rounded overflow-x-auto">
            did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK
          </div>
        </div>
        <div class="mt-4">
          <RouterLink to="/identity" class="text-primary text-sm hover:underline">管理身份</RouterLink>
        </div>
      </div>

      <!-- 最近活动卡片 -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">最近活动</h3>
          <div class="i-carbon-activity text-2xl text-primary"></div>
        </div>
        <div class="space-y-3">
          <div class="flex items-start">
            <div class="i-carbon-checkmark-filled text-green-500 mt-1 mr-2"></div>
            <div>
              <div class="text-sm">新增凭证：大学学位证书</div>
              <div class="text-xs text-gray-500">2天前</div>
            </div>
          </div>
          <div class="flex items-start">
            <div class="i-carbon-view-filled text-blue-500 mt-1 mr-2"></div>
            <div>
              <div class="text-sm">某企业验证了您的身份</div>
              <div class="text-xs text-gray-500">3天前</div>
            </div>
          </div>
          <div class="flex items-start">
            <div class="i-carbon-share text-orange-500 mt-1 mr-2"></div>
            <div>
              <div class="text-sm">分享了实习证明凭证</div>
              <div class="text-xs text-gray-500">1周前</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 应用卡片行 -->
    <h2 class="text-xl font-semibold mt-8 mb-4">快速访问</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card flex flex-col items-center justify-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div class="i-carbon-add text-3xl text-primary mb-2"></div>
        <div>申请新凭证</div>
      </div>
      <div class="card flex flex-col items-center justify-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div class="i-carbon-share text-3xl text-primary mb-2"></div>
        <div>分享凭证</div>
      </div>
      <div class="card flex flex-col items-center justify-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div class="i-carbon-scan text-3xl text-primary mb-2"></div>
        <div>扫码验证</div>
      </div>
      <div class="card flex flex-col items-center justify-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div class="i-carbon-application text-3xl text-primary mb-2"></div>
        <div>管理应用</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // 仪表盘页面逻辑
</script>