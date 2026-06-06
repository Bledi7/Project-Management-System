<script lang="ts" src="./BaseButton.ts"></script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
    :class="[
      'button',
      `size-${size}`,
      `variant-${variant}`,
      (disabled || loading) && 'is-disabled',
      fullWidth && 'is-full',
    ]"
  >
    <span
      v-if="loading"
      class="spinner"
    />
    <slot />
  </button>
</template>

