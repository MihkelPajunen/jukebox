<template>
  <div class="upload" data-aos="fade-up">
    <form @submit.prevent="submitForm">
      <div class="box mx-auto">
        <div class="level">
          <div class="level-item">
            <h1 class="title is-size-4">Upload track</h1>
          </div>
        </div>
        <div class="field">
          <label class="label" for="artist">Artist</label>
          <div class="control">
            <input
              v-model.trim="form.artist"
              id="artist"
              class="input"
              type="text"
              placeholder="Zero 7"
              required
            />
          </div>
        </div>
        <div class="field">
          <label class="label" for="title">Title</label>
          <div class="control">
            <input
              v-model.trim="form.title"
              id="title"
              class="input"
              type="text"
              placeholder="Give It Away"
              required
            />
          </div>
        </div>
        <div class="field">
          <label class="label" for="album">Album</label>
          <div class="control">
            <input
              v-model.trim="form.album"
              id="album"
              class="input"
              type="text"
              placeholder="Simple Things"
              required
            />
          </div>
        </div>
        <div class="field">
          <label class="label" for="file">File</label>
          <div class="file has-name is-fullwidth">
            <label class="file-label">
              <input
                @change="attachFile"
                id="file"
                class="file-input"
                type="file"
                name="track"
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
        <div class="field">
          <div class="level">
            <div class="level-item">
              <button :class="['button', 'is-info', { 'is-loading': isLoading }]" type="submit">
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStoreNotifications } from '@/store/storeNotifications';
import { useStoreTracks } from '@/store/storeTracks';
import { capitalize } from '@/utils/functions';
import { v4 as uuidv4 } from 'uuid';

import type { Form } from '@/types/Form';

const form = ref<Form>({
  artist: undefined,
  title: undefined,
  album: undefined,
  file: null
});

const storeNotifications = useStoreNotifications();
const storeTracks = useStoreTracks();

const fileName = computed(() => (form.value.file?.name ? form.value.file.name : ''));

const attachFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  form.value.file = (target.files as FileList)[0];
};

const isLoading = ref(false);

const formIsValid = () => {
  for (const key of Object.keys(form.value)) {
    if ([null, undefined, ''].some((element) => element === form.value[key as keyof Form])) {
      return false;
    }
  }

  if (form.value.file?.type && !['audio/flac', 'audio/x-flac'].includes(form.value.file.type)) {
    storeNotifications.add('is-warning', 'Only FLAC files are supported.');
    form.value.file = null;
    return false;
  }

  return true;
};

const submitForm = () => {
  if (formIsValid()) {
    const formData = new FormData();

    formData.append('artist', capitalize(form.value.artist || ''));
    formData.append('title', capitalize(form.value.title || ''));
    formData.append('album', capitalize(form.value.album || ''));
    formData.append('file', form.value.file || '', `${uuidv4()}.flac`);

    isLoading.value = true;
    storeTracks.uploadTrack(formData);
    storeNotifications.add('is-success', 'New file upload has started.');
  }
};
</script>

<style scoped lang="sass">
.box
  max-width: 402px
</style>
