<script lang="ts" src="./FormField.ts"></script>

<template>
  <div class="form-field">
    <label
      v-if="label"
      :for="id"
      class="field-label"
    >
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>

    <BaseInput
      :id="id"
      :model-value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :error="error"
      :disabled="disabled"
      :size="size"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <template v-if="$slots.prefix" #prefix>
        <slot name="prefix" />
      </template>
      <template v-if="$slots.suffix" #suffix>
        <slot name="suffix" />
      </template>
    </BaseInput>

    <p v-if="hint && !error" class="hint-text">{{ hint }}</p>
  </div>
</template>

