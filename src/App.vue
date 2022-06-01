<template>
  <AppNavbar />
  <div id="content" class="container is-fullhd p-5">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '@/components/AppNavbar.vue';
</script>

<style lang="sass">
@import '../node_modules/bulma/sass/utilities/initial-variables'
$navbar-breakpoint: 769px // collapse navbar when window width is less than 769px
@import 'bulma/bulma'

#content
  min-height: calc(100vh - $navbar-height)

.is-fullhd
  max-width: 1514px !important
</style>
