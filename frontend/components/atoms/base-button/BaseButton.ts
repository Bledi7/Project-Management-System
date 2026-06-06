import { defineComponent, type PropType } from 'vue'
import './BaseButton.scss'

export default defineComponent({
  name: 'BaseButton',
  props: {
    variant: {
      type: String as PropType<'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'>,
      default: 'primary',
    },
    size: {
      type: String as PropType<'xs' | 'sm' | 'md' | 'lg'>,
      default: 'md',
    },
    disabled:  { type: Boolean, default: false },
    loading:   { type: Boolean, default: false },
    fullWidth: { type: Boolean, default: false },
    type: {
      type: String as PropType<'button' | 'submit' | 'reset'>,
      default: 'button',
    },
  },
  emits: ['click'],
})
