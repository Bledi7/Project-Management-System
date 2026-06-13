import { computed, defineComponent, markRaw } from 'vue'
import './AppSidebar.scss'
import {
  LayoutDashboard,
  Users,
  UserCog,
  FolderOpen,
  BarChart2,
  FileText,
  User,
  Pencil,
  HelpCircle,
  LogOut,
  ListChecks,
  CalendarRange,
  CalendarOff,
  ShieldCheck,
} from 'lucide-vue-next'
import NavItem from '@/components/molecules/nav-item/NavItem.vue'
import NavGroup from '@/components/molecules/nav-group/NavGroup.vue'
import rawNav from '@/config/sidebar-nav.json'
import { authState } from '@/modules/auth/auth'

type NavItemJson = {
  label: string
  to: string
  icon: string
  exact?: boolean
  roles?: string[]
}

type NavSectionJson = {
  label: string | null
  items: NavItemJson[]
}

type SidebarNavFile = {
  sections: NavSectionJson[]
}

const navFile = rawNav as SidebarNavFile

const iconMap: Record<string, object> = {
  LayoutDashboard: markRaw(LayoutDashboard),
  Users: markRaw(Users),
  UserCog: markRaw(UserCog),
  FolderOpen: markRaw(FolderOpen),
  BarChart2: markRaw(BarChart2),
  FileText: markRaw(FileText),
  User: markRaw(User),
  Pencil: markRaw(Pencil),
  HelpCircle: markRaw(HelpCircle),
  LogOut: markRaw(LogOut),
  ListChecks: markRaw(ListChecks),
  CalendarRange: markRaw(CalendarRange),
  CalendarOff: markRaw(CalendarOff),
  ShieldCheck: markRaw(ShieldCheck),
}

type SidebarNavItem = NavItemJson & { iconComponent: object | null }

type SidebarNavSection = {
  label: string | null
  items: SidebarNavItem[]
}

function itemVisibleForRole(item: NavItemJson, role: string | undefined): boolean {
  if (!item.roles?.length) {
    return true
  }
  if (!role) {
    return false
  }
  return item.roles.includes(role)
}

export default defineComponent({
  name: 'AppSidebar',
  components: { NavItem, NavGroup },
  props: {
    collapsed: { type: Boolean, default: false },
  },
  setup() {
    const sections = computed((): SidebarNavSection[] => {
      const role = authState.user?.role
      return navFile.sections
        .map((section) => ({
          label: section.label,
          items: section.items
            .filter((item) => itemVisibleForRole(item, role))
            .map((item) => ({
              ...item,
              iconComponent: iconMap[item.icon] ?? null,
            })),
        }))
        .filter((section) => section.items.length > 0)
    })

    return { sections }
  },
})
