<template>
  <nav class="navbar is-fixed-top is-dark" role="navigation" aria-label="main navigation">
    <div class="container is-max-desktop">
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

      <div :class="['navbar-menu', { 'is-active': isActive }]" ref="navbarMenu">
        <div class="navbar-end">
          <RouterLink
            @click="isActive = false"
            class="navbar-item"
            active-class="is-active"
            to="/artists"
            >Artists</RouterLink
          >
          <RouterLink
            @click="isActive = false"
            class="navbar-item"
            active-class="is-active"
            to="/tracks"
            >Tracks</RouterLink
          >
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';

const title = import.meta.env.VITE_APP_TITLE;

const isActive = ref(false);

const toggleActive = () => {
  isActive.value = !isActive.value;
};

const navbarBurger = ref<HTMLAnchorElement>();
const navbarMenu = ref<HTMLDivElement>();

onClickOutside(
  navbarMenu,
  () => {
    isActive.value = false;
  },
  { ignore: [navbarBurger] }
);
</script>
