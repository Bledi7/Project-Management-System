<script lang="ts" src="./StatsCard.ts"></script>

<template>
  <div class="stats-card">
    <!-- Icon + ring -->
    <div class="card-top">
      <div
        class="icon-wrap"
        :style="{ backgroundColor: iconBg }"
      >
        <component :is="icon" class="icon-svg" :style="{ color: color }" :stroke-width="1.8" />
      </div>

      <BaseProgressRing
        :progress="progress"
        :size="44"
        :stroke-width="4"
        :color="color"
        track-color="#e2e8f0"
      />
    </div>

    <!-- Value + label -->
    <div>
      <p class="card-value">{{ value }}</p>
      <p class="card-label">{{ label }}</p>
    </div>

    <!-- Change chip -->
    <div
      v-if="change"
      :class="[
        'change-chip',
        changePositive ? 'positive' : 'negative',
      ]"
    >
      {{ change }}
    </div>
  </div>
</template>

