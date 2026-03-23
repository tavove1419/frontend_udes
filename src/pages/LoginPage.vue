<template>
  <q-page class="login-page">
    <!-- Background -->
    <div class="bg-left"></div>
    <div class="bg-right"></div>
    <div class="bg-accent-bar"></div>

    <div class="login-container">

      <!-- Left panel — branding -->
      <div class="brand-panel">
        <div class="brand-inner">
          <div class="brand-name">
            <span class="brand-title">UNIVERSIDAD</span>
            <span class="brand-sub">DE SANTANDER</span>
          </div>
          <div class="brand-divider"></div>
          <p class="brand-tagline">
            Portal de <strong>Admisiones</strong>
          </p>
          <p class="brand-caption">
            Accede con tu cuenta institucional para gestionar tu proceso de inscripción.
          </p>
        </div>
        <div class="brand-deco">
          <div class="deco-circle deco-circle--a"></div>
          <div class="deco-circle deco-circle--b"></div>
        </div>
      </div>

      <div class="form-panel">
        <div class="form-card">

          <div class="form-card__top">
            <p class="form-eyebrow">Bienvenido de nuevo</p>
            <h1 class="form-title">Iniciar Sesión</h1>
            <p class="form-subtitle">Ingresa tus credenciales para continuar</p>
          </div>

          <q-form @submit="handleLogin" class="form-body">

            <div class="field-wrapper">
              <label class="field-label">Correo Electrónico</label>
              <q-input
                v-model="form.email.value"
                type="email"
                outlined
                dense
                placeholder="correo@udes.edu.co"
                class="custom-input"
                :rules="[
                  val => !!val || 'El correo es requerido',
                  val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Correo inválido'
                ]"
              >
                <template #prepend>
                  <q-icon name="mail_outline" class="field-icon" />
                </template>
              </q-input>
            </div>

            <div class="field-wrapper">
              <div class="label-row">
                <label class="field-label">Contraseña</label>
              </div>
              <q-input
                v-model="form.password.value"
                :type="showPassword ? 'text' : 'password'"
                outlined
                dense
                placeholder="••••••••"
                class="custom-input"
                :rules="[val => !!val || 'La contraseña es requerida']"
              >
                <template #prepend>
                  <q-icon name="lock_outline" class="field-icon" />
                </template>
                <template #append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="toggle-icon"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>
            </div>

            <!-- Submit -->
            <q-btn
              type="submit"
              label="Ingresar"
              :loading="loading"
              class="login-btn"
              no-caps
              unelevated
            >
              <template #loading>
                <q-spinner-dots color="white" size="1.2em" />
              </template>
            </q-btn>

            <p class="register-hint">
              <a href="/" class="register-link">Regresar al inicio</a>
            </p>

          </q-form>
        </div>

        <p class="panel-footer">
          © {{ currentYear }} Universidad de Santander · Todos los derechos reservados
        </p>
      </div>

    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { authentication } from 'src/services';
import { useAuthStore } from 'src/stores/auth-store';
import { Credentials } from 'src/interfaces';

const $q = useQuasar()
const router = useRouter()
const store = useAuthStore()
const form = ref({
  email: {
    value: '',
    email: true,
    require: true
  },
  password: {
    value: '',
    require: true
  }
})
const loading = ref(false)
const showPassword = ref(false)
const currentYear = computed(() => new Date().getFullYear())


async function handleLogin() {
  loading.value = true
  const credentials = {
    email: form.value.email.value,
    password: form.value.password.value
  }
  authentication(credentials).then((response) => {
    store.successLogin(response.data)
    router.push({name: 'Application'})
  }).catch((err) => {
    notify(err.message || 'Verifique credenciales de acceso', 'negative')
  }).finally(() => loading.value = false)
}

function notify(msg: string, type: string) {
  $q.notify({
    message: msg,
    type: type,
    position: 'top',
    color: type === 'positive' ? 'green' : type === 'negative' ? 'red' : 'orange',
    textColor: 'white',
    icon: type === 'positive' ? 'check_circle' : type === 'negative' ? 'error' : 'warning',
    timeout: 5000
  })
}

</script>

<style lang="scss">

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  font-family: $font-body;
  position: relative;
  overflow: hidden;
}

.bg-left {
  position: fixed;
  inset: 0 50% 0 0;
  background: $primary;
  z-index: 0;
}
.bg-right {
  position: fixed;
  inset: 0 0 0 50%;
  background: $cream;
  z-index: 0;
}
.bg-accent-bar {
  position: fixed;
  left: 50%;
  top: 0; bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, $gold, $gold-light 50%, transparent);
  z-index: 2;
  transform: translateX(-50%);
}

.login-container {
  position: relative;
  z-index: 3;
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  min-height: 100vh;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    .brand-panel { display: none; }
  }
}

.brand-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 48px;
  position: relative;
  overflow: hidden;
}

.brand-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
}

.logo-emblem {
  width: 72px; height: 72px;
  background: rgba($white, 0.06);
  border: 1px solid rgba($gold, 0.3);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  svg { width: 46px; height: 46px; }
}

.brand-name {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 24px;
}
.brand-title {
  font-family: $font-display;
  font-size: 1.3rem;
  font-weight: 800;
  color: $white;
  letter-spacing: 0.12em;
  line-height: 1;
}
.brand-sub {
  font-size: 0.78rem;
  font-weight: 500;
  color: rgba($white, 0.6);
  letter-spacing: 0.08em;
}
.brand-year {
  font-size: 0.66rem;
  color: $gold;
  font-weight: 500;
  letter-spacing: 0.05em;
  margin-top: 4px;
}

.brand-divider {
  width: 40px; height: 2px;
  background: $gold;
  border-radius: 1px;
  margin-bottom: 24px;
}

.brand-tagline {
  font-family: $font-display;
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  color: rgba($white, 0.85);
  line-height: 1.2;
  margin: 0 0 18px;
  strong {
    color: $white;
    display: block;
  }
}

.brand-caption {
  font-size: 0.85rem;
  color: rgba($white, 0.5);
  line-height: 1.7;
  max-width: 280px;
  margin: 0;
}

.form-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 48px;
  gap: 24px;

  @media (max-width: 480px) { padding: 40px 20px; }
}

.form-card {
  width: 100%;
  max-width: 400px;
  background: $white;
  border-radius: 16px;
  border: 1px solid rgba($border, 0.7);
  box-shadow: 0 8px 48px rgba($primary, 0.1), 0 2px 8px rgba($primary, 0.05);
  overflow: hidden;
}

.form-card__top {
  padding: 32px 32px 0;
}
.form-eyebrow {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: $gold;
  margin: 0 0 8px;
}
.form-title {
  font-family: $font-display;
  font-size: 1.9rem;
  font-weight: 800;
  color: $primary;
  margin: 0 0 6px;
  line-height: 1.1;
}
.form-subtitle {
  font-size: 0.83rem;
  color: $text-muted;
  margin: 0;
}

.form-body {
  padding: 28px 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.field-label {
  font-size: 0.76rem;
  font-weight: 600;
  color: $text-mid;
}
.forgot-link {
  font-size: 0.72rem;
  color: $gold;
  font-weight: 500;
  text-decoration: none;
  &:hover { text-decoration: underline; }
}

.custom-input {
  .q-field__control {
    border-radius: 10px !important;
    background: #F9FAFB !important;
    border-color: $border !important;
    transition: border-color 0.2s, box-shadow 0.2s;
    &:hover { border-color: rgba($primary, 0.35) !important; }
  }
  &.q-field--focused .q-field__control {
    border-color: $primary !important;
    box-shadow: 0 0 0 3px rgba($primary, 0.1) !important;
    background: $white !important;
  }
  .q-field__native {
    font-family: $font-body !important;
    font-size: 0.9rem !important;
    color: $text-dark !important;
  }
}
.field-icon  { color: $text-muted; font-size: 1.1rem; }
.toggle-icon { color: $text-muted; font-size: 1.1rem; cursor: pointer;
  &:hover { color: $primary; }
}

.login-btn {
  width: 100% !important;
  background: $primary !important;
  color: $white !important;
  font-family: $font-body !important;
  font-size: 0.92rem !important;
  font-weight: 600 !important;
  letter-spacing: 0.04em !important;
  padding: 14px !important;
  border-radius: 10px !important;
  margin-top: 4px;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s !important;

  &:hover:not(:disabled) {
    background: $navy-light !important;
    box-shadow: 0 6px 24px rgba($primary, 0.28) !important;
    transform: translateY(-1px) !important;
  }
  &:active:not(:disabled) { transform: translateY(0) !important; }
}

.register-hint {
  text-align: center;
  font-size: 0.8rem;
  color: $text-muted;
  margin: 0;
}
.register-link {
  color: $primary;
  font-weight: 600;
  text-decoration: none;
  &:hover { text-decoration: underline; color: $gold; }
}

.panel-footer {
  font-size: 0.7rem;
  color: $text-muted;
  text-align: center;
  margin: 0;
}
</style>
