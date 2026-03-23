<template>
  <q-page class="registration-page">
    <div class="bg-pattern">
      <div class="diagonal-stripe"></div>
    </div>

    <div class="page-container">
      <header class="hero">
        <div class="hero-content">
          <p class="hero-eyebrow">Proceso de Admisiones {{ currentYear }}</p>
          <h1 class="hero-heading">
            Bienvenido a <span class="heading--accent">Inscripción</span>
          </h1>
          <p class="hero-description">
            Completa el formulario para iniciar tu proceso de inscripción.
          </p>
        </div>
      </header>

      <section class="form-section">
        <div class="form-card">
          <div class="form-card__header">
            <h2 class="form-card__title">Datos del Aspirante</h2>
            <div class="form-card__divider"></div>
          </div>

          <q-form @submit="handleSubmit" class="form-body" ref="registrationForm">

            <div class="field-group">
              <p class="field-group__label">Documento de Identidad</p>
              <div class="field-row field-row--split">
                <div class="field-wrapper field-wrapper--wide">
                  <label class="field-label">Tipo</label>
                  <q-select
                    v-model="form.document_type"
                    :options="documentTypes"
                    emit-value
                    map-options
                    outlined
                    dense
                    class="custom-select"
                    :rules="[val => !!val || 'Requerido']"
                  />
                </div>
                <div class="field-wrapper field-wrapper--wide">
                  <label class="field-label">Número de Documento</label>
                  <q-input
                    v-model="form.document_number"
                    outlined
                    dense
                    placeholder="Ej: 1234567890"
                    class="custom-input"
                    :rules="[val => !!val || 'Requerido']"
                  />
                </div>
              </div>
            </div>

            <!-- Name row -->
            <div class="field-group">
              <p class="field-group__label">Información Personal</p>
              <div class="field-row field-row--split">
                <div class="field-wrapper">
                  <label class="field-label">Nombre</label>
                  <q-input
                    v-model="form.name"
                    outlined
                    dense
                    placeholder="Ej: Luis"
                    class="custom-input"
                    :rules="[val => !!val || 'Requerido']"
                  />
                </div>
                <div class="field-wrapper">
                  <label class="field-label">Apellido</label>
                  <q-input
                    v-model="form.last_name"
                    outlined
                    dense
                    placeholder="Ej: Perea"
                    class="custom-input"
                    :rules="[val => !!val || 'Requerido']"
                  />
                </div>
              </div>
            </div>

            <!-- Gender & Phone -->
            <div class="field-group">
              <div class="field-row field-row--split">
                <div class="field-wrapper">
                  <label class="field-label">Género</label>
                  <q-select
                    v-model="form.gender"
                    :options="genderOptions"
                    emit-value
                    map-options
                    outlined
                    dense
                    class="custom-select"
                    :rules="[val => !!val || 'Requerido']"
                  />
                </div>
                <div class="field-wrapper">
                  <label class="field-label">Teléfono</label>
                  <q-input
                    v-model="form.phone"
                    outlined
                    dense
                    placeholder="(300) 100-1000"
                    mask="(###) ###-####"
                    class="custom-input"
                    :rules="[val => !!val || 'Requerido']"
                  >
                    <template #prepend>
                      <q-icon name="phone" size="xs" class="input-icon" />
                    </template>
                  </q-input>
                </div>
              </div>
            </div>

            <!-- Email -->
            <div class="field-group">
              <div class="field-row">
                <div class="field-wrapper field-wrapper--full">
                  <label class="field-label">Correo Electrónico</label>
                  <q-input
                    v-model="form.email"
                    type="email"
                    outlined
                    dense
                    placeholder="correo@ejemplo.com"
                    class="custom-input"
                    :rules="[
                      val => !!val || 'Requerido',
                      val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Correo inválido'
                    ]"
                  >
                    <template #prepend>
                      <q-icon name="mail" size="xs" class="input-icon" />
                    </template>
                  </q-input>
                </div>
              </div>
            </div>

            <!-- Program & Applicant type -->
            <div class="field-group">
              <p class="field-group__label">Programa Académico</p>
              <div class="field-row field-row--split">
                <div class="field-wrapper field-wrapper--wide">
                  <label class="field-label">Programa</label>
                  <q-select
                    v-model="form.program"
                    :options="programOptions"
                    outlined
                    dense
                    use-input
                    input-debounce="0"
                    @filter="filterPrograms"
                    class="custom-select"
                    :rules="[val => !!val || 'Requerido']"
                  >
                    <template #no-option>
                      <q-item>
                        <q-item-section class="text-grey">Sin resultados</q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div class="field-wrapper">
                  <label class="field-label">Tipo de Aspirante</label>
                  <q-select
                    v-model="form.applicant_type"
                    :options="applicantTypes"
                    emit-value
                    map-options
                    outlined
                    dense
                    class="custom-select"
                    :rules="[val => !!val || 'Requerido']"
                  />
                </div>
              </div>
            </div>

            <!-- Submit -->
            <div class="submit-row">
              <q-btn
                type="submit"
                label="Enviar Inscripción"
                :loading="loading"
                class="submit-btn"
                no-caps
                unelevated
              >
                <template #loading>
                  <q-spinner-dots color="white" size="1.2em" />
                </template>
              </q-btn>
            </div>

          </q-form>
        </div>
      </section>

      <footer class="page-footer">
        <span>© {{ currentYear }} Universidad de Santander · Todos los derechos reservados</span>
      </footer>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue'
import { useQuasar } from 'quasar'

interface RegistrationForm {
  document_type: string
  document_number: string
  name: string
  last_name: string
  gender: string
  phone: string
  email: string
  program: string
  applicant_type: string
}

export default defineComponent({
  name: 'RegistrationPage',

  setup() {
    const $q = useQuasar()
    const registrationForm = ref()
    const loading = ref(false)
    const currentYear = computed(() => new Date().getFullYear())

    const form = reactive<RegistrationForm>({
      document_type: 'TI',
      document_number: '',
      name: '',
      last_name: '',
      gender: '',
      phone: '',
      email: '',
      program: '',
      applicant_type: '',
    })

    const documentTypes = [
      { label: 'Tarjeta de Identidad (TI)', value: 'TI' },
      { label: 'Cédula de Ciudadanía (CC)', value: 'CC' },
      { label: 'Cédula de Extranjería (CE)', value: 'CE' },
      { label: 'Pasaporte (PP)', value: 'PP' },
    ]

    const genderOptions = [
      { label: 'Femenino', value: 'F' },
      { label: 'Masculino', value: 'M' },
      { label: 'No binario', value: 'NB' },
      { label: 'Prefiero no indicar', value: 'NA' },
    ]

    const allPrograms = [
      'Administración de Empresas', 'Antropología', 'Arquitectura',
      'Biología', 'Ciencia Política', 'Contaduría Pública',
      'Derecho', 'Economía', 'Enfermería',
      'Física', 'Geología', 'Historia',
      'Ingeniería Civil', 'Ingeniería de Sistemas', 'Ingeniería Eléctrica',
      'Ingeniería Industrial', 'Ingeniería Mecánica', 'Lingüística',
      'Matemáticas', 'Medicina', 'Odontología',
      'Psicología', 'Química', 'Sociología',
      'Trabajo Social', 'Veterinaria',
    ]

    const programOptions = ref([...allPrograms])

    const filterPrograms = (val: string, update: (fn: () => void) => void) => {
      update(() => {
        const needle = val.toLowerCase()
        programOptions.value = allPrograms.filter(p =>
          p.toLowerCase().includes(needle)
        )
      })
    }

    const applicantTypes = [
      { label: 'Nuevo Nacional', value: 'nuevo_nacional' },
      { label: 'Nuevo Extranjero', value: 'nuevo_extranjero' },
      { label: 'Traslado', value: 'traslado' },
      { label: 'Reingreso', value: 'reingreso' },
    ]

    const handleSubmit = async () => {
      const valid = await registrationForm.value?.validate()
      if (!valid) return

      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1800))

        $q.notify({
          type: 'positive',
          message: '¡Inscripción enviada exitosamente!',
          caption: 'Recibirás un correo de confirmación pronto.',
          position: 'top',
          timeout: 4000,
          icon: 'check_circle',
        })

        registrationForm.value?.resetValidation()
        Object.assign(form, {
          document_type: 'TI', document_number: '', name: '', last_name: '',
          gender: '', phone: '', email: '', program: '', applicant_type: '',
        })
      } finally {
        loading.value = false
      }
    }

    return {
      form, registrationForm, loading, currentYear,
      documentTypes, genderOptions, programOptions, filterPrograms,
      applicantTypes, handleSubmit,
    }
  },
})
</script>

<style lang="scss">
// ─── Tokens ───────────────────────────────────────────────────────────────────
$primary:    #0D1B3E;
$gold:       #C8A951;
$gold-light: #E2C97A;
$cream:      #FAF7F0;
$white:      #FFFFFF;
$border:     #D1D5DB;
$text-dark:  #111827;
$text-mid:   #374151;
$text-muted: #6B7280;
$navy-light: #1E3265;

$font-display: 'Playfair Display', Georgia, serif;
$font-body:    'DM Sans', sans-serif;

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

// ─── Page ─────────────────────────────────────────────────────────────────────
.registration-page {
  min-height: 100vh;
  background: $cream;
  font-family: $font-body;
  color: $text-dark;
  position: relative;
  overflow-x: hidden;
}

// ─── Background ───────────────────────────────────────────────────────────────
.bg-pattern {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.diagonal-stripe {
  position: absolute;
  top: 0; right: 0;
  width: 420px; height: 6px;
  background: linear-gradient(90deg, transparent, $gold 40%, $gold-light);
  transform: rotate(-45deg) translate(160px, -80px);
  transform-origin: right top;
  opacity: 0.5;
}

// ─── Container — centrado, columna única ──────────────────────────────────────
.page-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 48px 24px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
.hero {
  width: 100%;
  text-align: center;
  padding-bottom: 32px;
}
.hero-eyebrow {
  font-size: 0.74rem;
  font-weight: 600;
  color: $gold;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 0 0 10px;
}
.hero-heading {
  font-family: $font-display;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  color: $primary;
  white-space: nowrap;   // ← una sola línea
  margin: 0 0 12px;
  line-height: 1.1;
}
.heading--accent {
  color: $gold;
}
.hero-description {
  font-size: 0.93rem;
  color: $text-muted;
  line-height: 1.7;
  margin: 0;
}

// ─── Form section (ocupa todo el ancho del contenedor) ────────────────────────
.form-section {
  width: 100%;
}

// ─── Form Card ────────────────────────────────────────────────────────────────
.form-card {
  background: $white;
  border-radius: 14px;
  border: 1px solid rgba($border, 0.8);
  box-shadow: 0 4px 40px rgba($primary, 0.07), 0 1px 4px rgba($primary, 0.04);
  overflow: hidden;
}
.form-card__header {
  background: $primary;
  padding: 24px 32px 20px;
}
.form-card__title {
  font-family: $font-display;
  font-size: 1.3rem;
  font-weight: 700;
  color: $white;
  margin: 0 0 14px;
}
.form-card__divider {
  height: 2px;
  background: linear-gradient(90deg, $gold, transparent);
  border-radius: 1px;
}

.form-body {
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

// ─── Fields ───────────────────────────────────────────────────────────────────
.field-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.field-group__label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: $primary;
  margin: 0;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba($primary, 0.08);
}
.field-row {
  display: flex;
  gap: 14px;
  &--split { flex-wrap: wrap; }
}
.field-wrapper {
  flex: 1;
  min-width: 140px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  &--narrow { flex: 0 0 130px; }
  &--wide   { flex: 2; }
  &--full   { flex: 1 1 100%; }
}
.field-label {
  font-size: 0.76rem;
  font-weight: 600;
  color: $text-mid;
}

// ─── Quasar overrides ─────────────────────────────────────────────────────────
.custom-input,
.custom-select {
  .q-field__control {
    border-radius: 8px !important;
    background: #FAFAFA !important;
    border-color: $border !important;
    transition: border-color 0.2s, box-shadow 0.2s;
    &:hover { border-color: rgba($primary, 0.4) !important; }
  }
  &.q-field--focused .q-field__control {
    border-color: $primary !important;
    box-shadow: 0 0 0 3px rgba($primary, 0.1) !important;
    background: $white !important;
  }
  .q-field__native,
  .q-field__input {
    font-family: $font-body !important;
    font-size: 0.88rem !important;
    color: $text-dark !important;
  }
}
.input-icon { color: $text-muted; }

// ─── Submit ───────────────────────────────────────────────────────────────────
.submit-row {
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
}
.submit-btn {
  background: $primary !important;
  color: $white !important;
  font-family: $font-body !important;
  font-size: 0.88rem !important;
  font-weight: 600 !important;
  letter-spacing: 0.03em !important;
  padding: 13px 38px !important;
  border-radius: 8px !important;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s !important;

  &:hover:not(:disabled) {
    background: $navy-light !important;
    box-shadow: 0 6px 24px rgba($primary, 0.25) !important;
    transform: translateY(-1px) !important;
  }
  &:active:not(:disabled) { transform: translateY(0) !important; }
}

// ─── Footer ───────────────────────────────────────────────────────────────────
.page-footer {
  width: 100%;
  text-align: center;
  padding: 24px 0 0;
  font-size: 0.73rem;
  color: $text-muted;
  border-top: 1px solid rgba($border, 0.6);
  margin-top: 36px;
}
</style>
