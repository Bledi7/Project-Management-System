import { defineComponent, type PropType } from 'vue'
import BaseBadge  from '@/components/atoms/base-badge/BaseBadge.vue'
import BaseAvatar from '@/components/atoms/base-avatar/BaseAvatar.vue'
import './ProjectRow.scss'

type Status = 'done' | 'in-progress' | 'review' | 'blocked' | 'pending'

interface TeamMember {
  name: string
  avatar?: string
}

export default defineComponent({
  name: 'ProjectRow',
  components: { BaseBadge, BaseAvatar },
  emits: ['select'],
  props: {
    no:       { type: [Number, String] as PropType<number | string>, required: true },
    name:     { type: String, required: true },
    team:     { type: Array as PropType<TeamMember[]>, required: true },
    deadline: { type: String, required: true },
    status:   { type: String as PropType<Status>, required: true },
    progress: { type: Number },
  },
  setup(_, { emit }) {
    const statusMap: Record<Status, { label: string; variant: 'success' | 'info' | 'warning' | 'danger' | 'default' }> = {
      'done':        { label: 'Done',        variant: 'success' },
      'in-progress': { label: 'In Progress', variant: 'info'    },
      'review':      { label: 'Review',      variant: 'warning' },
      'blocked':     { label: 'Blocked',     variant: 'danger'  },
      'pending':     { label: 'Pending',     variant: 'default' },
    }
    function onSelect() {
      emit('select')
    }

    return { statusMap, onSelect }
  },
})
