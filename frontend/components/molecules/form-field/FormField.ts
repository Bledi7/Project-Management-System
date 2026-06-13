import { defineComponent, type PropType } from 'vue'
import BaseInput from '@/components/atoms/base-input/BaseInput.vue'
import './FormField.scss'

export default defineComponent({
  name: 'FormField',
  components: { BaseInput },
  props: {
    modelValue:  { type: [String, Number] as PropType<string | number> },
    label:       { type: String },
    id:          { type: String },
    type: {
      type: String as PropType<'text' | 'email' | 'password' | 'number' | 'search' | 'url' | 'tel'>,
      default: 'text',
    },
    placeholder: { type: String },
    hint:        { type: String },
    error:       { type: String },
    required:    { type: Boolean, default: false },
    disabled:    { type: Boolean, default: false },
    size: {
      type: String as PropType<'sm' | 'md' | 'lg'>,
      default: 'md',
    },
  },
  emits: ['update:modelValue'],
})
