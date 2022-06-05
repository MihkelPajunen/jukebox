<template>
  <Transition name="fade">
    <div v-if="isActive" :class="['notification', type, 'm-4']">
      <button @click="close" class="delete"></button>
      {{ message }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps({
  type: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

const isActive = ref(true);

const close = () => (isActive.value = false);

setTimeout(() => (isActive.value = false), 10000);
</script>

<style scoped lang="sass">
.fade-enter-active,
.fade-leave-active
  transition: opacity 0.5s ease

.fade-enter-from,
.fade-leave-to
  opacity: 0
</style>
