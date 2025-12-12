<template>
    <Fluid>
        <div class="card flex flex-col gap-4 w-full">
            <div class="font-semibold text-xl">Gestión de Clientes</div>

            <!-- Tabs para cambiar entre clientes potenciales y no potenciales -->
            <TabView v-model:activeIndex="activeTab">
                <TabPanel header="Clientes Potenciales">
                    <div class="flex flex-col gap-4">
                        <Toolbar class="mb-6">
                            <template #start>
                                <Button label="Añadir" icon="pi pi-plus" severity="contrast" class="mr-2" @click="openNew('potencial')" />
                                <Button
                                    label="Eliminar"
                                    icon="pi pi-trash"
                                    :severity="!clientesPotencialesSeleccionados || !clientesPotencialesSeleccionados.length ? 'secondary' : 'danger'"
                                    @click="confirmDeleteSelected('potencial')"
                                    :disabled="!clientesPotencialesSeleccionados || !clientesPotencialesSeleccionados.length"
                                />
                            </template>
                        </Toolbar>

                        <DataTable
                            ref="tablaPotenciales"
                            v-model:selection="clientesPotencialesSeleccionados"
                            :value="clientesPotenciales"
                            dataKey="id"
                            :paginator="true"
                            :rows="10"
                            :filters="filtersPotenciales"
                            :loading="loadingPotenciales"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            :rowsPerPageOptions="[5, 10, 25]"
                            currentPageReportTemplate="Mostrando de {first} a {last} de {totalRecords} items"
                        >
                            <template #header>
                                <div class="flex flex-wrap gap-2 items-center justify-between">
                                    <IconField>
                                        <InputIcon>
                                            <i class="pi pi-search" />
                                        </InputIcon>
                                        <InputText v-model="filtersPotenciales['global'].value" placeholder="Buscar..." />
                                    </IconField>
                                </div>
                            </template>

                            <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                            <Column field="nombre" header="Nombre" sortable style="min-width: 12rem"></Column>
                            <Column field="telefono" header="Teléfono" sortable style="min-width: 12rem">
                                <template #body="slotProps">
                                    {{ slotProps.data.telefono || '-' }}
                                </template>
                            </Column>
                            <Column field="clasificacion" header="Clasificación" sortable style="min-width: 10rem">
                                <template #body="slotProps">
                                    {{ slotProps.data.clasificacion != null ? slotProps.data.clasificacion.toFixed(1) : '-' }}
                                </template>
                            </Column>
                            <Column field="resumen_conversacion" header="Resumen Conversación" sortable style="min-width: 15rem">
                                <template #body="slotProps">
                                    <span class="text-ellipsis max-w-xs block overflow-hidden whitespace-nowrap" :title="slotProps.data.resumen_conversacion">
                                        {{ slotProps.data.resumen_conversacion || '-' }}
                                    </span>
                                </template>
                            </Column>
                            <Column field="created_at" header="Fecha Creación" sortable style="min-width: 10rem">
                                <template #body="slotProps">
                                    {{ formatDate(slotProps.data.created_at) }}
                                </template>
                            </Column>

                            <Column header="Acciones" :exportable="false" style="min-width: 8rem">
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editCliente(slotProps.data, 'potencial')" />
                                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteCliente(slotProps.data, 'potencial')" />
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </TabPanel>

                <TabPanel header="Clientes No Potenciales">
                    <div class="flex flex-col gap-4">
                        <Toolbar class="mb-6">
                            <template #start>
                                <Button label="Añadir" icon="pi pi-plus" severity="contrast" class="mr-2" @click="openNew('no-potencial')" />
                                <Button
                                    label="Eliminar"
                                    icon="pi pi-trash"
                                    :severity="!clientesNoPotencialesSeleccionados || !clientesNoPotencialesSeleccionados.length ? 'secondary' : 'danger'"
                                    @click="confirmDeleteSelected('no-potencial')"
                                    :disabled="!clientesNoPotencialesSeleccionados || !clientesNoPotencialesSeleccionados.length"
                                />
                            </template>
                        </Toolbar>

                        <DataTable
                            ref="tablaNoPotenciales"
                            v-model:selection="clientesNoPotencialesSeleccionados"
                            :value="clientesNoPotenciales"
                            dataKey="id"
                            :paginator="true"
                            :rows="10"
                            :filters="filtersNoPotenciales"
                            :loading="loadingNoPotenciales"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            :rowsPerPageOptions="[5, 10, 25]"
                            currentPageReportTemplate="Mostrando de {first} a {last} de {totalRecords} items"
                        >
                            <template #header>
                                <div class="flex flex-wrap gap-2 items-center justify-between">
                                    <IconField>
                                        <InputIcon>
                                            <i class="pi pi-search" />
                                        </InputIcon>
                                        <InputText v-model="filtersNoPotenciales['global'].value" placeholder="Buscar..." />
                                    </IconField>
                                </div>
                            </template>

                            <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                            <Column field="nombre" header="Nombre" sortable style="min-width: 12rem"></Column>
                            <Column field="telefono" header="Teléfono" sortable style="min-width: 12rem">
                                <template #body="slotProps">
                                    {{ slotProps.data.telefono || '-' }}
                                </template>
                            </Column>
                            <Column field="clasificacion" header="Clasificación" sortable style="min-width: 10rem">
                                <template #body="slotProps">
                                    {{ slotProps.data.clasificacion != null ? slotProps.data.clasificacion.toFixed(1) : '-' }}
                                </template>
                            </Column>
                            <Column field="resumen_conversacion" header="Resumen Conversación" sortable style="min-width: 15rem">
                                <template #body="slotProps">
                                    <span class="text-ellipsis max-w-xs block overflow-hidden whitespace-nowrap" :title="slotProps.data.resumen_conversacion">
                                        {{ slotProps.data.resumen_conversacion || '-' }}
                                    </span>
                                </template>
                            </Column>
                            <Column field="created_at" header="Fecha Creación" sortable style="min-width: 10rem">
                                <template #body="slotProps">
                                    {{ formatDate(slotProps.data.created_at) }}
                                </template>
                            </Column>

                            <Column header="Acciones" :exportable="false" style="min-width: 8rem">
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editCliente(slotProps.data, 'no-potencial')" />
                                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteCliente(slotProps.data, 'no-potencial')" />
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </TabPanel>
            </TabView>

            <!-- Dialog para crear/editar cliente -->
            <Dialog v-model:visible="clienteDialog" :style="{ width: '550px' }" :header="cliente.id ? 'Editar Cliente' : 'Nuevo Cliente'" :modal="true">
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="nombre" class="block font-bold mb-3">Nombre</label>
                        <InputText id="nombre" v-model.trim="cliente.nombre" placeholder="Ingrese el nombre" autofocus fluid />
                    </div>

                    <div>
                        <label for="telefono" class="block font-bold mb-3">Teléfono</label>
                        <InputText id="telefono" v-model.trim="cliente.telefono" placeholder="Ingrese el teléfono" fluid />
                    </div>

                    <div>
                        <label for="clasificacion" class="block font-bold mb-3">Clasificación</label>
                        <InputNumber id="clasificacion" v-model="cliente.clasificacion" :min="0" :max="5" :maxFractionDigits="1" placeholder="0.0" fluid />
                    </div>

                    <div>
                        <label for="resumen_conversacion" class="block font-bold mb-3">Resumen Conversación</label>
                        <Textarea id="resumen_conversacion" v-model.trim="cliente.resumen_conversacion" rows="4" placeholder="Ingrese el resumen de la conversación" fluid />
                    </div>
                </div>

                <template #footer>
                    <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
                    <Button label="Guardar" icon="pi pi-check" @click="saveCliente" :loading="saving" />
                </template>
            </Dialog>

            <!-- Dialog de confirmación de eliminación individual -->
            <Dialog v-model:visible="deleteClienteDialog" :style="{ width: '450px' }" header="Confirmar eliminación" :modal="true">
                <div class="flex items-center gap-4">
                    <i class="pi pi-exclamation-triangle !text-3xl" />
                    <span v-if="cliente">¿Esta seguro que desea eliminar <b>{{ cliente.nombre || 'este cliente' }}</b>?</span>
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" text @click="deleteClienteDialog = false" />
                    <Button label="Si, eliminar" icon="pi pi-check" @click="deleteCliente" :loading="deleting" />
                </template>
            </Dialog>

            <!-- Dialog de confirmación de eliminación múltiple -->
            <Dialog v-model:visible="deleteClientesDialog" :style="{ width: '450px' }" header="Confirmar eliminación" :modal="true">
                <div class="flex items-center gap-4">
                    <i class="pi pi-exclamation-triangle !text-3xl" />
                    <span>¿Está seguro que desea eliminar los <b>{{ clientesSeleccionadosCount }}</b> elementos seleccionados?</span>
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" text @click="deleteClientesDialog = false" />
                    <Button label="Si, eliminar" icon="pi pi-check" text @click="deleteSelectedClientes" :loading="deleting" />
                </template>
            </Dialog>

            <Toast />
        </div>
    </Fluid>
</template>

<script setup>
import { n8nService } from '@/service/n8nService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';

const toast = useToast();

const activeTab = ref(0);
const loadingPotenciales = ref(false);
const loadingNoPotenciales = ref(false);
const saving = ref(false);
const deleting = ref(false);

const tablaPotenciales = ref();
const tablaNoPotenciales = ref();
const clienteDialog = ref(false);
const deleteClienteDialog = ref(false);
const deleteClientesDialog = ref(false);
const cliente = ref({});
const tipoClienteActual = ref('potencial'); // 'potencial' o 'no-potencial'

const clientesPotenciales = ref([]);
const clientesNoPotenciales = ref([]);
const clientesPotencialesSeleccionados = ref();
const clientesNoPotencialesSeleccionados = ref();

const filtersPotenciales = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const filtersNoPotenciales = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const agregar_item = ref(false);

const clientesSeleccionadosCount = computed(() => {
    if (tipoClienteActual.value === 'potencial') {
        return clientesPotencialesSeleccionados.value?.length || 0;
    } else {
        return clientesNoPotencialesSeleccionados.value?.length || 0;
    }
});

onMounted(async () => {
    await loadClientesPotenciales();
    await loadClientesNoPotenciales();
});

async function loadClientesPotenciales() {
    loadingPotenciales.value = true;
    try {
        clientesPotenciales.value = await n8nService.getClientesPotenciales({ skip: 0, limit: 100 });
    } catch (error) {
        console.error('Error al cargar clientes potenciales:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los clientes potenciales.',
            life: 5000
        });
    } finally {
        loadingPotenciales.value = false;
    }
}

async function loadClientesNoPotenciales() {
    loadingNoPotenciales.value = true;
    try {
        clientesNoPotenciales.value = await n8nService.getClientesNoPotenciales({ skip: 0, limit: 100 });
    } catch (error) {
        console.error('Error al cargar clientes no potenciales:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los clientes no potenciales.',
            life: 5000
        });
    } finally {
        loadingNoPotenciales.value = false;
    }
}

function openNew(tipo) {
    tipoClienteActual.value = tipo;
    cliente.value = {};
    agregar_item.value = false;
    clienteDialog.value = true;
}

function hideDialog() {
    clienteDialog.value = false;
    agregar_item.value = false;
}

async function saveCliente() {
    agregar_item.value = true;

    saving.value = true;
    try {
        const payload = {
            nombre: (cliente.value.nombre || '').trim() || null,
            telefono: (cliente.value.telefono || '').trim() || null,
            clasificacion: cliente.value.clasificacion != null ? Number(cliente.value.clasificacion) : null,
            resumen_conversacion: (cliente.value.resumen_conversacion || '').trim() || null
        };

        if (cliente.value.id) {
            if (tipoClienteActual.value === 'potencial') {
                await n8nService.actualizarClientePotencial(cliente.value.id, payload);
            } else {
                await n8nService.actualizarClienteNoPotencial(cliente.value.id, payload);
            }
            toast.add({ severity: 'success', summary: 'Exitoso', detail: 'Cliente actualizado', life: 3000 });
        } else {
            if (tipoClienteActual.value === 'potencial') {
                await n8nService.crearClientePotencial(payload);
            } else {
                await n8nService.crearClienteNoPotencial(payload);
            }
            toast.add({ severity: 'success', summary: 'Exitoso', detail: 'Cliente creado', life: 3000 });
        }

        if (tipoClienteActual.value === 'potencial') {
            await loadClientesPotenciales();
        } else {
            await loadClientesNoPotenciales();
        }
        hideDialog();
    } catch (error) {
        console.error('Error al guardar cliente:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo guardar el cliente. Intente nuevamente.',
            life: 5000
        });
    } finally {
        saving.value = false;
    }
}

function editCliente(cli, tipo) {
    tipoClienteActual.value = tipo;
    cliente.value = { ...cli };
    agregar_item.value = false;
    clienteDialog.value = true;
}

function confirmDeleteCliente(cli, tipo) {
    tipoClienteActual.value = tipo;
    cliente.value = cli;
    deleteClienteDialog.value = true;
}

async function deleteCliente() {
    if (!cliente.value.id) return;

    deleting.value = true;
    try {
        if (tipoClienteActual.value === 'potencial') {
            await n8nService.eliminarClientePotencial(cliente.value.id);
        } else {
            await n8nService.eliminarClienteNoPotencial(cliente.value.id);
        }
        toast.add({ severity: 'success', summary: 'Exitoso', detail: 'Cliente eliminado', life: 3000 });
        deleteClienteDialog.value = false;
        cliente.value = {};

        if (tipoClienteActual.value === 'potencial') {
            await loadClientesPotenciales();
        } else {
            await loadClientesNoPotenciales();
        }
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el cliente. Intente nuevamente.',
            life: 5000
        });
    } finally {
        deleting.value = false;
    }
}

function confirmDeleteSelected(tipo) {
    tipoClienteActual.value = tipo;
    deleteClientesDialog.value = true;
}

async function deleteSelectedClientes() {
    const seleccionados = tipoClienteActual.value === 'potencial' ? clientesPotencialesSeleccionados.value : clientesNoPotencialesSeleccionados.value;

    if (!seleccionados || seleccionados.length === 0) return;

    deleting.value = true;
    try {
        const deletePromises = seleccionados.map((cli) => {
            if (tipoClienteActual.value === 'potencial') {
                return n8nService.eliminarClientePotencial(cli.id);
            } else {
                return n8nService.eliminarClienteNoPotencial(cli.id);
            }
        });
        await Promise.all(deletePromises);
        toast.add({ severity: 'success', summary: 'Exitoso', detail: 'Clientes eliminados', life: 3000 });
        deleteClientesDialog.value = false;

        if (tipoClienteActual.value === 'potencial') {
            clientesPotencialesSeleccionados.value = null;
            await loadClientesPotenciales();
        } else {
            clientesNoPotencialesSeleccionados.value = null;
            await loadClientesNoPotenciales();
        }
    } catch (error) {
        console.error('Error al eliminar clientes:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron eliminar algunos clientes. Intente nuevamente.',
            life: 5000
        });
    } finally {
        deleting.value = false;
    }
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
</script>
