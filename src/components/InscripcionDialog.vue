<template>
  <q-dialog v-model="dialogOpen" persistent maximized>
    <q-card class="inscripcion-card">
      <!-- Header -->
      <q-card-section class="bg-primary text-white row items-center q-py-md">
        <q-icon name="school" size="28px" class="q-mr-sm" />
        <div class="text-h6 text-weight-medium">Completar Inscripción</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="cerrarDialog" />
      </q-card-section>

      <!-- Info aspirante -->
      <q-card-section class="bg-blue-1 q-py-sm">
        <div class="row items-center q-gutter-sm">
          <q-icon name="person" color="primary" />
          <span class="text-weight-medium text-primary">{{ applicant?.user_name }} {{ applicant?.user_last_name }}</span>
          <q-separator vertical />
          <span class="text-grey-7 text-caption">{{ applicant?.program }}</span>
          <q-chip color="blue" text-color="white" label="Pre-inscripción" size="sm" dense />
        </div>
      </q-card-section>

      <q-separator />

      <!-- Tabs -->
      <q-tabs
        v-model="activeTab"
        dense
        align="justify"
        class="bg-white text-grey-7"
        active-color="primary"
        indicator-color="primary"
      >
        <q-tab name="datos" icon="assignment_ind" label="Datos Complementarios">
          <q-badge v-if="tabErrors.datos" color="negative" floating>!</q-badge>
        </q-tab>
        <q-tab name="documentos" icon="upload_file" label="Documentos">
          <q-badge v-if="tabErrors.documentos" color="negative" floating>!</q-badge>
        </q-tab>
        <q-tab name="encuesta" icon="poll" label="Encuesta">
          <q-badge v-if="tabErrors.encuesta" color="negative" floating>!</q-badge>
        </q-tab>
      </q-tabs>

      <q-separator />

      <!-- Tab Panels -->
      <q-card-section class="q-pa-none tab-content-area overflow-auto">
        <q-tab-panels v-model="activeTab" animated>

          <!-- TAB 1: Datos Complementarios -->
          <q-tab-panel name="datos" class="q-pa-lg" eager>
            <div class="text-h6 q-mb-md text-grey-8 row items-center q-gutter-sm">
              <q-icon name="edit_note" color="primary" />
              <span>Datos Complementarios</span>
            </div>
            <q-form :ref="formDatosRef">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="formDatos.fecha_nacimiento"
                    label="Fecha de Nacimiento *"
                    outlined
                    dense
                    type="date"
                    :rules="[(val) => !!val || 'La fecha de nacimiento es requerida']"
                    lazy-rules
                  >
                    <template v-slot:prepend>
                      <q-icon name="cake" color="primary" />
                    </template>
                  </q-input>
                </div>

                <div class="col-12 col-md-6">
                  <q-input
                    v-model="formDatos.lugar_nacimiento"
                    label="Lugar de Nacimiento *"
                    outlined
                    dense
                    placeholder="Ciudad, Departamento"
                    :rules="[(val) => !!val || 'El lugar de nacimiento es requerido']"
                    lazy-rules
                  >
                    <template v-slot:prepend>
                      <q-icon name="location_city" color="primary" />
                    </template>
                  </q-input>
                </div>

                <div class="col-12">
                  <q-input
                    v-model="formDatos.direccion_residencia"
                    label="Dirección de Residencia *"
                    outlined
                    dense
                    placeholder="Calle / Carrera / Avenida..."
                    :rules="[(val) => !!val || 'La dirección es requerida']"
                    lazy-rules
                  >
                    <template v-slot:prepend>
                      <q-icon name="home" color="primary" />
                    </template>
                  </q-input>
                </div>

                <div class="col-12 col-md-4">
                  <q-select
                    v-model="formDatos.estrato"
                    label="Estrato *"
                    outlined
                    dense
                    :options="estratoOptions"
                    :rules="[(val) => !!val || 'El estrato es requerido']"
                    lazy-rules
                    emit-value
                    map-options
                  >
                    <template v-slot:prepend>
                      <q-icon name="layers" color="primary" />
                    </template>
                  </q-select>
                </div>
              </div>
            </q-form>
          </q-tab-panel>

          <!-- TAB 2: Documentos -->
          <q-tab-panel name="documentos" class="q-pa-lg" eager>
            <div class="text-h6 q-mb-md text-grey-8 row items-center q-gutter-sm">
              <q-icon name="folder_open" color="primary" />
              <span>Carga de Documentos</span>
            </div>

            <div class="row q-col-gutter-md">
              <!-- Foto -->
              <div class="col-12">
                <div class="upload-card q-pa-md rounded-borders" :class="formDocs.foto ? 'upload-done' : 'upload-pending'">
                  <div class="row items-center q-gutter-md">
                    <div class="upload-icon-wrapper">
                      <q-icon :name="formDocs.foto ? 'check_circle' : 'add_a_photo'" :color="formDocs.foto ? 'positive' : 'grey-5'" size="36px" />
                    </div>
                    <div class="col">
                      <div class="text-weight-medium">Foto del Aspirante <span class="text-negative">*</span></div>
                      <div class="text-caption text-grey-6">Formato JPG · Máximo 2MB</div>
                      <div v-if="formDocs.foto" class="text-caption text-positive q-mt-xs row items-center">
                        <q-icon name="check" size="12px" class="q-mr-xs" />{{ formDocs.foto.name }}
                      </div>
                    </div>
                    <q-btn
                      :label="formDocs.foto ? 'Cambiar' : 'Seleccionar'"
                      :color="formDocs.foto ? 'grey-6' : 'primary'"
                      outline
                      size="sm"
                      @click="triggerFileInput('foto')"
                    />
                  </div>
                </div>
                <input ref="inputFoto" type="file" accept="image/jpeg,image/jpg" class="hidden-input" @change="onFileChange($event, 'foto')" />
                <div v-if="docErrors.foto" class="text-negative text-caption q-mt-xs q-ml-sm">
                  <q-icon name="error" size="12px" /> {{ docErrors.foto }}
                </div>
              </div>

              <!-- Documento de Identidad -->
              <div class="col-12">
                <div class="upload-card q-pa-md rounded-borders" :class="formDocs.documento_identidad ? 'upload-done' : 'upload-pending'">
                  <div class="row items-center q-gutter-md">
                    <div class="upload-icon-wrapper">
                      <q-icon :name="formDocs.documento_identidad ? 'check_circle' : 'badge'" :color="formDocs.documento_identidad ? 'positive' : 'grey-5'" size="36px" />
                    </div>
                    <div class="col">
                      <div class="text-weight-medium">Documento de Identidad <span class="text-negative">*</span></div>
                      <div class="text-caption text-grey-6">Formato PDF · Máximo 5MB</div>
                      <div v-if="formDocs.documento_identidad" class="text-caption text-positive q-mt-xs row items-center">
                        <q-icon name="check" size="12px" class="q-mr-xs" />{{ formDocs.documento_identidad.name }}
                      </div>
                    </div>
                    <q-btn
                      :label="formDocs.documento_identidad ? 'Cambiar' : 'Seleccionar'"
                      :color="formDocs.documento_identidad ? 'grey-6' : 'primary'"
                      outline
                      size="sm"
                      @click="triggerFileInput('documento_identidad')"
                    />
                  </div>
                </div>
                <input ref="inputDocIdentidad" type="file" accept="application/pdf" class="hidden-input" @change="onFileChange($event, 'documento_identidad')" />
                <div v-if="docErrors.documento_identidad" class="text-negative text-caption q-mt-xs q-ml-sm">
                  <q-icon name="error" size="12px" /> {{ docErrors.documento_identidad }}
                </div>
              </div>

              <!-- Diploma de Bachiller -->
              <div class="col-12">
                <div class="upload-card q-pa-md rounded-borders" :class="formDocs.diploma_bachiller ? 'upload-done' : 'upload-pending'">
                  <div class="row items-center q-gutter-md">
                    <div class="upload-icon-wrapper">
                      <q-icon :name="formDocs.diploma_bachiller ? 'check_circle' : 'military_tech'" :color="formDocs.diploma_bachiller ? 'positive' : 'grey-5'" size="36px" />
                    </div>
                    <div class="col">
                      <div class="text-weight-medium">Diploma de Bachiller <span class="text-negative">*</span></div>
                      <div class="text-caption text-grey-6">Formato PDF · Máximo 5MB</div>
                      <div v-if="formDocs.diploma_bachiller" class="text-caption text-positive q-mt-xs row items-center">
                        <q-icon name="check" size="12px" class="q-mr-xs" />{{ formDocs.diploma_bachiller.name }}
                      </div>
                    </div>
                    <q-btn
                      :label="formDocs.diploma_bachiller ? 'Cambiar' : 'Seleccionar'"
                      :color="formDocs.diploma_bachiller ? 'grey-6' : 'primary'"
                      outline
                      size="sm"
                      @click="triggerFileInput('diploma_bachiller')"
                    />
                  </div>
                </div>
                <input ref="inputDiploma" type="file" accept="application/pdf" class="hidden-input" @change="onFileChange($event, 'diploma_bachiller')" />
                <div v-if="docErrors.diploma_bachiller" class="text-negative text-caption q-mt-xs q-ml-sm">
                  <q-icon name="error" size="12px" /> {{ docErrors.diploma_bachiller }}
                </div>
              </div>
            </div>
          </q-tab-panel>

          <!-- TAB 3: Encuesta de Mercadeo -->
          <q-tab-panel name="encuesta" class="q-pa-lg" eager>
            <div class="text-h6 q-mb-md text-grey-8 row items-center q-gutter-sm">
              <q-icon name="poll" color="primary" />
              <span>Encuesta de Mercadeo</span>
            </div>
            <div class="text-caption text-grey-6 q-mb-lg">
              Tu opinión nos ayuda a mejorar. Por favor responde las siguientes preguntas.
            </div>

            <q-form :ref="formEncuestaRef">
              <div class="row q-col-gutter-lg">

                <!-- Pregunta 1 -->
                <div class="col-12">
                  <div class="encuesta-pregunta q-pa-md rounded-borders">
                    <div class="row items-start q-gutter-sm q-mb-sm">
                      <q-badge color="primary" label="1" class="pregunta-numero" />
                      <div class="text-weight-medium text-grey-8 col">
                        ¿Cuál es su motivación para estudiar en la Universidad? <span class="text-negative">*</span>
                      </div>
                    </div>
                    <q-input
                      v-model="formEncuesta.motivacion"
                      type="textarea"
                      outlined
                      dense
                      placeholder="Cuéntanos tu motivación..."
                      :rows="3"
                      :rules="[(val) => !!val || 'Este campo es requerido']"
                      lazy-rules
                    />
                  </div>
                </div>

                <!-- Pregunta 2 -->
                <div class="col-12">
                  <div class="encuesta-pregunta q-pa-md rounded-borders">
                    <div class="row items-start q-gutter-sm q-mb-sm">
                      <q-badge color="primary" label="2" class="pregunta-numero" />
                      <div class="text-weight-medium text-grey-8 col">
                        ¿Por qué medio se enteró de la Institución? <span class="text-negative">*</span>
                      </div>
                    </div>
                    <q-option-group
                      v-model="formEncuesta.medio_enterado"
                      :options="medioOptions"
                      color="primary"
                      class="q-ml-sm"
                    />
                    <div v-if="encuestaErrors.medio_enterado" class="text-negative text-caption q-mt-xs">
                      <q-icon name="error" size="12px" /> {{ encuestaErrors.medio_enterado }}
                    </div>
                  </div>
                </div>

                <!-- Pregunta 3 -->
                <div class="col-12">
                  <div class="encuesta-pregunta q-pa-md rounded-borders">
                    <div class="row items-start q-gutter-sm q-mb-sm">
                      <q-badge color="primary" label="3" class="pregunta-numero" />
                      <div class="text-weight-medium text-grey-8 col">
                        ¿Por qué canal informativo se enteró de la Institución? <span class="text-negative">*</span>
                      </div>
                    </div>
                    <q-option-group
                      v-model="formEncuesta.canal_informativo"
                      :options="canalOptions"
                      color="primary"
                      class="q-ml-sm"
                    />
                    <div v-if="encuestaErrors.canal_informativo" class="text-negative text-caption q-mt-xs">
                      <q-icon name="error" size="12px" /> {{ encuestaErrors.canal_informativo }}
                    </div>
                  </div>
                </div>
              </div>
            </q-form>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <!-- Footer Actions -->
      <q-separator />
      <q-card-actions class="q-pa-md bg-grey-1">
        <div class="row full-width items-center">
          <!-- Progress indicators -->
          <div class="row q-gutter-xs q-mr-md">
            <q-chip
              :color="tabCompletado.datos ? 'positive' : 'grey-4'"
              :text-color="tabCompletado.datos ? 'white' : 'grey-7'"
              :icon="tabCompletado.datos ? 'check' : 'radio_button_unchecked'"
              label="Datos"
              size="sm"
              dense
            />
            <q-chip
              :color="tabCompletado.documentos ? 'positive' : 'grey-4'"
              :text-color="tabCompletado.documentos ? 'white' : 'grey-7'"
              :icon="tabCompletado.documentos ? 'check' : 'radio_button_unchecked'"
              label="Documentos"
              size="sm"
              dense
            />
            <q-chip
              :color="tabCompletado.encuesta ? 'positive' : 'grey-4'"
              :text-color="tabCompletado.encuesta ? 'white' : 'grey-7'"
              :icon="tabCompletado.encuesta ? 'check' : 'radio_button_unchecked'"
              label="Encuesta"
              size="sm"
              dense
            />
          </div>
          <q-space />
          <q-btn label="Cancelar" flat color="negative" @click="cerrarDialog" class="q-mr-sm" />
          <q-btn
            label="Confirmar Inscripción"
            color="positive"
            icon="check_circle"
            :disable="!todoCompletado"
            @click="confirmarInscripcion"
            unelevated
          >
            <q-tooltip v-if="!todoCompletado">Completa todos los campos en los 3 tabs para confirmar</q-tooltip>
          </q-btn>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import type { GetApplicants } from 'src/interfaces';

const props = defineProps<{
  modelValue: boolean;
  applicant: GetApplicants | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'inscripcionConfirmada', data: InscripcionPayload): void;
}>();

interface InscripcionPayload {
  applicant_id: string;
  datos: typeof formDatos.value;
  docs: { foto: File | null; documento_identidad: File | null; diploma_bachiller: File | null };
  encuesta: typeof formEncuesta.value;
}

const $q = useQuasar();
const activeTab = ref('datos');

const formDatosRef = ref<any>(null);
const formDatos = ref({
  fecha_nacimiento: '',
  lugar_nacimiento: '',
  direccion_residencia: '',
  estrato:'',
});

const estratoOptions = [
  { label: 'Estrato 1', value: '1' },
  { label: 'Estrato 2', value: '2' },
  { label: 'Estrato 3', value: '3' },
  { label: 'Estrato 4', value: '4' },
  { label: 'Estrato 5', value: '5' },
  { label: 'Estrato 6', value: '6' },
];

const inputFoto = ref<HTMLInputElement | null>(null);
const inputDocIdentidad = ref<HTMLInputElement | null>(null);
const inputDiploma = ref<HTMLInputElement | null>(null);

const formDocs = ref<{ foto: File | null; documento_identidad: File | null; diploma_bachiller: File | null }>({
  foto: null,
  documento_identidad: null,
  diploma_bachiller: null,
});

const docErrors = ref({ foto: '', documento_identidad: '', diploma_bachiller: '' });

const formEncuestaRef = ref<any>(null);
const formEncuesta = ref({
  motivacion: '',
  medio_enterado: '',
  canal_informativo: '',
});

const encuestaErrors = ref({ medio_enterado: '', canal_informativo: '' });

const medioOptions = [
  { label: 'Visita al colegio o la Institución', value: 'visita_colegio' },
  { label: 'Recomendación', value: 'recomendacion' },
  { label: 'Funcionario de la institución', value: 'funcionario' },
];

const canalOptions = [
  { label: 'Internet', value: 'internet' },
  { label: 'Radio', value: 'radio' },
  { label: 'Redes sociales', value: 'redes_sociales' },
  { label: 'Televisión', value: 'television' },
];

const dialogOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const tabErrors = ref({ datos: false, documentos: false, encuesta: false });

const tabCompletado = computed(() => ({
  datos: !!formDatos.value.fecha_nacimiento && !!formDatos.value.lugar_nacimiento &&
    !!formDatos.value.direccion_residencia && !!formDatos.value.estrato,
  documentos: !!formDocs.value.foto && !!formDocs.value.documento_identidad && !!formDocs.value.diploma_bachiller,
  encuesta: !!formEncuesta.value.motivacion && !!formEncuesta.value.medio_enterado && !!formEncuesta.value.canal_informativo,
}));

const todoCompletado = computed(() =>
  tabCompletado.value.datos && tabCompletado.value.documentos && tabCompletado.value.encuesta
);

function triggerFileInput(tipo: 'foto' | 'documento_identidad' | 'diploma_bachiller') {
  const refMap = { foto: inputFoto, documento_identidad: inputDocIdentidad, diploma_bachiller: inputDiploma };
  refMap[tipo].value?.click();
}

function onFileChange(event: Event, tipo: 'foto' | 'documento_identidad' | 'diploma_bachiller') {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] ?? null;
  docErrors.value[tipo] = '';

  if (!file) return;

  const maxSize = tipo === 'foto' ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
  const allowedTypes: Record<string, string[]> = {
    foto: ['image/jpeg', 'image/jpg'],
    documento_identidad: ['application/pdf'],
    diploma_bachiller: ['application/pdf'],
  };

  if (!allowedTypes[tipo].includes(file.type)) {
    docErrors.value[tipo] = tipo === 'foto' ? 'Solo se aceptan archivos JPG' : 'Solo se aceptan archivos PDF';
    return;
  }
  if (file.size > maxSize) {
    docErrors.value[tipo] = `El archivo supera el tamaño máximo (${tipo === 'foto' ? '2MB' : '5MB'})`;
    return;
  }

  formDocs.value[tipo] = file;
  input.value = '';
}

async function confirmarInscripcion() {
  $q.dialog({
    title: 'Confirmar Inscripción',
    message: '¿Estás seguro de que deseas confirmar tu inscripción? Una vez confirmada no podrás modificar los datos.',
    ok: { label: 'Sí, confirmar', color: 'positive', unelevated: true },
    cancel: { label: 'Cancelar', flat: true, color: 'grey' },
    persistent: true,
  }).onOk(() => {
    const payload: InscripcionPayload = {
      applicant_id: props.applicant?.id ?? '',
      datos: { ...formDatos.value },
      docs: { ...formDocs.value },
      encuesta: { ...formEncuesta.value },
    };
    emit('inscripcionConfirmada', payload);
    dialogOpen.value = false;
  });
}

function cerrarDialog() {
  dialogOpen.value = false;
}

watch(dialogOpen, (val) => {
  if (val) {
    activeTab.value = 'datos';
    formDatos.value = { fecha_nacimiento: '', lugar_nacimiento: '', direccion_residencia: '', estrato: '' };
    formDocs.value = { foto: null, documento_identidad: null, diploma_bachiller: null };
    formEncuesta.value = { motivacion: '', medio_enterado: '', canal_informativo: '' };
    docErrors.value = { foto: '', documento_identidad: '', diploma_bachiller: '' };
    encuestaErrors.value = { medio_enterado: '', canal_informativo: '' };
    tabErrors.value = { datos: false, documentos: false, encuesta: false };
  }
});
</script>

<style scoped lang="scss">
.inscripcion-card {
  display: flex;
  flex-direction: column;
}

.tab-content-area {
  flex: 1;
  min-height: 0;
  max-height: calc(100vh - 280px);
}

.hidden-input {
  display: none;
}

.upload-card {
  border: 2px dashed;
  transition: all 0.2s ease;

  &.upload-pending {
    border-color: #e0e0e0;
    background-color: #fafafa;
  }

  &.upload-done {
    border-color: #4caf50;
    background-color: #f1f8e9;
  }
}

.encuesta-pregunta {
  background: #f5f7fa;
  border-left: 4px solid #1976d2;
}

.pregunta-numero {
  min-width: 24px;
  height: 24px;
  border-radius: 50% !important;
  font-size: 12px;
  font-weight: 700;
}
</style>
