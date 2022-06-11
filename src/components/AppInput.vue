<template>
  <div class="field">
    <label class="label" :for="label">{{ capitalize(label) }}</label>
    <div class="control">
      <input
        @input="$emit('update:modelValue', updateModelValue($event))"
        :value="modelValue"
        :id="label"
        :placeholder="placeholder"
        class="input"
        type="text"
        required
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { capitalize } from '@/utils/functions';

defineProps({
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: String
  },
  placeholder: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const updateModelValue = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value.trim());
};
</script>
