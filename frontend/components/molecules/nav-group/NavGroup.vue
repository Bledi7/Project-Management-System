<script lang="ts" src="./NavGroup.ts"></script>

<template>
  <div class="nav-group">
    <p
      v-if="label"
      class="group-label"
    >
      {{ label }}
    </p>
    <slot />
  </div>
</template>

