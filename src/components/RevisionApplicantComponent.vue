<template>
  <q-dialog v-model="dialogOpen" persistent maximized>
    <q-card class="revision-card">

      <q-card-section class="bg-deep-purple-8 text-white row items-center q-py-md">
        <q-icon name="fact_check" size="28px" class="q-mr-sm" />
        <div class="text-h6 text-weight-medium">Revisión de Inscripción</div>
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
          <span class="text-weight-bold text-deep-purple-8">{{ applicant?.user_name }} {{ applicant?.user_last_name }}</span>
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
        <q-tab name="datos" icon="assignment_ind" label="Datos Complementarios" />
        <q-tab name="documentos" icon="folder_open" label="Documentos" />
        <q-tab name="encuesta" icon="poll" label="Encuesta" />
      </q-tabs>

      <q-separator />

      <!-- Tab Panels -->
      <q-card-section class="q-pa-none tab-content-area overflow-auto">
        <q-tab-panels v-model="activeTab" animated>

          <!-- TAB 1: Datos -->
          <q-tab-panel name="datos" class="q-pa-lg">
            <div class="text-subtitle1 text-weight-bold text-deep-purple-8 q-mb-md row items-center q-gutter-sm">
              <q-icon name="assignment_ind" />
              <span>Datos Complementarios del Aspirante</span>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <div class="dato-card q-pa-md rounded-borders">
                  <div class="dato-label">
                    <q-icon name="cake" size="14px" class="q-mr-xs" color="deep-purple-6" />
                    Fecha de Nacimiento
                  </div>
                  <div class="dato-valor">{{ formatFecha(inscripcionData?.datos?.fecha_nacimiento) }}</div>
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="dato-card q-pa-md rounded-borders">
                  <div class="dato-label">
                    <q-icon name="location_city" size="14px" class="q-mr-xs" color="deep-purple-6" />
                    Lugar de Nacimiento
                  </div>
                  <div class="dato-valor">{{ inscripcionData?.datos?.lugar_nacimiento || '—' }}</div>
                </div>
              </div>

              <div class="col-12">
                <div class="dato-card q-pa-md rounded-borders">
                  <div class="dato-label">
                    <q-icon name="home" size="14px" class="q-mr-xs" color="deep-purple-6" />
                    Dirección de Residencia
                  </div>
                  <div class="dato-valor">{{ inscripcionData?.datos?.direccion_residencia || '—' }}</div>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="dato-card q-pa-md rounded-borders">
                  <div class="dato-label">
                    <q-icon name="layers" size="14px" class="q-mr-xs" color="deep-purple-6" />
                    Estrato
                  </div>
                  <div class="dato-valor">
                    <q-chip color="deep-purple-1" text-color="deep-purple-9" :label="`Estrato ${inscripcionData?.datos?.estrato}`" size="sm" />
                  </div>
                </div>
              </div>
            </div>

            <q-banner v-if="!inscripcionData?.datos" class="bg-orange-1 text-orange-9 q-mt-md rounded-borders">
              <template v-slot:avatar><q-icon name="info" /></template>
              El aspirante aún no ha diligenciado los datos complementarios.
            </q-banner>
          </q-tab-panel>

          <q-tab-panel name="documentos" class="q-pa-lg">
            <div class="text-subtitle1 text-weight-bold text-deep-purple-8 q-mb-md row items-center q-gutter-sm">
              <q-icon name="folder_open" />
              <span>Documentos Cargados</span>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <div class="doc-card q-pa-md rounded-borders text-center" :class="inscripcionData?.docs?.foto ? 'doc-ok' : 'doc-missing'">
                  <div v-if="inscripcionData?.docs?.foto">
                    <q-avatar size="100px" class="q-mb-sm foto-preview">
                      <img :src="inscripcionData.docs.foto" alt="Foto aspirante" />
                    </q-avatar>
                    <div class="doc-title q-mb-xs">Foto del Aspirante</div>
                    <q-btn
                      label="Ver en tamaño completo"
                      flat
                      size="xs"
                      color="deep-purple-8"
                      icon="open_in_new"
                      @click="abrirVisor(inscripcionData.docs.foto, 'Foto del Aspirante', 'image')"
                    />
                  </div>
                  <div v-else class="text-center">
                    <q-icon name="hide_image" size="48px" color="grey-4" />
                    <div class="text-grey-5 text-caption q-mt-sm">Foto no cargada</div>
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="doc-card q-pa-md rounded-borders" :class="inscripcionData?.docs?.documento_identidad ? 'doc-ok' : 'doc-missing'">
                  <div v-if="inscripcionData?.docs?.documento_identidad" class="text-center">
                    <q-icon name="badge" size="48px" color="deep-purple-6" class="q-mb-sm" />
                    <div class="doc-title q-mb-sm">Documento de Identidad</div>
                    <q-btn
                      label="Ver PDF"
                      color="deep-purple-8"
                      icon="picture_as_pdf"
                      unelevated
                      size="sm"
                      @click="abrirVisor(inscripcionData.docs.documento_identidad, 'Documento de Identidad', 'pdf')"
                    />
                  </div>
                  <div v-else class="text-center">
                    <q-icon name="description" size="48px" color="grey-4" />
                    <div class="text-grey-5 text-caption q-mt-sm">Documento no cargado</div>
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="doc-card q-pa-md rounded-borders" :class="inscripcionData?.docs?.diploma_bachiller ? 'doc-ok' : 'doc-missing'">
                  <div v-if="inscripcionData?.docs?.diploma_bachiller" class="text-center">
                    <q-icon name="military_tech" size="48px" color="deep-purple-6" class="q-mb-sm" />
                    <div class="doc-title q-mb-sm">Diploma de Bachiller</div>
                    <q-btn
                      label="Ver PDF"
                      color="deep-purple-8"
                      icon="picture_as_pdf"
                      unelevated
                      size="sm"
                      @click="abrirVisor(inscripcionData.docs.diploma_bachiller, 'Diploma de Bachiller', 'pdf')"
                    />
                  </div>
                  <div v-else class="text-center">
                    <q-icon name="workspace_premium" size="48px" color="grey-4" />
                    <div class="text-grey-5 text-caption q-mt-sm">Diploma no cargado</div>
                  </div>
                </div>
              </div>
            </div>

            <q-banner v-if="!inscripcionData?.docs" class="bg-orange-1 text-orange-9 q-mt-md rounded-borders">
              <template v-slot:avatar><q-icon name="info" /></template>
              El aspirante aún no ha cargado sus documentos.
            </q-banner>
          </q-tab-panel>

          <q-tab-panel name="encuesta" class="q-pa-lg">
            <div class="text-subtitle1 text-weight-bold text-deep-purple-8 q-mb-md row items-center q-gutter-sm">
              <q-icon name="poll" />
              <span>Respuestas de la Encuesta de Mercadeo</span>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12">
                <div class="encuesta-card q-pa-md rounded-borders">
                  <div class="encuesta-numero">1</div>
                  <div class="encuesta-pregunta q-mb-sm">¿Cuál es su motivación para estudiar en la Universidad?</div>
                  <div class="encuesta-respuesta">
                    {{ inscripcionData?.encuesta?.motivacion || 'Sin respuesta' }}
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="encuesta-card q-pa-md rounded-borders">
                  <div class="encuesta-numero">2</div>
                  <div class="encuesta-pregunta q-mb-sm">¿Por qué medio se enteró de la Institución?</div>
                  <div class="encuesta-respuesta">
                    <q-chip
                      v-if="inscripcionData?.encuesta?.medio_enterado"
                      color="deep-purple-1"
                      text-color="deep-purple-9"
                      icon="record_voice_over"
                      :label="getMedioLabel(inscripcionData.encuesta.medio_enterado)"
                    />
                    <span v-else class="text-grey-5">Sin respuesta</span>
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="encuesta-card q-pa-md rounded-borders">
                  <div class="encuesta-numero">3</div>
                  <div class="encuesta-pregunta q-mb-sm">¿Por qué canal informativo se enteró de la Institución?</div>
                  <div class="encuesta-respuesta">
                    <q-chip
                      v-if="inscripcionData?.encuesta?.canal_informativo"
                      color="deep-purple-1"
                      text-color="deep-purple-9"
                      icon="cast"
                      :label="getCanalLabel(inscripcionData.encuesta.canal_informativo)"
                    />
                    <span v-else class="text-grey-5">Sin respuesta</span>
                  </div>
                </div>
              </div>
            </div>

            <q-banner v-if="!inscripcionData?.encuesta" class="bg-orange-1 text-orange-9 q-mt-md rounded-borders">
              <template v-slot:avatar><q-icon name="info" /></template>
              El aspirante aún no ha respondido la encuesta.
            </q-banner>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-separator />

      <q-card-actions class="q-pa-md bg-grey-1">
        <div class="row full-width items-center q-gutter-sm">
          <q-btn
            v-if="role === 'RYC'"
            label="Devolver Solicitud"
            color="negative"
            icon="reply"
            outline
            @click="accionDevolver"
          />
          <q-btn
            v-if="role === 'CPG'"
            label="Rechazar Inscripción"
            color="negative"
            icon="reply"
            outline
            @click="accionRechazar"
          />
          <q-space />
          <q-btn label="Cerrar" flat color="grey-7" @click="cerrarDialog" />
          <q-btn
            v-if="role === 'RYC'"
            label="Aprobar Inscripción"
            color="positive"
            icon="check_circle"
            unelevated
            @click="accionAprobar"
          />
          <q-btn
            v-if="role === 'CPG'"
            label="Admitir Inscripción"
            color="positive"
            icon="check_circle"
            unelevated
            @click="accionAdmitir()"
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

    <q-dialog v-model="devolverDialog" persistent>
      <q-card style="min-width: 420px; max-width: 90vw;">
        <q-card-section class="bg-negative text-white row items-center">
          <q-icon name="reply" class="q-mr-sm" size="24px" />
          <span class="text-h6">{{role === 'RYC' ? 'Devolver Solicitud' : 'Rechazar inscripción'}}</span>
        </q-card-section>
        <q-card-section class="q-pt-lg">
          <div class="text-grey-7 q-mb-md">
            Indica el motivo por el cual se {{role === 'RYC' ? 'devuelve' : 'rechaza'}} la inscripción de
            <strong>{{ applicant?.user_name }} {{ applicant?.user_last_name }}</strong>.
            Esta información será notificada al aspirante.
          </div>
          <q-input
            v-model="motivoDevolucion"
            type="textarea"
            label="Motivo *"
            outlined
            :rows="4"
            placeholder="Ej: El documento de identidad está ilegible, por favor cargue una versión más clara..."
            counter
            maxlength="500"
          />
        </q-card-section>
        <q-card-actions class="q-pa-md q-pt-none justify-end">
          <q-btn label="Cancelar" flat color="grey" v-close-popup />
          <q-btn
            v-if="role === 'CPG'"
            label="Confirmar rechazo"
            color="negative"
            unelevated
            :disable="!motivoDevolucion.trim()"
            @click="confirmarReject"
          />
          <q-btn
            v-if="role === 'RYC'"
            label="Confirmar devolución"
            color="negative"
            unelevated
            :disable="!motivoDevolucion.trim()"
            @click="confirmarDevolucion"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth-store';
import type { GetApplicants, InscripcionData } from 'src/interfaces';

const store = useAuthStore()
const role = ref<string>()
const props = defineProps<{
  modelValue: boolean;
  applicant: GetApplicants | null;
  inscripcionData?: InscripcionData | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'aprobar', applicantId: string): void;
  (e: 'devolver', applicantId: string, motivo: string): void;
  (e: 'aceptReject', applicantId: string, motivo: string, status: string): void;
}>();

const $q = useQuasar();
const activeTab = ref('datos');

const visorDialog = ref(false);
const visorSrc = ref('');
const visorTitulo = ref('');
const visorTipo = ref<'image' | 'pdf'>('pdf');

const devolverDialog = ref(false);
const motivoDevolucion = ref('');

const dialogOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

onMounted(() => {
  role.value = store.userInfo?.role
})

const medioMap: Record<string, string> = {
  visita_colegio: 'Visita al colegio o la Institución',
  recomendacion: 'Recomendación',
  funcionario: 'Funcionario de la institución',
};
const canalMap: Record<string, string> = {
  internet: 'Internet',
  radio: 'Radio',
  redes_sociales: 'Redes sociales',
  television: 'Televisión',
};

function getMedioLabel(val: string) { return medioMap[val] ?? val; }
function getCanalLabel(val: string) { return canalMap[val] ?? val; }

function getStatusApplicantColor(tipo: string): string {
  const colors: Record<string, string> = {
    'PREI': 'blue', 'FORM': 'brown', 'CORR': 'cyan',
    'FINA': 'deep-orange', 'APRO': 'light-green', 'REJE': 'red', 'ADMI': 'green'
  };
  return colors[tipo] || 'grey';
}

function getStatusApplicantLabel(tipo: string): string {
  const label: Record<string, string> = {
    'PREI': 'Pre-inscripción', 'FORM': 'Diligenciando formulario',
    'CORR': 'Corregir inscripción', 'FINA': 'Inscripción completa',
    'APRO': 'Aprobada', 'REJE': 'Rechazada', 'ADMI': 'Admitido'
  };
  return label[tipo] || tipo;
}

function formatFecha(fecha?: string): string {
  if (!fecha) return '—';
  const [year, month, day] = fecha.split('-');
  return `${day}/${month}/${year}`;
}

function abrirVisor(src: string, titulo: string, tipo: 'image' | 'pdf') {
  if (tipo === 'pdf') {
    return window.open(src, '_blank')
  }
  visorSrc.value = src;
  visorTitulo.value = titulo;
  visorTipo.value = tipo;
  visorDialog.value = true;
}

function accionAprobar() {
  $q.dialog({
    title: 'Aprobar Inscripción',
    message: `¿Confirmas la aprobación de la inscripción de <strong>${props.applicant?.user_name} ${props.applicant?.user_last_name}</strong>?`,
    html: true,
    ok: { label: 'Sí, aprobar', color: 'positive', unelevated: true },
    cancel: { label: 'Cancelar', flat: true, color: 'grey' },
    persistent: true,
  }).onOk(() => {
    emit('aprobar', props.applicant?.id ?? '');
    dialogOpen.value = false;
  });
}

function accionAdmitir() {
  $q.dialog({
    title: 'Admitir Inscripción',
    message: `¿Confirmas la admisión de la inscripción de <strong>${props.applicant?.user_name} ${props.applicant?.user_last_name}</strong>?`,
    html: true,
    ok: { label: 'Sí, admitir', color: 'positive', unelevated: true },
    cancel: { label: 'Cancelar', flat: true, color: 'grey' },
    persistent: true,
  }).onOk(() => {
    emit('aceptReject', props.applicant?.id ?? '', motivoDevolucion.value.trim(), 'ADMI');
    dialogOpen.value = false;
  });
}

function accionDevolver() {
  motivoDevolucion.value = '';
  devolverDialog.value = true;
}

function accionRechazar() {
  motivoDevolucion.value = '';
  devolverDialog.value = true;
}

function confirmarDevolucion() {
  if (!motivoDevolucion.value.trim()) return;
  devolverDialog.value = false;
  emit('devolver', props.applicant?.id ?? '', motivoDevolucion.value.trim());
  dialogOpen.value = false;
}

function confirmarReject() {
  if (!motivoDevolucion.value.trim()) return;
  devolverDialog.value = false;
  emit('aceptReject', props.applicant?.id ?? '', motivoDevolucion.value.trim(), 'REJE');
  dialogOpen.value = false;
}

function cerrarDialog() {
  dialogOpen.value = false;
}

watch(dialogOpen, (val) => {
  if (val) activeTab.value = 'datos';
});
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

.dato-card {
  background: #f8f5ff;
  border: 1px solid #ede7f6;
  height: 100%;

  .dato-label {
    font-size: 11px;
    color: #7c4dff;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
  }
  .dato-valor {
    font-size: 15px;
    color: #212121;
    font-weight: 500;
  }
}

.doc-card {
  border: 2px solid;
  min-height: 160px;
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

.encuesta-card {
  background: #f8f5ff;
  border-left: 4px solid #7c4dff;
  position: relative;

  .encuesta-numero {
    position: absolute;
    top: -10px;
    left: 12px;
    background: #7c4dff;
    color: white;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
  }
  .encuesta-pregunta {
    font-size: 13px;
    font-weight: 600;
    color: #4a148c;
  }
  .encuesta-respuesta {
    font-size: 14px;
    color: #424242;
    line-height: 1.5;
  }
}

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
.visor-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
