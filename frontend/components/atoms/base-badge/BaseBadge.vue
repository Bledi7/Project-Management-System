<script lang="ts" src="./BaseBadge.ts"></script>

<template>
  <span
    :class="[
      'badge',
      `size-${size}`,
      `variant-${variant}`,
    ]"
  >
    <span
      v-if="dot"
      :class="[
        'dot',
        `dot-${variant}`,
      ]"
    />
    <slot />
  </span>
</template>

