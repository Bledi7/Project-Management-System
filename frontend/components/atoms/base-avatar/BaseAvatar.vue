<script lang="ts" src="./BaseAvatar.ts"></script>

<template>
  <div class="avatar-wrap">
    <div
      :class="[
        'avatar',
        `size-${size}`,
      ]"
    >
      <img
        v-if="src"
        :src="src"
        :alt="name"
        class="avatar-image"
      />
      <span
        v-else
        :style="{ backgroundColor: bgColor }"
        class="avatar-fallback"
      >
        {{ initials }}
      </span>
    </div>

    <!-- Status dot -->
    <span
      v-if="status"
      :class="[
        'status-dot',
        `status-size-${size}`,
        `status-${status}`,
      ]"
    />
  </div>
</template>

