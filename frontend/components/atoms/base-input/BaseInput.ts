import { defineComponent, type PropType } from 'vue'
import './BaseInput.scss'

export default defineComponent({
  name: 'BaseInput',
  props: {
    modelValue: { type: [String, Number] as PropType<string | number> },
    type: {
      type: String as PropType<'text' | 'email' | 'password' | 'number' | 'search' | 'url' | 'tel'>,
      default: 'text',
    },
    placeholder: { type: String },
    disabled:    { type: Boolean, default: false },
    readonly:    { type: Boolean, default: false },
    error:       { type: String },
    size: {
      type: String as PropType<'sm' | 'md' | 'lg'>,
      default: 'md',
    },
    id: { type: String },
  },
  emits: ['update:modelValue', 'blur', 'focus'],
  methods: {
    onInput(event: Event) {
      this.$emit('update:modelValue', (event.target as HTMLInputElement).value)
    },
  },
})
