<template>
  <nav class="navbar is-fixed-top is-dark" role="navigation" aria-label="main navigation">
    <div class="container is-fullhd">
      <div class="navbar-brand">
        <RouterLink class="navbar-item" to="/">
          <strong class="is-size-4">{{ title }}</strong>
        </RouterLink>

        <a
          @click="toggleActive"
          class="navbar-burger"
          ref="navbarBurger"
          role="button"
          aria-label="menu"
          aria-expanded="false"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div :class="['navbar-menu', 'py-0', { 'is-active': isActive }]" ref="navbarMenu">
        <div id="navbar-start" class="navbar-start"></div>

        <div class="navbar-end">
          <RouterLink
            @click="isActive = false"
            class="navbar-item"
            active-class="is-active"
            to="/artists"
          >
            <div class="level">
              <span class="level-item">Artists</span>
            </div>
          </RouterLink>

          <RouterLink
            @click="isActive = false"
            class="navbar-item"
            active-class="is-active"
            to="/tracks"
          >
            <div class="level">
              <span class="level-item">Tracks</span>
            </div>
          </RouterLink>

          <div v-if="width > 768" class="navbar-item">
            <RouterLink class="button" active-class="is-active" to="/upload">
              <FontAwesome class="mr-2" icon="upload" />Upload
            </RouterLink>
          </div>

          <RouterLink
            v-else
            @click="isActive = false"
            class="navbar-item"
            active-class="is-active"
            to="/upload"
          >
            <div class="level">
              <span class="level-item">Upload</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onClickOutside, useWindowSize } from '@vueuse/core';

const title = import.meta.env.VITE_APP_TITLE;

const isActive = ref(false);

const toggleActive = () => (isActive.value = !isActive.value);

const navbarBurger = ref<HTMLAnchorElement>();
const navbarMenu = ref<HTMLDivElement>();

onClickOutside(
  navbarMenu,
  () => {
    isActive.value = false;
  },
  { ignore: [navbarBurger] }
);

const { width } = useWindowSize();
</script>

<style lang="sass">
@import 'bulma/bulma'

.container
  @include from(769px)
    padding-left: 1.5rem
    padding-right: 1.5rem
</style>
