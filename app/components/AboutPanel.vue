<script setup lang="ts">
import { site, img } from '~/data/site'
</script>

<template>
  <div class="about">
    <h2 class="title display">Who's Afeez?</h2>
    <div class="cols">
      <div class="bio">
        <p v-for="(p, i) in site.bio" :key="i">{{ p }}</p>
      </div>
      <img class="portrait" :src="img(30)" alt="Portrait of Afeez (placeholder)" loading="lazy">
    </div>
    <dl class="info">
      <div><dt class="mono grey">Based</dt><dd>{{ site.location }}</dd></div>
      <div><dt class="mono grey">Email</dt><dd><a :href="`mailto:${site.email}`" class="hover-fade">{{ site.email }}</a></dd></div>
      <div>
        <dt class="mono grey">Social</dt>
        <dd><a v-for="s in site.socials" :key="s.label" :href="s.href" target="_blank" rel="noopener" class="hover-fade social">{{ s.label }}</a></dd>
      </div>
      <div><dt class="mono grey">Previous clients</dt><dd>{{ site.previousClients.join(', ') }}</dd></div>
    </dl>
  </div>
</template>

<style scoped>
.title { font-size: 11rem; margin-bottom: 4rem; }
.cols { display: grid; grid-template-columns: 3fr 2fr; gap: 3rem; align-items: start; }
.bio { display: grid; gap: 1.6rem; font-size: 2.4rem; line-height: 1.15; letter-spacing: -0.02em; font-weight: 500; }
.portrait { width: 100%; aspect-ratio: 2 / 3; object-fit: cover; }
.info { display: grid; gap: 2rem; margin-top: 6rem; max-width: 60rem; }
.info dt { margin-bottom: .4rem; }
.social { margin-right: 1.6rem; }
@media (max-width: 767px) {
  .title { font-size: 6rem; }
  .cols { grid-template-columns: 1fr; }
  .bio { font-size: 2rem; }
}
</style>
