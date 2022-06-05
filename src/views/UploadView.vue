<template>
  <div class="upload" data-aos="fade-up">
    <form @submit.prevent="submit">
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
              v-model.trim="data.artist"
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
              v-model.trim="data.title"
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
              v-model.trim="data.album"
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
              <button class="button is-info" type="submit">Submit</button>
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

const data = ref({
  artist: undefined,
  title: undefined,
  album: undefined,
  file: null as File | null
});

const fileName = computed(() => (data.value.file?.name ? data.value.file.name : ''));

const attachFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  data.value.file = (target.files as FileList)[0];
};

const storeNotifications = useStoreNotifications();

const submit = () => storeNotifications.add('is-success', 'Form data was submitted.');
</script>

<style scoped lang="sass">
.box
  max-width: 402px
</style>
