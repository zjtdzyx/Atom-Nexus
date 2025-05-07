<template>
  <MainLayout>
    <router-view />
  </MainLayout>
</template>

<script setup lang="ts">
  import MainLayout from '@/layouts/MainLayout.vue';
</script>

<style>
  @import '@/styles/global.css';

  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: 'Inter', sans-serif;
  }

  .app-container {
    width: 100%;
    height: 100vh;
  }
</style>