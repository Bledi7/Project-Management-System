<script lang="ts" src="./BaseLink.ts"></script>

<template>
  <!-- External / href link -->
  <a
    v-if="external || href"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    :class="[
      'link',
      `variant-${variant}`,
    ]"
  >
    <slot />
  </a>

  <!-- Internal router link -->
  <RouterLink
    v-else-if="to"
    :to="to"
    :active-class="activeClass"
    :class="[
      'link',
      `variant-${variant}`,
    ]"
  >
    <slot />
  </RouterLink>
</template>

