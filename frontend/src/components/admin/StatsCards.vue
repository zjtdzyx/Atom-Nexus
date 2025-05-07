<template>
  <div class="stats-cards">
    <!-- 用户统计 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="stat-card bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-violet-800/40 transition-all duration-300">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-zinc-400 mb-1">用户总数</p>
            <h3 class="text-3xl font-semibold text-zinc-200">
              {{ stats?.userStats.total || 0 }}
            </h3>
          </div>
          <div class="w-12 h-12 rounded-lg bg-violet-400/10 flex items-center justify-center text-violet-400">
            <div class="i-carbon-user-multiple text-2xl"></div>
          </div>
        </div>
        <div class="mt-3 text-sm">
          <span :class="stats?.userStats.growthRate && stats.userStats.growthRate > 0 ? 'text-green-400' : 'text-red-400'">
            <span v-if="stats?.userStats.growthRate && stats.userStats.growthRate > 0" class="i-carbon-arrow-up mr-1"></span>
            <span v-else class="i-carbon-arrow-down mr-1"></span>
            {{ stats?.userStats.growthRate ? Math.abs(stats.userStats.growthRate) : 0 }}%
          </span>
          <span class="text-zinc-500 ml-1">相比上月</span>
        </div>
      </div>

      <div class="stat-card bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-violet-800/40 transition-all duration-300">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-zinc-400 mb-1">今日活跃用户</p>
            <h3 class="text-3xl font-semibold text-zinc-200">
              {{ stats?.userStats.activeToday || 0 }}
            </h3>
          </div>
          <div class="w-12 h-12 rounded-lg bg-violet-400/10 flex items-center justify-center text-violet-400">
            <div class="i-carbon-user-activity text-2xl"></div>
          </div>
        </div>
        <div class="mt-3 text-sm">
          <span class="text-zinc-500">占总用户的</span>
          <span class="text-cyan-400 ml-1">
            {{ stats ? Math.round((stats.userStats.activeToday / stats.userStats.total) * 100) : 0 }}%
          </span>
        </div>
      </div>

      <div class="stat-card bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-violet-800/40 transition-all duration-300">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-zinc-400 mb-1">本周新增</p>
            <h3 class="text-3xl font-semibold text-zinc-200">
              {{ stats?.userStats.newThisWeek || 0 }}
            </h3>
          </div>
          <div class="w-12 h-12 rounded-lg bg-violet-400/10 flex items-center justify-center text-violet-400">
            <div class="i-carbon-user-follow text-2xl"></div>
          </div>
        </div>
      </div>

      <div class="stat-card bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-violet-800/40 transition-all duration-300">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-zinc-400 mb-1">API调用/今日</p>
            <h3 class="text-3xl font-semibold text-zinc-200">
              {{ formatNumber(stats?.systemStats.apiCallsToday || 0) }}
            </h3>
          </div>
          <div class="w-12 h-12 rounded-lg bg-violet-400/10 flex items-center justify-center text-violet-400">
            <div class="i-carbon-api text-2xl"></div>
          </div>
        </div>
        <div class="mt-3 text-sm">
          <span class="text-zinc-500">平均响应时间</span>
          <span class="text-cyan-400 ml-1">{{ stats?.systemStats.averageResponseTime || 0 }}ms</span>
        </div>
      </div>
    </div>

    <!-- 凭证统计 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="stat-card bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-violet-800/40 transition-all duration-300">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-zinc-400 mb-1">凭证总数</p>
            <h3 class="text-3xl font-semibold text-zinc-200">
              {{ stats?.credentialStats.total || 0 }}
            </h3>
          </div>
          <div class="w-12 h-12 rounded-lg bg-violet-400/10 flex items-center justify-center text-violet-400">
            <div class="i-carbon-certificate text-2xl"></div>
          </div>
        </div>
        <div class="mt-3 text-sm">
          <span class="text-green-400">
            <span class="i-carbon-checkmark-filled mr-1"></span>
            {{ stats?.credentialStats.valid || 0 }} 有效
          </span>
          <span class="text-amber-400 ml-2">
            <span class="i-carbon-time mr-1"></span>
            {{ stats?.credentialStats.expired || 0 }} 过期
          </span>
          <span class="text-red-400 ml-2">
            <span class="i-carbon-close-filled mr-1"></span>
            {{ stats?.credentialStats.revoked || 0 }} 撤销
          </span>
        </div>
      </div>

      <div class="stat-card bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-violet-800/40 transition-all duration-300">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-zinc-400 mb-1">本月新增凭证</p>
            <h3 class="text-3xl font-semibold text-zinc-200">
              {{ stats?.credentialStats.issuedThisMonth || 0 }}
            </h3>
          </div>
          <div class="w-12 h-12 rounded-lg bg-violet-400/10 flex items-center justify-center text-violet-400">
            <div class="i-carbon-calendar-heat-map text-2xl"></div>
          </div>
        </div>
      </div>

      <div class="stat-card bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-violet-800/40 transition-all duration-300">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-zinc-400 mb-1">权限总数</p>
            <h3 class="text-3xl font-semibold text-zinc-200">
              {{ stats?.permissionStats.total || 0 }}
            </h3>
          </div>
          <div class="w-12 h-12 rounded-lg bg-violet-400/10 flex items-center justify-center text-violet-400">
            <div class="i-carbon-security text-2xl"></div>
          </div>
        </div>
        <div class="mt-3 text-sm">
          <span class="text-green-400">
            <span class="i-carbon-checkmark-filled mr-1"></span>
            {{ stats?.permissionStats.active || 0 }} 活跃
          </span>
        </div>
      </div>

      <div class="stat-card bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-violet-800/40 transition-all duration-300">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-zinc-400 mb-1">系统状态</p>
            <h3 class="text-lg font-semibold text-zinc-200 flex items-center mt-2">
              <span class="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              正常运行
            </h3>
          </div>
          <div class="w-12 h-12 rounded-lg bg-violet-400/10 flex items-center justify-center text-violet-400">
            <div class="i-carbon-cloud-service-management text-2xl"></div>
          </div>
        </div>
        <div class="mt-3 text-sm flex justify-between">
          <span class="text-zinc-500">
            存储: {{ stats?.systemStats.totalStorage || '0 GB' }}
          </span>
          <span class="text-zinc-500">
            运行时间: {{ stats?.systemStats.uptime || '0天' }}
          </span>
        </div>
      </div>
    </div>

    <!-- 图表占位 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="chart-card bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-violet-800/40 transition-all duration-300 h-72">
        <h3 class="text-lg font-medium text-zinc-200 mb-4">用户增长趋势</h3>
        <div class="flex items-center justify-center h-56 bg-gradient-to-b from-zinc-800/30 to-transparent rounded-lg">
          <div class="text-zinc-400 flex flex-col items-center">
            <div class="i-carbon-chart-line text-5xl mb-2"></div>
            <p>用户增长趋势图</p>
            <p class="text-xs text-zinc-500 mt-1">(图表占位)</p>
          </div>
        </div>
      </div>

      <div class="chart-card bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-violet-800/40 transition-all duration-300 h-72">
        <h3 class="text-lg font-medium text-zinc-200 mb-4">凭证分布</h3>
        <div class="flex items-center justify-center h-56 bg-gradient-to-b from-zinc-800/30 to-transparent rounded-lg">
          <div class="text-zinc-400 flex flex-col items-center">
            <div class="i-carbon-chart-pie text-5xl mb-2"></div>
            <p>凭证类型分布图</p>
            <p class="text-xs text-zinc-500 mt-1">(图表占位)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAdminStore } from '../../stores/admin';
import type { Stats } from '../../stores/admin';

const props = defineProps<{
  stats: Stats | null;
}>();

// 格式化数字，添加千位分隔符
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('zh-CN').format(num);
};
</script>

<style scoped>
.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.1);
}

.chart-card {
  transition: all 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.1);
}
</style> 