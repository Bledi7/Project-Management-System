import { defineComponent, computed, type PropType } from 'vue'
import { useLink } from 'vue-router'
import type { Component } from 'vue'
import './NavItem.scss'

export default defineComponent({
  name: 'NavItem',
  props: {
    label: { type: String, required: true },
    to:    { type: String, required: true },
    icon:  { type: Object as PropType<Component> },
    exact: { type: Boolean, default: false },
  },
  setup(props) {
    const { isActive, isExactActive, navigate, href } = useLink({
      to: computed(() => props.to),
    })
    return { isActive, isExactActive, navigate, href }
  },
})
