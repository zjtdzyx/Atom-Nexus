<template>
  <div class="team-section">
    <h2 class="text-2xl font-bold text-textlight mb-6">我们的团队</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="member in members" :key="member.id" class="team-card card p-5 transition-all duration-300 hover:bg-neon/10">
        <div class="flex flex-col items-center">
          <div class="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-neon">
            <img :src="member.avatar" :alt="member.name" class="w-full h-full object-cover" />
          </div>
          
          <h3 class="text-xl font-semibold text-textlight mb-1">{{ member.name }}</h3>
          <p class="text-neon mb-3">{{ member.role }}</p>
          
          <p class="text-textgray text-center text-sm">{{ member.bio }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

defineProps<{
  members: TeamMember[];
}>();
</script>

<style scoped>
.team-card {
  border: 1px solid transparent;
}

.team-card:hover {
  border-color: var(--color-neon);
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(var(--color-neon-rgb), 0.1), 0 4px 6px -2px rgba(var(--color-neon-rgb), 0.05);
}
</style> 