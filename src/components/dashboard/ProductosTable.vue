<template>
    <Fluid>
        <div class="card flex flex-col gap-4 w-full">
            <div class="font-semibold text-xl">Gestión de Productos</div>

            <Toolbar class="mb-6">
                <template #start>
                    <Button label="Añadir" icon="pi pi-plus" severity="contrast" class="mr-2" @click="openNew" />
                    <Button
                        label="Eliminar"
                        icon="pi pi-trash"
                        :severity="!productosSeleccionados || !productosSeleccionados.length ? 'secondary' : 'danger'"
                        @click="confirmDeleteSelected"
                        :disabled="!productosSeleccionados || !productosSeleccionados.length"
                    />
                </template>
            </Toolbar>

            <!-- Tabla de productos -->
            <DataTable
                ref="tabla"
                v-model:selection="productosSeleccionados"
                :value="productos"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                :loading="loading"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Mostrando de {first} a {last} de {totalRecords} items"
            >
                <!-- Encabezado de la tabla con búsqueda global -->
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                        </IconField>
                    </div>
                </template>

                <!-- Columnas de datos -->
                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>

                <Column field="nombre" header="Nombre" sortable style="min-width: 12rem"></Column>

                <Column field="categoria" header="Categoría" sortable style="min-width: 15rem">
                    <template #body="slotProps">
                        {{ slotProps.data.categoria || '-' }}
                    </template>
                </Column>

                <Column field="precio" header="Precio" sortable style="min-width: 8rem">
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.precio) }}
                    </template>
                </Column>

                <Column field="stock" header="Stock" sortable style="min-width: 8rem">
                    <template #body="slotProps">
                        {{ slotProps.data.stock || 0 }} unidades
                    </template>
                </Column>

                <Column field="created_at" header="Fecha Creación" sortable style="min-width: 10rem">
                    <template #body="slotProps">
                        {{ formatDate(slotProps.data.created_at) }}
                    </template>
                </Column>

                <Column header="Acciones" :exportable="false" style="min-width: 8rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>

            <!-- Dialog para crear/editar producto -->
            <Dialog v-model:visible="productDialog" :style="{ width: '550px' }" header="Detalles del Producto" :modal="true">
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="nombre" class="block font-bold mb-3">Nombre *</label>
                        <InputText id="nombre" v-model.trim="product.nombre" required="true" placeholder="Ingrese el nombre del producto" autofocus :invalid="agregar_item && !product.nombre" fluid />
                        <small v-if="agregar_item && !product.nombre" class="text-red-500">Nombre es requerido.</small>
                    </div>

                    <div>
                        <label for="categoria" class="block font-bold mb-3">Categoría</label>
                        <InputText id="categoria" v-model.trim="product.categoria" rows="3" placeholder="Ingrese la Categoría del producto" fluid />
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-6">
                            <label for="precio" class="block font-bold mb-3">Precio</label>
                            <InputNumber id="precio" v-model="product.precio" mode="decimal" :min="0" :maxFractionDigits="2" placeholder="0.00" fluid />
                        </div>
                        <div class="col-span-6">
                            <label for="stock" class="block font-bold mb-3">Stock</label>
                            <InputNumber id="stock" v-model="product.stock" integeronly placeholder="0" :min="0" fluid />
                        </div>
                    </div>
                </div>

                <template #footer>
                    <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
                    <Button label="Guardar" icon="pi pi-check" @click="saveProduct" :loading="saving" />
                </template>
            </Dialog>

            <!-- Dialog de confirmación de eliminación individual -->
            <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirmar eliminación" :modal="true">
                <div class="flex items-center gap-4">
                    <i class="pi pi-exclamation-triangle !text-3xl" />
                    <span v-if="product">¿Esta seguro que desea eliminar <b>{{ product.nombre }}</b>?</span>
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
                    <Button label="Si, eliminar" icon="pi pi-check" @click="deleteProduct" :loading="deleting" />
                </template>
            </Dialog>

            <!-- Dialog de confirmación de eliminación múltiple -->
            <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirmar eliminación" :modal="true">
                <div class="flex items-center gap-4">
                    <i class="pi pi-exclamation-triangle !text-3xl" />
                    <span>¿Está seguro que desea eliminar los <b>{{ productosSeleccionados.length }}</b> elementos seleccionados?</span>
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
                    <Button label="Si, eliminar" icon="pi pi-check" text @click="deleteSelectedProducts" :loading="deleting" />
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
import { onMounted, ref } from 'vue';

const toast = useToast();

const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);

const tabla = ref();
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const productosSeleccionados = ref();
const productos = ref([]);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const agregar_item = ref(false);

// Cargar datos iniciales
onMounted(async () => {
    await loadProductos();
});

async function loadProductos() {
    loading.value = true;
    try {
        productos.value = await n8nService.getProductos({ skip: 0, limit: 100 });
    } catch (error) {
        console.error('Error al cargar productos:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los productos.',
            life: 5000
        });
    } finally {
        loading.value = false;
    }
}

function formatCurrency(value) {
    if (value != null && value !== undefined) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
    }
    return '$0.00';
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

function openNew() {
    product.value = {};
    agregar_item.value = false;
    productDialog.value = true;
}

function hideDialog() {
    productDialog.value = false;
    agregar_item.value = false;
}

async function saveProduct() {
    agregar_item.value = true;

    if (!product.value.nombre || !product.value.nombre.trim()) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'El nombre es obligatorio', life: 3000 });
        return;
    }

    saving.value = true;
    try {
        const payload = {
            nombre: (product.value.nombre || '').trim(),
            categoria: (product.value.categoria || '').trim() || null,
            precio: product.value.precio != null ? Number(product.value.precio) : null,
            stock: product.value.stock != null ? Number(product.value.stock) : null
        };

        if (product.value.id) {
            await n8nService.actualizarProducto(product.value.id, payload);
            toast.add({ severity: 'success', summary: 'Exitoso', detail: 'Producto actualizado', life: 3000 });
        } else {
            await n8nService.crearProducto(payload);
            toast.add({ severity: 'success', summary: 'Exitoso', detail: 'Producto creado', life: 3000 });
        }

        await loadProductos();
        hideDialog();
    } catch (error) {
        console.error('Error al guardar producto:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo guardar el producto. Intente nuevamente.',
            life: 5000
        });
    } finally {
        saving.value = false;
    }
}

function editProduct(prod) {
    product.value = { ...prod };
    agregar_item.value = false;
    productDialog.value = true;
}

function confirmDeleteProduct(prod) {
    product.value = prod;
    deleteProductDialog.value = true;
}

async function deleteProduct() {
    if (!product.value.id) return;

    deleting.value = true;
    try {
        await n8nService.eliminarProducto(product.value.id);
        toast.add({ severity: 'success', summary: 'Exitoso', detail: 'Producto eliminado', life: 3000 });
        deleteProductDialog.value = false;
        product.value = {};
        await loadProductos();
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el producto. Intente nuevamente.',
            life: 5000
        });
    } finally {
        deleting.value = false;
    }
}

function confirmDeleteSelected() {
    deleteProductsDialog.value = true;
}

async function deleteSelectedProducts() {
    if (!productosSeleccionados.value || productosSeleccionados.value.length === 0) return;

    deleting.value = true;
    try {
        const deletePromises = productosSeleccionados.value.map((prod) => n8nService.eliminarProducto(prod.id));
        await Promise.all(deletePromises);
        toast.add({ severity: 'success', summary: 'Exitoso', detail: 'Productos eliminados', life: 3000 });
        deleteProductsDialog.value = false;
        productosSeleccionados.value = null;
        await loadProductos();
    } catch (error) {
        console.error('Error al eliminar productos:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron eliminar algunos productos. Intente nuevamente.',
            life: 5000
        });
    } finally {
        deleting.value = false;
    }
}
</script>
