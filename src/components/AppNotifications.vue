<template>
  <div class="notifications">
    <AppNotification
      v-for="notification in storeNotifications.notifications"
      :key="notification.id"
      :type="notification.type"
      :message="notification.message"
    />
  </div>
</template>

<script setup lang="ts">
import AppNotification from './AppNotification.vue';
import { useStoreNotifications } from '@/store/storeNotifications';

const storeNotifications = useStoreNotifications();
</script>

<style scoped lang="sass">
.notifications
  right: 0
  bottom: 0
  position: fixed
</style>
