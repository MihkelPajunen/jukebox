import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

import type { Notification } from '@/types/Notification';

export const useStoreNotifications = defineStore('storeNotifications', {
  state: () => {
    return {
      notifications: [] as Notification[]
    };
  },
  actions: {
    add(type: Notification['type'], message: string) {
      this.notifications.push({
        id: uuidv4(),
        type: type,
        message: message
      });
    }
  }
});
