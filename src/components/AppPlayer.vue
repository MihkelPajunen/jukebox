<template>
  <audio ref="target" controls>
    <source :src="source" :type="type" />
  </audio>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Plyr from 'plyr';

defineProps({
  source: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
});

const target = ref<HTMLAudioElement>();
const player = ref<Plyr>();

onMounted(() => {
  const controls = ['play', 'progress', 'current-time', 'mute', 'volume'];
  target.value && (player.value = new Plyr(target.value, { controls }));
});

onBeforeUnmount(() => player.value?.pause());
</script>

<style lang="sass">
$plyr-color-main: hsl(204, 86%, 53%)
@import 'plyr/src/sass/plyr'
</style>
