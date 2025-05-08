<template>
  <div class="container mx-auto py-10 px-4">
    <div class="mb-6">
      <router-link to="/permissions" class="text-neon hover:underline flex items-center">
        <div class="i-carbon-arrow-left mr-2"></div>
        返回权限管理
      </router-link>
    </div>

    <h1 class="text-3xl font-bold text-textlight mb-8">权限审计</h1>

    <div class="card p-6 mb-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-textlight">访问记录</h2>

        <div class="flex items-center space-x-2">
          <select class="bg-darkbg text-textlight border border-metal/20 rounded-lg p-2 text-sm">
            <option value="all">所有操作</option>
            <option value="view">查看操作</option>
            <option value="verify">验证操作</option>
            <option value="grant">授权操作</option>
            <option value="revoke">撤销操作</option>
          </select>

          <button class="btn-secondary text-sm">
            <div class="i-carbon-filter mr-1 inline-block"></div>
            筛选
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-metal/20">
              <th class="text-left py-3 px-4 text-textgray">时间</th>
              <th class="text-left py-3 px-4 text-textgray">操作</th>
              <th class="text-left py-3 px-4 text-textgray">操作方</th>
              <th class="text-left py-3 px-4 text-textgray">对象</th>
              <th class="text-left py-3 px-4 text-textgray">IP地址</th>
              <th class="text-left py-3 px-4 text-textgray">状态</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-metal/20 hover:bg-primary/40">
              <td class="py-3 px-4 text-textlight">2023-07-22 14:30</td>
              <td class="py-3 px-4 text-textlight">
                <span class="bg-violet/20 text-violet px-2 py-1 rounded-full text-xs">验证</span>
              </td>
              <td class="py-3 px-4 text-textlight">某企业 (did:web:enterprise.com)</td>
              <td class="py-3 px-4 text-textlight">学历凭证</td>
              <td class="py-3 px-4 text-textgray">192.168.1.1</td>
              <td class="py-3 px-4">
                <span class="text-green-400">成功</span>
              </td>
            </tr>
            <tr class="border-b border-metal/20 hover:bg-primary/40">
              <td class="py-3 px-4 text-textlight">2023-07-20 09:15</td>
              <td class="py-3 px-4 text-textlight">
                <span class="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">授权</span>
              </td>
              <td class="py-3 px-4 text-textlight">您 (did:key:z6Mk...)</td>
              <td class="py-3 px-4 text-textlight">实习凭证</td>
              <td class="py-3 px-4 text-textgray">127.0.0.1</td>
              <td class="py-3 px-4">
                <span class="text-green-400">成功</span>
              </td>
            </tr>
            <tr class="border-b border-metal/20 hover:bg-primary/40">
              <td class="py-3 px-4 text-textlight">2023-07-15 16:45</td>
              <td class="py-3 px-4 text-textlight">
                <span class="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">撤销</span>
              </td>
              <td class="py-3 px-4 text-textlight">您 (did:key:z6Mk...)</td>
              <td class="py-3 px-4 text-textlight">旧身份证明</td>
              <td class="py-3 px-4 text-textgray">127.0.0.1</td>
              <td class="py-3 px-4">
                <span class="text-green-400">成功</span>
              </td>
            </tr>
            <tr class="border-b border-metal/20 hover:bg-primary/40">
              <td class="py-3 px-4 text-textlight">2023-07-10 11:20</td>
              <td class="py-3 px-4 text-textlight">
                <span class="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">查看</span>
              </td>
              <td class="py-3 px-4 text-textlight">某大学 (did:web:university.edu)</td>
              <td class="py-3 px-4 text-textlight">个人资料</td>
              <td class="py-3 px-4 text-textgray">203.0.113.1</td>
              <td class="py-3 px-4">
                <span class="text-green-400">成功</span>
              </td>
            </tr>
            <tr class="hover:bg-primary/40">
              <td class="py-3 px-4 text-textlight">2023-07-05 08:30</td>
              <td class="py-3 px-4 text-textlight">
                <span class="bg-violet/20 text-violet px-2 py-1 rounded-full text-xs">验证</span>
              </td>
              <td class="py-3 px-4 text-textlight">未知 (did:web:unknown.org)</td>
              <td class="py-3 px-4 text-textlight">身份证明</td>
              <td class="py-3 px-4 text-textgray">198.51.100.1</td>
              <td class="py-3 px-4">
                <span class="text-red-400">失败</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-between items-center mt-6">
        <div class="text-textgray text-sm">显示 1-5 条，共 24 条记录</div>
        <div class="flex space-x-2">
          <button class="px-3 py-1 bg-primary/70 text-textlight rounded disabled:opacity-50" disabled>上一页</button>
          <button class="px-3 py-1 bg-neon text-white rounded">1</button>
          <button class="px-3 py-1 bg-primary/70 text-textlight rounded">2</button>
          <button class="px-3 py-1 bg-primary/70 text-textlight rounded">3</button>
          <button class="px-3 py-1 bg-primary/70 text-textlight rounded">下一页</button>
        </div>
      </div>
    </div>

    <div class="card p-6">
      <h2 class="text-xl font-semibold text-textlight mb-6">安全建议</h2>

      <div class="space-y-4">
        <div class="flex items-start">
          <div class="i-carbon-checkmark-filled text-green-400 mt-1 mr-2 flex-shrink-0"></div>
          <div>
            <p class="text-textlight">定期检查权限审计记录</p>
            <p class="text-textgray text-sm">及时发现并处理异常的访问请求和操作</p>
          </div>
        </div>

        <div class="flex items-start">
          <div class="i-carbon-checkmark-filled text-green-400 mt-1 mr-2 flex-shrink-0"></div>
          <div>
            <p class="text-textlight">关注高风险操作</p>
            <p class="text-textgray text-sm">特别是来自未知源的验证请求和授权更改</p>
          </div>
        </div>

        <div class="flex items-start">
          <div class="i-carbon-checkmark-filled text-green-400 mt-1 mr-2 flex-shrink-0"></div>
          <div>
            <p class="text-textlight">定期清理不需要的权限</p>
            <p class="text-textgray text-sm">撤销那些已不再需要的长期授权权限</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // 权限审计页面逻辑
</script>