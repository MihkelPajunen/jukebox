<template>
  <AppNavbar />
  <div class="container is-max-desktop">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '@/components/AppNavbar.vue';
</script>

<style lang="sass">
@import 'bulma/bulma'
</style>
