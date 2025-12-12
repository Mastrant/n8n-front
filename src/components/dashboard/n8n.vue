<template>
    <Fluid>
        <div class="card flex flex-col gap-4 w-full">
            <div class="font-semibold text-xl">Gestión del Sistema</div>

            <TabView>
                <TabPanel header="Productos">
                    <ProductosTable />
                </TabPanel>

                <TabPanel header="Chat con IA">
                    <ChatIA />
                </TabPanel>

                <TabPanel header="Clientes">
                    <ClientesTable />
                </TabPanel>
            </TabView>
        </div>
    </Fluid>
</template>

<script setup>
import ProductosTable from './ProductosTable.vue';
import ChatIA from './ChatIA.vue';
import ClientesTable from './ClientesTable.vue';
</script>
