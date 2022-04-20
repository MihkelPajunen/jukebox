<template>
  <div class="artists">
    <p>Artists</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useStoreArtists } from '@/store/storeArtists';

const storeArtists = useStoreArtists();

onMounted(() => storeArtists.downloadArtists());
</script>
