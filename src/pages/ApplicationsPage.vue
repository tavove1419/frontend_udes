<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <q-card>
            <q-card-section>
              <q-card-section class="bg-primary text-white">
                <div class="text-h6">Inscripciones</div>
              </q-card-section>
              <div class="row items-center justify-between q-mt-sm">
                <q-input
                  dense
                  outlined
                  v-model="searchText"
                  placeholder="Buscar"
                  class="col-12 col-md-4 q-mb-md"
                  clearable
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-none">
              <q-table
                :rows="applicantList"
                :columns="columns"
                row-key="id"
                :pagination="pagination"
                :loading="loading"
                :filter="searchText"
                binary-state-sort
              >
                <template v-slot:body-cell-status="props">
                  <q-td :props="props">
                    <q-chip :color="getStatusApplicantColor(props.row.status)" text-color="white" :label="getStatusApplicantLabel(props.row.status)" size="sm" dense />
                  </q-td>
                </template>
                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <div class="actions-cell">
                      <q-btn dense round icon="touch_app"  color="green" size="sm" :disable="!(props.row.status === 'APRO' && role === 'CPG')"
                        class="q-ml-xs"
                        @click="verRevision(props.row)"
                      >
                        <q-tooltip>Resolución inscripción</q-tooltip>
                      </q-btn>
                      <q-btn dense round icon="fact_check"  color="deep-purple" size="sm" :disable="!(props.row.status === 'FINA' && role === 'RYC')"
                        class="q-ml-xs q-ml-sm"
                        @click="verRevision(props.row)"
                      >
                        <q-tooltip>Revisar inscripción</q-tooltip>
                      </q-btn>
                      <q-btn class="q-ml-sm" dense :disable="props.row.status !== 'FORM'" round icon="edit_note" color="primary" size="sm" @click="completeApplicants(props.row)"><q-tooltip>Finalizar inscripción</q-tooltip></q-btn>
                    </div>
                  </q-td>
                </template>
                <template v-slot:no-data>
                  <div class="full-width row flex-center q-gutter-sm q-pa-lg">
                    <q-icon size="48px" name="inbox" color="grey-5" />
                    <div class="text-grey-7">
                      <div class="text-h6">No hay inscripciones registradas</div>
                    </div>
                  </div>
              </template>
            </q-table>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <InscripcionDialog
      v-model="inscripcionDialog"
      :applicant="selectedApplicant"
      @inscripcion-confirmada="onInscripcionConfirmada"
    />

    <RevisionApplicantComponent
      v-model="revisionDialog"
      :applicant="selectedApplicant"
      :inscripcion-data="selectedInscripcionData"
      @aprobar="onAprobarInscripcion"
      @devolver="onDevolverInscripcion"
      @aceptReject="onResolve"
    />
  </q-page>
</template>

<script setup lang="ts">
import InscripcionDialog from 'components/InscripcionDialog.vue'
import RevisionApplicantComponent from 'components/RevisionApplicantComponent.vue'
import { type QTableProps, useQuasar } from 'quasar';
import type { GetApplicants, InscripcionData } from 'src/interfaces';
import { approvedRyc, correctionRyc, getApplicationById, getListApplicant, resolveCpg, saveCompleteForm } from 'src/services';
import { onMounted, ref } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
const revisionDialog = ref<boolean>(false)
const selectedInscripcionData = ref<InscripcionData>()

const store = useAuthStore()
const $q = useQuasar();
const searchText = ref('');
const isEditing = ref<boolean>(false)
const loading = ref<boolean>(false)
const applicantList = ref<GetApplicants[]>([])
const moduleId = ref<string>('')
const pagination = ref({
  rowsPerPage: 5
})
const role = ref<string>()
const inscripcionDialog = ref<boolean>(false)
const selectedApplicant = ref<GetApplicants | null>(null)
const columns: QTableProps['columns'] = [
  {name: 'program', required: true, label: 'Programa', align: 'left', field: 'program', sortable: true},
  {name: 'applicant_type', required: true, label: 'Tipo aspirante', align: 'left', field: 'applicant_type', sortable: true},
  {name: 'user_name', required: true, label: 'Nombre ', align: 'left', field: 'user_name', sortable: true},
  {name: 'user_last_name', required: true, label: 'Apellidos', align: 'left', field: 'user_last_name', sortable: true},
  {name: 'status', required: true, label: 'Estado', align: 'left', field: 'status', sortable: true},
  { name: 'actions', required: true, label: 'Acciones', align: 'center', field: 'actions' }
]

//Funciones
onMounted(() => {
  role.value = store.userInfo?.role
  getListApplic()
})

function getStatusApplicantColor(tipo: string): string {
  const colors: Record<string, string> = {
    'PREI': 'blue', 'FORM': 'brown', 'CORR': 'cyan',
    'FINA': 'deep-orange', 'APRO': 'orange', 'REJE': 'red',
    'ADMI': 'green'
  };
  return colors[tipo] || 'grey';
};

function getStatusApplicantLabel(tipo: string): string {
  const label: Record<string, string> = {
    'PREI': 'Pre-inscripción', 'FORM': 'Diligenciando formulario', 'CORR': 'Corregir la inscripción',
    'FINA': 'Finalizo inscripción formulario completo', 'APRO': 'Aprobada la inscripción', 'REJE': 'Rechazado',
    'ADMI': 'Admitido'
  };
  return label[tipo] || '';
};

function getListApplic(): void {
  $q.loading.show({
    message: 'Consultando información...',
  });
  const user = store.userInfo?.role === 'ASP' ? store.userInfo.id : ''
  getListApplicant(user).then((response) => {
    applicantList.value = []
    applicantList.value = response.data
  }).catch((err) => {
    notify(
      err.message ?? 'Error al cargar los proyectos',
      'negative',
      'warning'
    )
  }).finally(() => $q.loading.hide());
}

function verRevision(applicant: GetApplicants): void {
  selectedApplicant.value = applicant
  revisionDialog.value = true
  $q.loading.show({ message: 'Cargando información...' })
  getApplicationById(applicant.id).then((response) => {
    selectedInscripcionData.value = {
      datos: {
        direccion_residencia: response.data.registration.home_address,
        estrato: response.data.registration.stratum,
        fecha_nacimiento: response.data.registration.date_birth,
        lugar_nacimiento: response.data.registration.place_birth,
      },
      docs: {
        foto: response.data.registration.photo_url,                    // URL o base64
        documento_identidad: response.data.registration.document_url,
        diploma_bachiller: response.data.registration.diploma_url,
      },
      encuesta: {
        canal_informativo: response.data.registration.question_three,
        medio_enterado: response.data.registration.question_two,
        motivacion: response.data.registration.question_one
      },
    }
    revisionDialog.value = true
  }).catch((err) => {
    notify(err.message ?? 'Error al cargar la inscripción', 'negative', 'warning')
  }).finally(() => $q.loading.hide())


}

function onAprobarInscripcion(applicantId: string): void {
  $q.loading.show({ message: 'Aprobando inscripción...' })
  approvedRyc(applicantId).then((response) => {
    notify(response.data.message, 'positive', 'check_circle')
    getListApplic()
  }).catch((err) => {
    notify(err.message ?? 'Error al aprobar', 'negative', 'warning')
  }).finally(() => $q.loading.hide())

}


function onDevolverInscripcion(applicantId: string, motivo: string): void {
  $q.loading.show({ message: 'Procesando devolución...' })
  correctionRyc(applicantId, motivo).then((response) => {
    notify(response.data.message, 'warning', 'reply')
    getListApplic()
  }).catch((err) => {
    notify(err.message ?? 'Error al devolver', 'negative', 'warning')
  }).finally(() => $q.loading.hide())

}

function onResolve(applicantId: string, motivo: string, status: string): void {
  $q.loading.show({ message: 'Procesando devolución...' })
  resolveCpg(applicantId, status, motivo).then((response) => {
    notify(response.data.message, 'warning', 'reply')
    getListApplic()
  }).catch((err) => {
    notify(err.message ?? 'Error al devolver', 'negative', 'warning')
  }).finally(() => $q.loading.hide())

}

function completeApplicants(applicant: GetApplicants): void {
  if (applicant.status !== 'FORM') {
    notify('Esta inscripción no se encuentra en estado de Pre-inscripción', 'warning', 'info')
    return
  }
  selectedApplicant.value = applicant
  inscripcionDialog.value = true
}

function onInscripcionConfirmada(payload: {
    applicant_id: string;
    datos: Record<string, unknown>;
    docs: Record<string, File | null>;
    encuesta: Record<string, string>;
  }): void {
    payload.datos
    const formData = new FormData()
    const datosMap: Record<string, string> = {
      fecha_nacimiento: 'date_birth',
      lugar_nacimiento: 'place_birth',
      direccion_residencia: 'home_address',
      estrato: 'stratum'
    }

    Object.entries(datosMap).forEach(([frontendKey, backendKey]) => {
      const value = payload.datos[frontendKey]
      if (value !== undefined && value !== null) {
        formData.append(backendKey, String(value))
      }
    })

    const encuestaMap: Record<string, string> = {
      motivacion: 'question_one',
      medio_enterado: 'question_two',
      canal_informativo: 'question_three'
    }

    Object.entries(encuestaMap).forEach(([frontendKey, backendKey]) => {
      const value = payload.encuesta[frontendKey]
      if (value) {
        formData.append(backendKey, value)
      }
    })

    const docsMap: Record<string, string> = {
      foto: 'photo',
      documento_identidad: 'document',
      diploma_bachiller: 'diploma'
    }

    Object.entries(docsMap).forEach(([frontendKey, backendKey]) => {
      const file = payload.docs[frontendKey]
      if (file) {
        formData.append(backendKey, file)
      }
    })
    $q.loading.show({ message: 'Guardando inscripción...' })
    saveCompleteForm(formData, payload.applicant_id).then((response) => {
      notify(response.data.message, 'positive', 'check_circle')
      getListApplic()
    }).catch((err) => {
      notify(err.message ?? 'Error al guardar la inscripción', 'negative', 'warning')
    }).finally(() => $q.loading.hide())
  }

function notify(msg: string, type: string, icons: string) {
  $q.notify({
    message: msg,
    icon: icons,
    type: type,
    position: 'top',
    timeout: 5000,
  });
}
</script>

