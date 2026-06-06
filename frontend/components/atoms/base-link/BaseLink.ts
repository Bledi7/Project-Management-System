import { defineComponent, type PropType } from 'vue'
import { RouterLink } from 'vue-router'
import './BaseLink.scss'

export default defineComponent({
  name: 'BaseLink',
  components: { RouterLink },
  props: {
    to:          { type: [String, Object] as PropType<string | object> },
    href:        { type: String },
    variant: {
      type: String as PropType<'default' | 'primary' | 'muted' | 'nav' | 'unstyled'>,
      default: 'default',
    },
    external:    { type: Boolean, default: false },
    activeClass: { type: String },
  },
})
