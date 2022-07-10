<template>
  <AppNavbar />
  <div id="content" class="container is-fullhd p-5">
    <RouterView />
  </div>
  <footer class="footer p-4">
    <div class="content has-text-centered">
      <p>Created by <a target="_blank" :href="link"> Mihkel Pajunen</a> (2022).</p>
    </div>
  </footer>
  <AppNotifications />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppNavbar from '@/components/AppNavbar.vue';
import AppNotifications from '@/components/AppNotifications.vue';

const link = ref('https://github.com/MihkelPajunen');
</script>

<style lang="sass">
@import '../node_modules/bulma/sass/utilities/initial-variables'
$navbar-breakpoint: 769px // collapse navbar when window width is less than 769px
@import 'bulma/bulma'

#content
  min-height: calc(100vh - $navbar-height - 56px)

.is-fullhd
  max-width: 1514px !important
</style>
