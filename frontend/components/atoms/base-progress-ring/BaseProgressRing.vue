<script lang="ts" src="./BaseProgressRing.ts"></script>

<template>
  <div class="ring-wrap">
    <svg
      :width="size"
      :height="size"
      :viewBox="viewBox"
      fill="none"
      style="transform: rotate(-90deg)"
    >
      <!-- Track -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke="trackColor"
        :stroke-width="strokeWidth"
        fill="none"
      />
      <!-- Progress -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke="color"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        stroke-linecap="round"
        fill="none"
        style="transition: stroke-dashoffset 0.5s ease"
      />
    </svg>

    <span v-if="showLabel" class="ring-label">
      {{ Math.round(progress) }}%
    </span>
    <div v-else-if="$slots.default" class="ring-slot">
      <slot />
    </div>
  </div>
</template>

