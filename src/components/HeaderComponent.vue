<template>
  <!-- Barra de navegación moderna -->
  <q-header elevated class="modern-header">
    <q-toolbar class="toolbar-container">
      <!-- Logo y marca -->
      <div class="logo-section">
        <img class="logo-avatar" src="../assets/logoudes.png" alt="UDES Logo">
      </div>

      <q-space />

      <nav class="desktop-nav gt-sm">
        <q-btn
          flat
          no-caps
          label="Inicio"
          to="/"
          class="nav-btn"
          :class="{ 'nav-btn-active': $route.path === '/' }"
        />
      </nav>

      <!-- Botón de acción principal -->
      <q-btn
        unelevated
        to="/login"
        label="Iniciar Sesión"
        icon-right="login"
        class="login-btn gt-sm"
      />

      <q-btn
        flat
        round
        icon="menu"
        class="menu-btn lt-md"
        @click="drawerRight = !drawerRight"
      >
        <q-tooltip>Menú</q-tooltip>
      </q-btn>
    </q-toolbar>
  </q-header>

  <!-- Menú lateral moderno para móvil -->
  <q-drawer
    v-model="drawerRight"
    side="right"
    bordered
    :width="280"
    :breakpoint="992"
    class="modern-drawer"
  >
    <!-- Header del drawer -->
    <div class="drawer-header">
      <q-avatar size="50px">
        <img src="../assets/logoudes.png" alt="UDES Logo">
      </q-avatar>
      <q-btn
        flat
        round
        dense
        icon="close"
        @click="drawerRight = false"
        class="close-btn"
      />
    </div>

    <q-separator />

    <q-scroll-area class="drawer-scroll">
      <q-list padding class="drawer-list">
        <q-item
          clickable
          to="/"
          @click="cerrarDrawer"
          v-ripple
          class="drawer-item"
          :class="{ 'drawer-item-active': $route.path === '/' }"
        >
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>Inicio</q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <q-item
          clickable
          to="/login"
          v-ripple
          @click="cerrarDrawer"
          class="drawer-item drawer-item-login"
        >
          <q-item-section avatar>
            <q-icon name="login" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">Iniciar Sesión</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const drawerRight = ref(false);

function cerrarDrawer() {
  drawerRight.value = false;
}
</script>

<style scoped lang="scss">

</style>
