import { defineComponent, computed, type PropType } from 'vue'
import './BaseAvatar.scss'

export default defineComponent({
  name: 'BaseAvatar',
  props: {
    src:    { type: String },
    name:   { type: String },
    size: {
      type: String as PropType<'xs' | 'sm' | 'md' | 'lg' | 'xl'>,
      default: 'md',
    },
    status: { type: String as PropType<'online' | 'offline' | 'away' | 'busy'> },
  },
  setup(props) {
    const initials = computed(() => {
      if (!props.name) return '?'
      return props.name
        .split(' ')
        .map((p) => p[0]?.toUpperCase())
        .slice(0, 2)
        .join('')
    })

    const bgColor = computed(() => {
      if (!props.name) return '#94a3b8'
      let hash = 0
      for (let i = 0; i < props.name.length; i++) {
        hash = props.name.charCodeAt(i) + ((hash << 5) - hash)
      }
      const palette = [
        '#0d9488', '#0284c7', '#7c3aed', '#db2777',
        '#ea580c', '#16a34a', '#d97706', '#e11d48',
        '#2563eb', '#9333ea',
      ]
      return palette[Math.abs(hash) % palette.length]
    })

    return { initials, bgColor }
  },
})
