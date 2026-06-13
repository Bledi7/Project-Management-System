import { defineComponent, type PropType } from 'vue'
import type { Component } from 'vue'
import BaseProgressRing from '@/components/atoms/base-progress-ring/BaseProgressRing.vue'
import './StatsCard.scss'

export default defineComponent({
  name: 'StatsCard',
  components: { BaseProgressRing },
  props: {
    label:          { type: String,  required: true },
    value:          { type: [String, Number] as PropType<string | number>, required: true },
    icon:           { type: Object as PropType<Component>, required: true },
    progress:       { type: Number, required: true },
    change:         { type: String },
    changePositive: { type: Boolean, default: true },
    color:          { type: String, default: '#0d9488' },
    iconBg:         { type: String, default: '#f0fdfa' },
  },
})
