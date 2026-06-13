import { defineComponent, ref } from 'vue'
import { Menu, Sun, Moon, Bell, Settings } from 'lucide-vue-next'
import BaseAvatar from '@/components/atoms/base-avatar/BaseAvatar.vue'
import './AppHeader.scss'

export default defineComponent({
  name: 'AppHeader',
  components: { BaseAvatar, Menu, Sun, Moon, Bell, Settings },
  props: {
    title:    { type: String, default: 'Dashboard' },
    subtitle: { type: String, default: 'Welcome to your dashboard' },
  },
  emits: ['toggleSidebar'],
  setup() {
    const isDark           = ref(false)
    const hasNotifications = ref(true)

    function toggleTheme() {
      isDark.value = !isDark.value
      document.documentElement.classList.toggle('dark', isDark.value)
    }

    return { isDark, hasNotifications, toggleTheme }
  },
})
