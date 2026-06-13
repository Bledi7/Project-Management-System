<script lang="ts" src="./NotificationCenter.ts"></script>

<template>
  <div class="toast-root">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="toast-item"
      :class="`level-${notification.level}`"
    >
      <div class="toast-content">
        <p v-if="notification.title" class="toast-title">{{ notification.title }}</p>
        <p class="toast-message">{{ notification.message }}</p>
      </div>
      <button class="toast-close" @click="removeNotification(notification.id)" aria-label="Dismiss notification">
        x
      </button>
    </div>
  </div>
</template>
