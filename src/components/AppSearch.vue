<template>
  <div class="field has-addons">
    <div class="control is-expanded">
      <input class="input" type="text" :placeholder="placeholder" :disabled="disabled" />
    </div>
    <div class="control">
      <a class="button is-info"><FontAwesome class="mr-2" icon="search" />Search</a>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  placeholder: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    required: true
  }
});
</script>
