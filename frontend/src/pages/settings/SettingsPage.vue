<template>
  <div class="container mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold text-textlight mb-8">系统设置</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- 左侧导航 -->
      <div class="md:col-span-1">
        <div class="card p-4">
          <ul class="space-y-2">
            <li class="p-2 bg-neon/10 rounded-lg border-l-2 border-neon">
              <a href="#account" class="text-textlight block">账户设置</a>
            </li>
            <li class="p-2 hover:bg-primary/40 rounded-lg border-l-2 border-transparent">
              <a href="#security" class="text-textgray hover:text-textlight block">安全与隐私</a>
            </li>
            <li class="p-2 hover:bg-primary/40 rounded-lg border-l-2 border-transparent">
              <a href="#appearance" class="text-textgray hover:text-textlight block">外观设置</a>
            </li>
            <li class="p-2 hover:bg-primary/40 rounded-lg border-l-2 border-transparent">
              <a href="#notifications" class="text-textgray hover:text-textlight block">通知设置</a>
            </li>
            <li class="p-2 hover:bg-primary/40 rounded-lg border-l-2 border-transparent">
              <a href="#advanced" class="text-textgray hover:text-textlight block">高级设置</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- 右侧设置内容 -->
      <div class="md:col-span-2">
        <!-- 账户设置 -->
        <div id="account" class="card p-6 mb-8">
          <h2 class="text-xl font-semibold text-textlight mb-6">账户设置</h2>

          <div class="space-y-6">
            <div>
              <label class="block text-textgray mb-2">用户名</label>
              <input type="text" value="AtomUser" class="input w-full bg-darkbg text-textlight border-metal/20" />
            </div>

            <div>
              <label class="block text-textgray mb-2">电子邮箱</label>
              <input type="email" value="user@example.com"
                class="input w-full bg-darkbg text-textlight border-metal/20" />
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-metal/20">
              <button class="btn-secondary">取消</button>
              <button class="btn-primary">保存更改</button>
            </div>
          </div>
        </div>

        <!-- 功能待实现提示 -->
        <div class="card p-6 bg-primary/40">
          <h2 class="text-xl font-semibold text-textlight mb-4">更多设置功能</h2>
          <p class="text-textgray">更多个性化设置功能正在开发中，敬请期待...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // 设置页面逻辑
</script>