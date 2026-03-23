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

<script setup lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue'
import { useQuasar } from 'quasar'
import { UserInterface } from 'src/interfaces';
import { saveUser } from 'src/services';

const $q = useQuasar()
const registrationForm = ref()
const loading = ref(false)
const currentYear = computed(() => new Date().getFullYear())
const form = ref<UserInterface>({
  document_type:  <string>'TI',
  document_number:  <string>'',
  name:  <string>'',
  last_name:  <string>'',
  gender:  <string>'',
  phone:  <string>'',
  email:  <string>'',
  program:  <string>'',
  applicant_type:  <string>'',
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
]

const allPrograms = [
  'Administración de Empresas', 'Arquitectura',
  'Biología', 'Ciencia Política', 'Contaduría Pública',
  'Derecho', 'Economía',
  'Física', 'Geología', 'Historia',
  'Ingeniería Civil', 'Ingeniería de Sistemas', 'Ingeniería Eléctrica',
  'Ingeniería Industrial', 'Medicina', 'Odontología',
  'Psicología', 'Química', 'Sociología',
  'Veterinaria',
]

const programOptions = ref([...allPrograms])

function filterPrograms(val: string, update: (fn: () => void) => void) {
  update(() => {
    const needle = val.toLowerCase()
    programOptions.value = allPrograms.filter(p =>
      p.toLowerCase().includes(needle)
    )
  })
}

const applicantTypes = [
  { label: 'Nuevo Nacional', value: 'nuevo_nacional' },
  { label: 'Nuevo Internacional', value: 'nuevo_internacional' },
  { label: 'Transferencia Interna', value: 'transferencia_interna' },
  { label: 'Transferencia Externa', value: 'transferencia_externa' },
]

function handleSubmit() {
  loading.value = true
  saveUser(form.value).then((response) => {
    notify(response.data.message, 'positive', 'check_circle', 'Recibirás un correo de confirmación pronto.')
    clearForm()
  }).catch((err) => {
    notify(err.message ?? 'Error al guardar la inscripción', 'negative', 'warning', '')
  }).finally(() => loading.value = false)
}

function clearForm(): void {
  form.value = {
    applicant_type: '',
    document_number: '',
    document_type: 'TI',
    email: '',
    gender: '',
    last_name: '',
    name: '',
    phone: '',
    program: ''
  }
}

function notify(msg: string, type: string, icons: string, caption: string) {
  $q.notify({
    message: msg,
    icon: icons,
    type: type,
    caption: caption,
    position: 'top',
    timeout: 5000,
  });
}
</script>
<style scoped lang="scss">

</style>
