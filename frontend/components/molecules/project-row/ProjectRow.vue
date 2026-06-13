<script lang="ts" src="./ProjectRow.ts"></script>

<template>
  <tr class="project-row" tabindex="0" @click="onSelect" @keydown.enter.prevent="onSelect" @keydown.space.prevent="onSelect">
    <td class="cell cell-number">{{ no }}</td>

    <td class="cell">
      <span class="project-name">{{ name }}</span>
    </td>

    <td class="cell">
      <div class="team-stack">
        <BaseAvatar
          v-for="(member, i) in team.slice(0, 4)"
          :key="i"
          :name="member.name"
          :src="member.avatar"
          size="sm"
          class="team-avatar"
        />
        <div
          v-if="team.length > 4"
          class="more-count"
        >
          +{{ team.length - 4 }}
        </div>
      </div>
    </td>

    <td class="cell deadline">{{ deadline }}</td>

    <td class="cell">
      <BaseBadge :variant="statusMap[status].variant" dot>
        {{ statusMap[status].label }}
      </BaseBadge>
    </td>

    <td v-if="progress !== undefined" class="cell progress-cell">
      <div class="progress-wrap">
        <div class="progress-track">
          <div
            class="progress-fill"
            :style="{ width: `${progress}%` }"
          />
        </div>
        <span class="progress-label">{{ progress }}%</span>
      </div>
    </td>
  </tr>
</template>

