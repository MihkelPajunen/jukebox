<template>
  <div class="upload" data-aos="fade-up">
    <form @submit.prevent="uploadFile">
      <div class="box mx-auto">
        <div class="level">
          <div class="level-item">
            <h1 class="title is-size-4">Upload</h1>
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
        <progress v-show="progress > 0" class="progress is-info" :value="progress" max="100" />
        <div class="field">
          <div class="level">
            <div class="level-item">
              <button v-if="progress === 0" class="button is-info" type="submit">Submit</button>
              <button v-else @click="cancelUpload" class="button" type="submit">Cancel</button>
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
import { capitalize } from '@/utils/functions';
import axios from 'axios';

import type { Form } from '@/types/Form';

const form = ref<Form>({
  artist: undefined,
  title: undefined,
  album: undefined,
  file: null
});

const fileName = computed(() => (form.value.file?.name ? form.value.file.name : ''));

const attachFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  form.value.file = (target.files as FileList)[0];
};

const storeNotifications = useStoreNotifications();

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

const clearForm = () => {
  form.value.artist = undefined;
  form.value.title = undefined;
  form.value.album = undefined;
  form.value.file = null;
};

const progress = ref(0);

let controller: AbortController;

const uploadFile = async () => {
  if (formIsValid()) {
    const formData = new FormData();

    formData.append('artist', capitalize(form.value.artist || ''));
    formData.append('title', capitalize(form.value.title || ''));
    formData.append('album', capitalize(form.value.album || ''));
    formData.append('file', form.value.file || '');

    controller = new AbortController();

    const config = {
      signal: controller.signal,
      onUploadProgress: (event: ProgressEvent) => {
        progress.value = Math.round((event.loaded / event.total) * 100);
      }
    };

    try {
      await axios.post(`${import.meta.env.VITE_APP_API}/upload`, formData, config);
      storeNotifications.add('is-success', 'Upload has completed.');
      progress.value = 0;
    } catch (error) {
      // TODO
    }

    clearForm();
  }
};

const cancelUpload = () => {
  controller.abort();
  storeNotifications.add('is-warning', 'Upload was cancelled.');
  progress.value = 0;
  clearForm();
};
</script>

<style scoped lang="sass">
.box
  max-width: 402px
</style>
