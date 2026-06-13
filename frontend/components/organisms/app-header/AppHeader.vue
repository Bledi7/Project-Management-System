<script lang="ts" src="./AppHeader.ts"></script>

<template>
  <header class="app-header">
    <!-- Left: hamburger + title -->
    <div class="header-left">
      <button
        @click="$emit('toggleSidebar')"
        class="icon-btn"
        aria-label="Toggle sidebar"
      >
        <Menu class="icon-svg" :stroke-width="1.8" />
      </button>

      <div>
        <h1 class="title">{{ title }}</h1>
        <p class="subtitle">{{ subtitle }}</p>
      </div>
    </div>

    <!-- Right: actions + avatar -->
    <div class="header-right">
      <button
        @click="toggleTheme"
        class="icon-btn"
        :aria-label="isDark ? 'Light mode' : 'Dark mode'"
      >
        <Sun  v-if="isDark" class="icon-svg" :stroke-width="1.8" />
        <Moon v-else        class="icon-svg" :stroke-width="1.8" />
      </button>

      <button
        class="icon-btn has-dot"
        aria-label="Notifications"
      >
        <Bell class="icon-svg" :stroke-width="1.8" />
        <span
          v-if="hasNotifications"
          class="notify-dot"
        />
      </button>

      <button
        class="icon-btn"
        aria-label="Settings"
      >
        <Settings class="icon-svg" :stroke-width="1.8" />
      </button>

      <div class="divider" />

      <button class="avatar-btn">
        <BaseAvatar name="StarLabs Admin" size="md" />
      </button>
    </div>
  </header>
</template>

