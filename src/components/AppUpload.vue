<template>
  <div class="field">
    <label class="label" for="file">File</label>
    <div class="file has-name is-fullwidth">
      <label class="file-label">
        <input
          @change="attachFile"
          id="file"
          class="file-input"
          type="file"
          accept="audio/*"
          required
        />
        <span class="file-cta">
          <span class="file-icon">
            <FontAwesome icon="upload" />
          </span>
          <span class="file-label">Browse</span>
        </span>
        <span class="file-name">{{ fileName }}</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: null
  }
});

const emit = defineEmits(['update:modelValue']);

const attachFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', (target.files as FileList)[0]);
};

const fileName = computed(() => (props.modelValue?.name ? props.modelValue.name : ''));
</script>
