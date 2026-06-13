import { defineComponent, onMounted, onBeforeUnmount, ref } from 'vue'
import {
  subscribeNotifications,
  type AppNotification,
} from '@/modules/notifications/notifications'
import './NotificationCenter.scss'

export default defineComponent({
  name: 'NotificationCenter',
  setup() {
    const notifications = ref<AppNotification[]>([])
    const timers = new Map<string, number>()
    let unsubscribe: (() => void) | null = null

    function removeNotification(id: string) {
      notifications.value = notifications.value.filter((notification) => notification.id !== id)

      const timer = timers.get(id)
      if (timer) {
        window.clearTimeout(timer)
        timers.delete(id)
      }
    }

    onMounted(() => {
      unsubscribe = subscribeNotifications((notification) => {
        notifications.value = [...notifications.value, notification]
        const timer = window.setTimeout(() => {
          removeNotification(notification.id)
        }, notification.durationMs)
        timers.set(notification.id, timer)
      })
    })

    onBeforeUnmount(() => {
      if (unsubscribe) unsubscribe()
      for (const timer of timers.values()) {
        window.clearTimeout(timer)
      }
      timers.clear()
    })

    return {
      notifications,
      removeNotification,
    }
  },
})
