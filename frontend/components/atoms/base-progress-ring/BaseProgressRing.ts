import { defineComponent, computed } from 'vue'
import './BaseProgressRing.scss'

export default defineComponent({
  name: 'BaseProgressRing',
  props: {
    progress:    { type: Number, required: true },
    size:        { type: Number, default: 48 },
    strokeWidth: { type: Number, default: 4 },
    color:       { type: String, default: '#0d9488' },
    trackColor:  { type: String, default: '#e2e8f0' },
    showLabel:   { type: Boolean, default: false },
  },
  setup(props) {
    const radius       = computed(() => (props.size - props.strokeWidth) / 2)
    const circumference = computed(() => 2 * Math.PI * radius.value)
    const dashOffset   = computed(
      () => circumference.value - (Math.min(Math.max(props.progress, 0), 100) / 100) * circumference.value,
    )
    const viewBox = computed(() => `0 0 ${props.size} ${props.size}`)
    const center  = computed(() => props.size / 2)

    return { radius, circumference, dashOffset, viewBox, center }
  },
})
