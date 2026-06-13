import { defineComponent } from 'vue'
import './NavGroup.scss'

export default defineComponent({
  name: 'NavGroup',
  props: {
    label: { type: String },
  },
})
