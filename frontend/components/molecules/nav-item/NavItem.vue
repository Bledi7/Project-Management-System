<script lang="ts" src="./NavItem.ts"></script>

<template>
  <a
    :href="href"
    @click="navigate"
    :class="[
      'nav-item',
      (exact ? isExactActive : isActive)
        ? 'is-active'
        : 'is-idle',
    ]"
  >
    <!-- Icon -->
    <span
      :class="[
        'item-icon',
        (exact ? isExactActive : isActive)
          ? 'icon-active'
          : 'icon-idle',
      ]"
    >
      <component :is="icon" v-if="icon" class="icon-svg" :stroke-width="1.8" />
    </span>

    <!-- Label -->
    <span class="item-label">{{ label }}</span>

    <!-- Active bar -->
    <span
      v-if="exact ? isExactActive : isActive"
      class="active-bar"
    />
  </a>
</template>

