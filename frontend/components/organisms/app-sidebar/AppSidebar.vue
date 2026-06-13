<script lang="ts" src="./AppSidebar.ts"></script>

<template>
  <aside
    :class="[
      'app-sidebar',
      collapsed ? 'is-collapsed' : 'is-expanded',
    ]"
  >
    <div
      :class="[
        'logo-row',
        collapsed && 'logo-collapsed',
      ]"
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" class="shrink-0">
        <circle cx="16" cy="6"  r="3"   fill="#0d9488" opacity="0.9"/>
        <circle cx="26" cy="11" r="2.5" fill="#0d9488" opacity="0.7"/>
        <circle cx="26" cy="21" r="2"   fill="#0d9488" opacity="0.5"/>
        <circle cx="16" cy="26" r="3"   fill="#0d9488" opacity="0.9"/>
        <circle cx="6"  cy="21" r="2.5" fill="#0d9488" opacity="0.7"/>
        <circle cx="6"  cy="11" r="2"   fill="#0d9488" opacity="0.5"/>
      </svg>
      <span v-if="!collapsed" class="brand-name">StarLabs</span>
    </div>

    <nav class="nav-area">
      <NavGroup
        v-for="(section, sIdx) in sections"
        :key="sIdx"
        :label="section.label ?? undefined"
      >
        <NavItem
          v-for="item in section.items"
          :key="`${item.to}-${item.label}`"
          :label="item.label"
          :to="item.to"
          :icon="item.iconComponent"
          :exact="Boolean(item.exact)"
        />
      </NavGroup>
    </nav>

    <div v-if="!collapsed" class="footer-text">
      PM System v1.0
    </div>
  </aside>
</template>
