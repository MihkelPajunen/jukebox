<template>
  <div class="field">
    <label class="label" :for="label">{{ capitalize(label) }}</label>
    <div class="control">
      <input
        ref="target"
        @input="updateModelValue"
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
import { ref } from 'vue';
import { useFocus } from '@vueuse/core';
import { capitalize } from '@/utils/functions';

const props = defineProps({
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
  },
  focus: {
    type: Boolean,
    default: false
  }
});

const target = ref();
useFocus(target, { initialValue: props.focus });

const emit = defineEmits(['update:modelValue']);

const updateModelValue = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value.trim());
};
</script>
