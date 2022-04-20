<template>
  <AppNavbar />
  <div id="content" class="container is-max-desktop">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '@/components/AppNavbar.vue';
</script>

<style lang="sass">
@import 'bulma/bulma'

#content
  padding-top: 0.5rem
  padding-bottom: 0.5rem

  @include until($desktop)
    padding-left: 0.75rem
    padding-right: 0.75rem
</style>
