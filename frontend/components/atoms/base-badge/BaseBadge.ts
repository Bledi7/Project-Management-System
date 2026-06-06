import { defineComponent, type PropType } from 'vue'
import './BaseBadge.scss'

export default defineComponent({
  name: 'BaseBadge',
  props: {
    variant: {
      type: String as PropType<'success' | 'warning' | 'danger' | 'info' | 'default' | 'primary'>,
      default: 'default',
    },
    size: {
      type: String as PropType<'sm' | 'md'>,
      default: 'md',
    },
    dot: { type: Boolean, default: false },
  },
})
