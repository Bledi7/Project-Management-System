import { defineComponent, ref } from 'vue'
import AppSidebar from '@/components/organisms/app-sidebar/AppSidebar.vue'
import AppHeader  from '@/components/organisms/app-header/AppHeader.vue'
import './DashboardLayout.scss'

export default defineComponent({
  name: 'DashboardLayout',
  components: { AppSidebar, AppHeader },
  props: {
    title:    { type: String, default: 'Dashboard' },
    subtitle: { type: String, default: 'Welcome to your dashboard' },
  },
  setup() {
    const sidebarCollapsed = ref(false)
    function toggleSidebar() {
      sidebarCollapsed.value = !sidebarCollapsed.value
    }
    return { sidebarCollapsed, toggleSidebar }
  },
})
