<template>
  <div class="upload" data-aos="fade-up">
    <form @submit.prevent="uploadFile">
      <div class="box mx-auto">
        <div class="level">
          <div class="level-item">
            <h1 class="title is-size-4">Upload</h1>
          </div>
        </div>
        <AppInput v-model="form.artist" label="artist" placeholder="Zero 7" />
        <AppInput v-model="form.title" label="title" placeholder="Give It Away" />
        <AppInput v-model="form.album" label="album" placeholder="Simple Things" />
        <AppUpload v-model="form.file" />
        <Transition name="fade">
          <progress v-show="progress > 0" class="progress is-info" :value="progress" max="100" />
        </Transition>
        <div class="field mt-5">
          <div class="level">
            <div class="level-item">
              <button v-if="progress === 0" class="button is-info" type="submit">Submit</button>
              <button v-else-if="progress === 100" @click="clearForm" class="button">Done</button>
              <button v-else @click="cancelUpload" class="button">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useStoreNotifications } from '@/store/storeNotifications';
import { artistExists, capitalize } from '@/utils/functions';
import axios from 'axios';

import AppInput from '@/components/AppInput.vue';
import AppUpload from '@/components/AppUpload.vue';

import type { Form } from '@/types/Form';

const form = ref<Form>({
  artist: '',
  title: '',
  album: '',
  file: null
});

const storeNotifications = useStoreNotifications();

const formIsValid = () => {
  for (const key of Object.keys(form.value)) {
    if (['', null].some((element) => element === form.value[key as keyof Form])) {
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

const getArtistImage = async (id: string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_APP_API}/spotify/artists/${id}`);
    return response.data?.artist?.imageUrl ?? '';
  } catch {
    return '';
  }
};

const createArtist = async (artist: { name: string; imageUrl: string }) => {
  const formData = new FormData();
  artist.name && formData.append('name', artist.name);
  artist.imageUrl && formData.append('imageUrl', artist.imageUrl);

  try {
    const response = await axios.post(`${import.meta.env.VITE_APP_API}/artists/new`, formData);
    response.data.success && storeNotifications.add('is-success', 'New artist was created.');
    return response.data?.artist ?? undefined;
  } catch {
    return undefined;
  }
};

const clearForm = () => {
  form.value.artist = '';
  form.value.title = '';
  form.value.album = '';
  form.value.file = null;
};

const progress = ref(0);

watch(form.value, (currentValue) => currentValue.file === null && (progress.value = 0));

let controller: AbortController;

const uploadFile = async () => {
  if (formIsValid()) {
    const formData = new FormData();

    try {
      let url = `${import.meta.env.VITE_APP_API}/spotify`;
      url += `/artists/${form.value.artist}`;
      url += `/tracks/${form.value.title}`;
      url += `?album=${form.value.album}`;

      const response = await axios.get(url);

      if (response.data.success) {
        formData.append('title', response.data.track.title);
        formData.append('album', response.data.track.album.name);
        formData.append('imageUrl', response.data.track.album.imageUrl);

        if (await artistExists(response.data.track.artist.name || form.value.artist)) {
          let url = `${import.meta.env.VITE_APP_API}/artists`;
          url += `/${response.data.track.artist.name || form.value.artist}`;

          const artist = await axios.get(url);
          artist.data?.artist?.id && formData.append('artist', artist.data.artist.id);
        } else {
          const artist = await createArtist({
            name: response.data.track.artist.name ?? form.value.artist,
            imageUrl: await getArtistImage(response.data.track.artist.id)
          });

          artist.data?.artist?.id && formData.append('artist', artist.data.artist.id);
        }
      }
    } catch {
      console.log('Failed to retrieve track data from Spotify.');
    }

    formData.has('artist') || formData.append('artist', capitalize(form.value.artist));
    formData.has('title') || formData.append('title', capitalize(form.value.title));
    formData.has('album') || formData.append('album', capitalize(form.value.album));
    formData.has('imageUrl') || formData.append('imageUrl', '');
    form.value.file && formData.append('file', form.value.file);

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
    } catch (error) {
      if (axios.isAxiosError(error)) {
        storeNotifications.add('is-danger', 'Upload was rejected.');
      }

      clearForm();
    }
  }
};

const cancelUpload = () => {
  controller.abort();
  storeNotifications.add('is-warning', 'Upload was cancelled.');
};
</script>

<style scoped lang="sass">
.box
  max-width: 402px

.fade-enter-active
  transition: opacity 1s ease

.fade-enter-from,
.fade-leave-to
  opacity: 0
</style>
