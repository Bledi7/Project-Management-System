<script lang="ts" src="./DashboardLayout.ts"></script>

<template>
  <div class="dashboard-layout">
    <AppSidebar :collapsed="sidebarCollapsed" />

    <div class="layout-main">
      <AppHeader
        :title="title"
        :subtitle="subtitle"
        @toggle-sidebar="toggleSidebar"
      />

      <main class="content-area">
        <slot />
      </main>
    </div>
  </div>
</template>

