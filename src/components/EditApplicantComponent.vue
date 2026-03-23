<template>
  <q-dialog v-model="dialogOpen" persistent maximized>
    <q-card class="revision-card">

      <q-card-section class="bg-deep-purple-8 text-white row items-center q-py-md">
        <q-icon name="edit_note" size="28px" class="q-mr-sm" />
        <div class="text-h6 text-weight-medium">Editar Inscripción</div>
        <q-space />
        <q-chip
          :color="getStatusApplicantColor(applicant?.status ?? '')"
          text-color="white"
          :label="getStatusApplicantLabel(applicant?.status ?? '')"
          size="sm"
          class="q-mr-md"
        />
        <q-btn icon="close" flat round dense v-close-popup @click="cerrarDialog" />
      </q-card-section>

      <q-card-section class="bg-deep-purple-1 q-py-sm">
        <div class="row items-center q-gutter-sm flex-wrap">
          <q-icon name="person" color="deep-purple-8" />
          <span class="text-weight-bold text-deep-purple-8">{{ user?.name }} {{ user?.last_name }}</span>
          <q-separator vertical inset />
          <q-icon name="school" color="grey-7" size="16px" />
          <span class="text-grey-7 text-caption">{{ applicant?.program }}</span>
          <q-separator vertical inset />
          <q-icon name="badge" color="grey-7" size="16px" />
          <span class="text-grey-7 text-caption">{{ applicant?.applicant_type }}</span>
        </div>
      </q-card-section>

      <q-separator />

      <q-tabs
        v-model="activeTab"
        dense
        align="justify"
        class="bg-white text-grey-7"
        active-color="deep-purple-8"
        indicator-color="deep-purple-8"
      >
        <q-tab name="datos" icon="assignment_ind" label="Datos Personales" />
        <q-tab name="documentos" icon="folder_open" label="Documentos" />
        <q-tab name="encuesta" icon="poll" label="Encuesta" />
      </q-tabs>

      <q-separator />

      <q-card-section class="q-pa-none tab-content-area overflow-auto">
        <q-tab-panels v-model="activeTab" animated>

          <q-tab-panel name="datos" class="q-pa-lg">

            <div class="text-subtitle1 text-weight-bold text-deep-purple-8 q-mb-md row items-center q-gutter-sm">
              <q-icon name="person" />
              <span>Información Personal del Aspirante</span>
            </div>

            <div class="row q-col-gutter-md q-mb-lg">

              <div class="col-12 col-md-4">
                <q-input
                  v-model="form.personal.name"
                  label="Nombre(s)"
                  outlined dense
                  :rules="[val => !!val?.trim() || 'Campo requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="person_outline" color="deep-purple-6" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  v-model="form.personal.last_name"
                  label="Apellido(s)"
                  outlined dense
                  :rules="[val => !!val?.trim() || 'Campo requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" color="deep-purple-6" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-select
                  v-model="form.personal.gender"
                  :options="genderOptions"
                  label="Género"
                  outlined dense
                  emit-value map-options
                  :rules="[val => !!val || 'Campo requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="wc" color="deep-purple-6" />
                  </template>
                </q-select>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  v-model="form.personal.email"
                  label="Correo electrónico"
                  type="email"
                  outlined dense
                  :rules="[
                    val => !!val?.trim() || 'Campo requerido',
                    val => /.+@.+\..+/.test(val) || 'Correo no válido'
                  ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="email" color="deep-purple-6" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  v-model="form.personal.phone"
                  label="Teléfono"
                  outlined dense
                  :rules="[val => !!val?.trim() || 'Campo requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="phone" color="deep-purple-6" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-select
                  v-model="form.personal.document_type"
                  :options="documentTypeOptions"
                  label="Tipo de documento"
                  outlined dense
                  emit-value map-options
                  :rules="[val => !!val || 'Campo requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="badge" color="deep-purple-6" />
                  </template>
                </q-select>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  v-model="form.personal.document_number"
                  label="Número de documento"
                  outlined dense
                  :rules="[val => !!val?.trim() || 'Campo requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="numbers" color="deep-purple-6" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  v-model="form.personal.program"
                  label="Programa académico"
                  outlined dense
                  :rules="[val => !!val?.trim() || 'Campo requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="school" color="deep-purple-6" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-select
                  v-model="form.personal.applicant_type"
                  :options="applicantTypeOptions"
                  label="Tipo de aspirante"
                  outlined dense
                  emit-value map-options
                  :rules="[val => !!val || 'Campo requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="how_to_reg" color="deep-purple-6" />
                  </template>
                </q-select>
              </div>

            </div>

            <q-separator class="q-mb-lg" />

            <div class="text-subtitle1 text-weight-bold text-deep-purple-8 q-mb-md row items-center q-gutter-sm">
              <q-icon name="assignment_ind" />
              <span>Datos Complementarios</span>
            </div>

            <div class="row q-col-gutter-md">

              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.datos.fecha_nacimiento"
                  type="date"
                  label="Fecha de Nacimiento"
                  outlined dense
                  :rules="[val => !!val || 'Campo requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="cake" color="deep-purple-6" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.datos.lugar_nacimiento"
                  label="Lugar de Nacimiento"
                  outlined dense
                  :rules="[val => !!val || 'Campo requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="location_city" color="deep-purple-6" />
                  </template>
                </q-input>
              </div>

              <div class="col-12">
                <q-input
                  v-model="form.datos.direccion_residencia"
                  label="Dirección de Residencia"
                  outlined dense
                  :rules="[val => !!val || 'Campo requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="home" color="deep-purple-6" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-4">
                <q-select
                  v-model="form.datos.estrato"
                  :options="estratoOptions"
                  label="Estrato"
                  outlined dense
                  emit-value map-options
                  :rules="[val => !!val || 'Campo requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="layers" color="deep-purple-6" />
                  </template>
                </q-select>
              </div>

            </div>
          </q-tab-panel>

          <q-tab-panel name="documentos" class="q-pa-lg">
            <div class="text-subtitle1 text-weight-bold text-deep-purple-8 q-mb-md row items-center q-gutter-sm">
              <q-icon name="folder_open" />
              <span>Documentos</span>
            </div>

            <div class="row q-col-gutter-md">

              <div class="col-12 col-md-4">
                <div class="doc-card q-pa-md rounded-borders" :class="fotoPreview || inscripcionData?.docs?.foto ? 'doc-ok' : 'doc-missing'">
                  <div class="text-center">
                    <q-avatar size="90px" class="q-mb-sm foto-preview">
                      <img
                        v-if="fotoPreview || inscripcionData?.docs?.foto"
                        :src="fotoPreview || inscripcionData?.docs?.foto"
                        alt="Foto aspirante"
                      />
                      <q-icon v-else name="hide_image" size="48px" color="grey-4" />
                    </q-avatar>
                    <div class="doc-title q-mb-sm">Foto del Aspirante</div>
                    <q-btn
                      v-if="fotoPreview || inscripcionData?.docs?.foto"
                      label="Ver actual"
                      flat size="xs"
                      color="deep-purple-8"
                      icon="open_in_new"
                      class="q-mb-xs"
                      @click="abrirVisor(fotoPreview || inscripcionData?.docs?.foto || '', 'Foto del Aspirante', 'image')"
                    />
                    <q-file
                      v-model="form.docs.foto"
                      label="Cambiar foto"
                      accept="image/*"
                      outlined dense
                      class="q-mt-sm"
                      @update:model-value="onFotoChange"
                    >
                      <template v-slot:prepend><q-icon name="add_a_photo" /></template>
                    </q-file>
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="doc-card q-pa-md rounded-borders" :class="form.docs.documento_identidad || inscripcionData?.docs?.documento_identidad ? 'doc-ok' : 'doc-missing'">
                  <div class="text-center">
                    <q-icon name="badge" size="48px" color="deep-purple-6" class="q-mb-sm" />
                    <div class="doc-title q-mb-sm">Documento de Identidad</div>
                    <q-btn
                      v-if="inscripcionData?.docs?.documento_identidad"
                      label="Ver PDF actual"
                      flat size="xs"
                      color="deep-purple-8"
                      icon="picture_as_pdf"
                      class="q-mb-xs"
                      @click="abrirVisor(inscripcionData.docs.documento_identidad, 'Documento de Identidad', 'pdf')"
                    />
                    <div v-if="form.docs.documento_identidad" class="text-caption text-positive q-mb-xs">
                      <q-icon name="check_circle" size="14px" /> Nuevo archivo seleccionado
                    </div>
                    <q-file
                      v-model="form.docs.documento_identidad"
                      label="Reemplazar PDF"
                      accept=".pdf"
                      outlined dense
                      class="q-mt-sm"
                    >
                      <template v-slot:prepend><q-icon name="upload_file" /></template>
                    </q-file>
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="doc-card q-pa-md rounded-borders" :class="form.docs.diploma_bachiller || inscripcionData?.docs?.diploma_bachiller ? 'doc-ok' : 'doc-missing'">
                  <div class="text-center">
                    <q-icon name="military_tech" size="48px" color="deep-purple-6" class="q-mb-sm" />
                    <div class="doc-title q-mb-sm">Diploma de Bachiller</div>
                    <q-btn
                      v-if="inscripcionData?.docs?.diploma_bachiller"
                      label="Ver PDF actual"
                      flat size="xs"
                      color="deep-purple-8"
                      icon="picture_as_pdf"
                      class="q-mb-xs"
                      @click="abrirVisor(inscripcionData.docs.diploma_bachiller, 'Diploma de Bachiller', 'pdf')"
                    />
                    <div v-if="form.docs.diploma_bachiller" class="text-caption text-positive q-mb-xs">
                      <q-icon name="check_circle" size="14px" /> Nuevo archivo seleccionado
                    </div>
                    <q-file
                      v-model="form.docs.diploma_bachiller"
                      label="Reemplazar PDF"
                      accept=".pdf"
                      outlined dense
                      class="q-mt-sm"
                    >
                      <template v-slot:prepend><q-icon name="upload_file" /></template>
                    </q-file>
                  </div>
                </div>
              </div>

            </div>

            <q-banner class="bg-blue-1 text-blue-9 q-mt-md rounded-borders">
              <template v-slot:avatar><q-icon name="info" /></template>
              Si no seleccionas un nuevo archivo, se conservará el documento actual cargado.
            </q-banner>
          </q-tab-panel>

          <q-tab-panel name="encuesta" class="q-pa-lg">
            <div class="text-subtitle1 text-weight-bold text-deep-purple-8 q-mb-md row items-center q-gutter-sm">
              <q-icon name="poll" />
              <span>Encuesta de Mercadeo</span>
            </div>

            <div class="row q-col-gutter-md">

              <div class="col-12">
                <q-input
                  v-model="form.encuesta.motivacion"
                  type="textarea"
                  label="¿Cuál es su motivación para estudiar en la Universidad?"
                  outlined
                  :rows="4"
                  counter
                  maxlength="500"
                  :rules="[val => !!val?.trim() || 'Campo requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="emoji_objects" color="deep-purple-6" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-6">
                <q-select
                  v-model="form.encuesta.medio_enterado"
                  :options="medioOptions"
                  label="¿Por qué medio se enteró de la Institución?"
                  outlined dense
                  emit-value map-options
                  :rules="[val => !!val || 'Campo requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="record_voice_over" color="deep-purple-6" />
                  </template>
                </q-select>
              </div>

              <div class="col-12 col-md-6">
                <q-select
                  v-model="form.encuesta.canal_informativo"
                  :options="canalOptions"
                  label="¿Por qué canal informativo se enteró de la Institución?"
                  outlined dense
                  emit-value map-options
                  :rules="[val => !!val || 'Campo requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="cast" color="deep-purple-6" />
                  </template>
                </q-select>
              </div>

            </div>
          </q-tab-panel>

        </q-tab-panels>
      </q-card-section>

      <q-separator />

      <q-card-actions class="q-pa-md bg-grey-1">
        <div class="row full-width items-center q-gutter-sm">
          <q-space />
          <q-btn label="Cancelar" flat color="grey-7" @click="cerrarDialog" />
          <q-btn
            label="Actualizar Inscripción"
            color="deep-purple-8"
            icon="save"
            unelevated
            @click="accionActualizar"
          />
        </div>
      </q-card-actions>
    </q-card>

    <q-dialog v-model="visorDialog" maximized>
      <q-card>
        <q-card-section class="bg-grey-9 text-white row items-center q-py-sm">
          <q-icon name="visibility" class="q-mr-sm" />
          <span class="text-subtitle1">{{ visorTitulo }}</span>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pa-none visor-content">
          <img v-if="visorTipo === 'image'" :src="visorSrc" class="visor-img" alt="Documento" />
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue';
import { useQuasar } from 'quasar';
import type { GetApplicants, UserInterface, InscripcionData } from 'src/interfaces';

const props = defineProps<{
  modelValue: boolean;
  applicant: GetApplicants | null;
  user?: UserInterface | null;
  inscripcionData?: InscripcionData | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'actualizar', payload: {
    applicant_id: string;
    personal: Record<string, string>;
    datos: Record<string, unknown>;
    docs: Record<string, File | null>;
    encuesta: Record<string, string>;
  }): void;
}>();

const $q = useQuasar();
const activeTab = ref('datos');

const visorDialog = ref(false);
const visorSrc = ref('');
const visorTitulo = ref('');
const visorTipo = ref<'image' | 'pdf'>('pdf');

const fotoPreview = ref<string>('');

const form = reactive({
  personal: {
    name:            '',
    last_name:       '',
    gender:          '',
    email:           '',
    phone:           '',
    document_type:   '',
    document_number: '',
    program:         '',
    applicant_type:  '',
  },
  datos: {
    fecha_nacimiento:     '',
    lugar_nacimiento:     '',
    direccion_residencia: '',
    estrato:              '',
  },
  docs: {
    foto:                null as File | null,
    documento_identidad: null as File | null,
    diploma_bachiller:   null as File | null,
  },
  encuesta: {
    motivacion:        '',
    medio_enterado:    '',
    canal_informativo: '',
  },
});

const estratoOptions = [1, 2, 3, 4, 5, 6].map(n => ({ label: `Estrato ${n}`, value: n }));

const genderOptions = [
  { label: 'Femenino', value: 'F' },
  { label: 'Masculino', value: 'M' },
];

const documentTypeOptions = [
  { label: 'Tarjeta de Identidad',  value: 'TI' },
  { label: 'Cédula de Ciudadanía',  value: 'CC' },
  { label: 'Cédula de Extranjería', value: 'CE' },
  { label: 'Pasaporte',             value: 'PA' },
  { label: 'Registro Civil',        value: 'RC' },
];

const applicantTypeOptions = [
  { label: 'Nuevo Nacional', value: 'nuevo_nacional' },
  { label: 'Nuevo Internacional', value: 'nuevo_internacional' },
  { label: 'Transferencia Interna', value: 'transferencia_interna' },
  { label: 'Transferencia Externa', value: 'transferencia_externa' },
];

const medioOptions = [
  { label: 'Visita al colegio o la Institución', value: 'visita_colegio' },
  { label: 'Recomendación',                      value: 'recomendacion' },
  { label: 'Funcionario de la institución',      value: 'funcionario' },
];

const canalOptions = [
  { label: 'Internet',       value: 'internet' },
  { label: 'Radio',          value: 'radio' },
  { label: 'Redes sociales', value: 'redes_sociales' },
  { label: 'Televisión',     value: 'television' },
];

const dialogOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

function getStatusApplicantColor(tipo: string): string {
  const colors: Record<string, string> = {
    'PREI': 'blue', 'FORM': 'brown',       'CORR': 'cyan',
    'FINA': 'deep-orange', 'APRO': 'light-green', 'REJE': 'red', 'ADMI': 'green',
  };
  return colors[tipo] || 'grey';
}

function getStatusApplicantLabel(tipo: string): string {
  const label: Record<string, string> = {
    'PREI': 'Pre-inscripción',      'FORM': 'Diligenciando formulario',
    'CORR': 'Corregir inscripción', 'FINA': 'Inscripción completa',
    'APRO': 'Aprobada',             'REJE': 'Rechazada', 'ADMI': 'Admitido',
  };
  return label[tipo] || tipo;
}

function abrirVisor(src: string, titulo: string, tipo: 'image' | 'pdf') {
  if (tipo === 'pdf') { window.open(src, '_blank'); return; }
  visorSrc.value    = src;
  visorTitulo.value = titulo;
  visorTipo.value   = tipo;
  visorDialog.value = true;
}

function onFotoChange(file: File | null) {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => { fotoPreview.value = e.target?.result as string; };
    reader.readAsDataURL(file);
  } else {
    fotoPreview.value = '';
  }
}

function cargarDatosIniciales() {
  form.personal.name            = props.user?.name            ?? '';
  form.personal.last_name       = props.user?.last_name       ?? '';
  form.personal.gender          = props.user?.gender          ?? '';
  form.personal.email           = props.user?.email           ?? '';
  form.personal.phone           = props.user?.phone           ?? '';
  form.personal.document_type   = props.user?.document_type   ?? '';
  form.personal.document_number = props.user?.document_number ?? '';
  form.personal.program         = props.applicant?.program        ?? '';
  form.personal.applicant_type  = props.applicant?.applicant_type ?? '';

  const d = props.inscripcionData;
  form.datos.fecha_nacimiento    = d?.datos?.fecha_nacimiento     ?? '';
  form.datos.lugar_nacimiento    = d?.datos?.lugar_nacimiento     ?? '';
  form.datos.direccion_residencia= d?.datos?.direccion_residencia ?? '';
  form.datos.estrato             = d?.datos?.estrato              ?? '';
  form.encuesta.motivacion       = d?.encuesta?.motivacion        ?? '';
  form.encuesta.medio_enterado   = d?.encuesta?.medio_enterado    ?? '';
  form.encuesta.canal_informativo= d?.encuesta?.canal_informativo ?? '';

  form.docs.foto                = null;
  form.docs.documento_identidad = null;
  form.docs.diploma_bachiller   = null;
  fotoPreview.value             = '';
}

function accionActualizar() {
  if (
    !form.personal.name?.trim()            ||
    !form.personal.last_name?.trim()       ||
    !form.personal.gender                  ||
    !form.personal.email?.trim()           ||
    !form.personal.phone?.trim()           ||
    !form.personal.document_type           ||
    !form.personal.document_number?.trim() ||
    !form.personal.program?.trim()         ||
    !form.personal.applicant_type
  ) {
    $q.notify({ message: 'Completa todos los datos personales.', type: 'warning', position: 'top', icon: 'warning' });
    activeTab.value = 'datos';
    return;
  }
  if (
    !form.datos.fecha_nacimiento     ||
    !form.datos.lugar_nacimiento     ||
    !form.datos.direccion_residencia ||
    !form.datos.estrato
  ) {
    $q.notify({ message: 'Completa todos los datos complementarios.', type: 'warning', position: 'top', icon: 'warning' });
    activeTab.value = 'datos';
    return;
  }
  if (!form.encuesta.motivacion?.trim() || !form.encuesta.medio_enterado || !form.encuesta.canal_informativo) {
    $q.notify({ message: 'Completa todos los campos de la encuesta.', type: 'warning', position: 'top', icon: 'warning' });
    activeTab.value = 'encuesta';
    return;
  }

  $q.dialog({
    title: 'Actualizar Inscripción',
    message: `¿Confirmas la actualización de la inscripción de <strong>${form.personal.name} ${form.personal.last_name}</strong>?`,
    html: true,
    ok:     { label: 'Sí, actualizar', color: 'deep-purple-8', unelevated: true },
    cancel: { label: 'Cancelar', flat: true, color: 'grey' },
    persistent: true,
  }).onOk(() => {
    emit('actualizar', {
      applicant_id: props.applicant?.id ?? '',
      personal:     { ...form.personal },
      datos:        { ...form.datos },
      docs:         { ...form.docs },
      encuesta:     { ...form.encuesta },
    });
    dialogOpen.value = false;
  });
}

function cerrarDialog() {
  dialogOpen.value = false;
}

watch(dialogOpen, (val) => {
  if (val) {
    activeTab.value = 'datos';
    cargarDatosIniciales();
  }
});

watch(
  () => [props.inscripcionData, props.user, props.applicant],
  () => { if (dialogOpen.value) cargarDatosIniciales(); },
);
</script>

<style scoped lang="scss">
.revision-card {
  display: flex;
  flex-direction: column;
}

.tab-content-area {
  flex: 1;
  min-height: 0;
  max-height: calc(100vh - 260px);
  overflow-y: auto;
}

/* Documentos */
.doc-card {
  border: 2px solid;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &.doc-ok {
    border-color: #4caf50;
    background: #f1f8e9;
  }
  &.doc-missing {
    border-color: #e0e0e0;
    background: #fafafa;
  }

  .doc-title {
    font-weight: 600;
    color: #4a148c;
    font-size: 13px;
  }
}

.foto-preview {
  border: 3px solid #7c4dff;
  box-shadow: 0 2px 12px rgba(124, 77, 255, 0.25);
}

/* Visor */
.visor-content {
  height: calc(100vh - 56px);
}
.visor-img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin: auto;
  object-fit: contain;
  padding: 16px;
}
</style>
