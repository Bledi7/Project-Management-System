<script lang="ts" src="./BaseInput.ts"></script>

<template>
  <div class="input-wrap">
    <!-- Prefix slot -->
    <div
      v-if="$slots.prefix"
      class="input-slot prefix-slot"
    >
      <slot name="prefix" />
    </div>

    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      @input="onInput"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
      :class="[
        'input-control',
        `size-${size}`,
        error ? 'has-error' : 'is-default',
        $slots.prefix ? 'with-prefix' : 'without-prefix',
        $slots.suffix ? 'with-suffix' : 'without-suffix',
        disabled && 'is-disabled',
      ]"
    />

    <!-- Suffix slot -->
    <div
      v-if="$slots.suffix"
      class="input-slot suffix-slot"
    >
      <slot name="suffix" />
    </div>

    <p v-if="error" class="error-text">{{ error }}</p>
  </div>
</template>

