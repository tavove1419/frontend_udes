<template>
  <q-layout view="lhr lpR fff">
    <q-page-container>
      <HeaderComponent />
      <router-view />
      <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
        <q-btn fab icon="keyboard_arrow_up" color="blue-grey-10" />
      </q-page-scroller>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
  import HeaderComponent from 'src/components/HeaderComponent.vue';

</script>
<style>
  .img-size {
    width: 32px;
    height: 32px;
  }

  .custom-button:hover {
    background-color: #004D40;
    color: #fff
  }
</style>

