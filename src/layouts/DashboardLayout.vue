<template>
  <div>
    <q-layout view="hHh Lpr lff">
      <q-header elevated class="bg-primary text-white">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
          <q-toolbar-title class="user-name text-right">
            {{store.userInfo?.email}} {{store.userInfo?.role}}
          </q-toolbar-title>
          <div class="q-pr-xs">
            <q-btn round flat icon="ion-log-out" @click="logout">
              <q-tooltip>Cerrar sesión</q-tooltip>
            </q-btn>
          </div>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above
        :mini="miniState"
        :width="200"
        :breakpoint="500"
        bordered
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-white'"
      >
        <q-scroll-area class="fit">
          <q-list class="rounded-borders">
            <q-item
              clickable
              v-ripple
              :to="{ name: 'Application' }"
              exact
            >
              <q-item-section avatar class="avatar-menu">
                <q-icon name="edit" />
              </q-item-section>
              <q-item-section> Incripciones </q-item-section>
            </q-item>
          </q-list>
          <div class="switch-dark-mode text-center">
            <q-toggle
              v-model="isDarkMode"
              color="primary"
              @update:model-value="$q.dark.toggle()"
              :label="!miniState ? 'Modo oscuro' : ''"
              left-label
            />
          </div>
        </q-scroll-area>
      </q-drawer>

      <q-page-container class="absolute full-width full-height">
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth-store';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const isDarkMode = ref<boolean>($q.dark.mode as boolean);
const drawer = ref(false);
const miniState = ref(false);
const store = useAuthStore()
const router = useRouter()


function logout(): void {
  $q.loading.show({
    message: 'Cerrando sesión...'
  })
  store.logOut()
  void router.push({path: '/login'})
  $q.loading.hide()
}

</script>

<style lang="scss">
.q-item.q-router-link--active,
.q-item--active {
  background-color: #011f34;
  color: #fff !important;
}

.user-name {
  font-size: 14px;
  opacity: 80%;
}

.logo-title {
  height: 40px;
}

.q-item__section--avatar {
  min-width: 30px !important;
}

.q-item__section--side {
  padding-right: 5px;
}

.q-expansion-item__content > .q-list {
  > .q-item {
    padding-left: 40px;
  }

  > .q-expansion-item > .q-expansion-item__container {
    padding-left: 24px;
  }
}

.q-item {
  min-height: 40px;
}

.q-expansion-item__content > .q-item > .q-item__section--main {
  margin-left: 30px;
  display: list-item;
}

.q-expansion-item--expanded {
  background-color: #c7c7c7;
}

// Dark Mode

.q-scrollarea--dark {
  background-color: #011f34;
  color: white;
}

.switch-dark-mode {
  position: sticky;
  top: 90%;
  opacity: 60%;
}

.q-toggle--dark .q-toggle__inner--truthy {
  color: white !important;
}
</style>
