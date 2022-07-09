<template>
  <div class="field has-addons">
    <div class="control is-expanded">
      <input
        @input="updateModelValue"
        ref="target"
        :value="modelValue"
        class="input"
        type="text"
        :placeholder="placeholder"
      />
    </div>
    <div class="control">
      <a @click="target.focus()" class="button is-info">
        <FontAwesome class="mr-2" icon="search" />Search
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useFocus } from '@vueuse/core';

const props = defineProps({
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
