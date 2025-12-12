import api from '@/api/index';
import { safePathParam } from '@/api/utils';

/**
 * Servicio para gestionar productos y clientes.
 * Maneja operaciones CRUD para estos recursos.
 *
 * @namespace n8nService
 */
export const n8nService = {
    // ==================== PRODUCTOS ====================

    /**
     * Obtiene todos los productos desde el backend.
     *
     * @param {Object} params - Parámetros de consulta opcionales.
     * @param {number} params.skip - Número de registros a omitir (paginación, default: 0).
     * @param {number} params.limit - Número máximo de registros a retornar (default: 100, max: 1000).
     * @returns {Promise<Array>} Promise que resuelve con un array de productos.
     * @throws {Error} Si ocurre un error al obtener los productos.
     */
    async getProductos(params = {}) {
        try {
            const response = await api.get('/productos', { params });
            return response.data;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    },

    /**
     * Obtiene un producto específico por su ID.
     *
     * @param {number|string} id - ID del producto.
     * @returns {Promise<Object>} Promise que resuelve con los datos del producto.
     * @throws {Error} Si ocurre un error al obtener el producto.
     */
    async getProducto(id) {
        try {
            const safeId = safePathParam(id, 'id');
            const response = await api.get('/productos/' + safeId);
            return response.data;
        } catch (error) {
            console.error('Error al obtener producto:', error);
            throw error;
        }
    },

    /**
     * Crea un nuevo producto.
     *
     * @param {Object} payload - Datos del producto a crear.
     * @param {string} payload.nombre - Nombre del producto (requerido).
     * @param {string} [payload.descripcion] - Descripción del producto (opcional).
     * @param {number} [payload.precio] - Precio del producto (opcional).
     * @param {number} [payload.stock] - Stock del producto (opcional).
     * @returns {Promise<Object>} Promise que resuelve con el producto creado (201).
     * @throws {Error} Si ocurre un error al crear el producto.
     */
    async crearProducto(payload) {
        try {
            const response = await api.post('/productos', payload);
            return response.data;
        } catch (error) {
            console.error('Error al crear producto:', error);
            throw error;
        }
    },

    /**
     * Actualiza un producto existente.
     *
     * @param {number|string} id - ID del producto a actualizar.
     * @param {Object} payload - Datos actualizados del producto (todos los campos opcionales).
     * @returns {Promise<Object>} Promise que resuelve con el producto actualizado.
     * @throws {Error} Si ocurre un error al actualizar el producto.
     */
    async actualizarProducto(id, payload) {
        try {
            const safeId = safePathParam(id, 'id');
            const response = await api.put('/productos/' + safeId, payload);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    },

    /**
     * Elimina un producto del sistema.
     *
     * @param {number|string} id - ID del producto a eliminar.
     * @returns {Promise<Object>} Promise que resuelve con la confirmación de eliminación.
     * @throws {Error} Si ocurre un error al eliminar el producto.
     */
    async eliminarProducto(id) {
        try {
            const safeId = safePathParam(id, 'id');
            const response = await api.delete('/productos/' + safeId);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    },

    // ==================== CLIENTES POTENCIALES ====================

    /**
     * Obtiene todos los clientes potenciales desde el backend.
     *
     * @param {Object} params - Parámetros de consulta opcionales.
     * @param {number} params.skip - Número de registros a omitir (paginación, default: 0).
     * @param {number} params.limit - Número máximo de registros a retornar (default: 100, max: 1000).
     * @returns {Promise<Array>} Promise que resuelve con un array de clientes potenciales.
     * @throws {Error} Si ocurre un error al obtener los clientes potenciales.
     */
    async getClientesPotenciales(params = {}) {
        try {
            const response = await api.get('/clientes', { params });
            return response.data;
        } catch (error) {
            console.error('Error al obtener clientes potenciales:', error);
            throw error;
        }
    },

    /**
     * Obtiene un cliente potencial específico por su ID.
     *
     * @param {number|string} id - ID del cliente potencial.
     * @returns {Promise<Object>} Promise que resuelve con los datos del cliente potencial.
     * @throws {Error} Si ocurre un error al obtener el cliente potencial.
     */
    async getClientePotencial(id) {
        try {
            const safeId = safePathParam(id, 'id');
            const response = await api.get('/clientes/' + safeId);
            return response.data;
        } catch (error) {
            console.error('Error al obtener cliente potencial:', error);
            throw error;
        }
    },

    /**
     * Crea un nuevo cliente potencial.
     *
     * @param {Object} payload - Datos del cliente potencial a crear (todos los campos opcionales).
     * @param {string} [payload.nombre] - Nombre del cliente.
     * @param {string} [payload.telefono] - Teléfono del cliente.
     * @param {number} [payload.clasificacion] - Clasificación del cliente.
     * @param {string} [payload.resumen_conversacion] - Resumen de la conversación.
     * @returns {Promise<Object>} Promise que resuelve con el cliente potencial creado (201).
     * @throws {Error} Si ocurre un error al crear el cliente potencial.
     */
    async crearClientePotencial(payload) {
        try {
            const response = await api.post('/clientes', payload);
            return response.data;
        } catch (error) {
            console.error('Error al crear cliente potencial:', error);
            throw error;
        }
    },

    /**
     * Actualiza un cliente potencial existente.
     *
     * @param {number|string} id - ID del cliente potencial a actualizar.
     * @param {Object} payload - Datos actualizados del cliente potencial (todos los campos opcionales).
     * @returns {Promise<Object>} Promise que resuelve con el cliente potencial actualizado.
     * @throws {Error} Si ocurre un error al actualizar el cliente potencial.
     */
    async actualizarClientePotencial(id, payload) {
        try {
            const safeId = safePathParam(id, 'id');
            const response = await api.put('/clientes/' + safeId, payload);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar cliente potencial:', error);
            throw error;
        }
    },

    /**
     * Elimina un cliente potencial del sistema.
     *
     * @param {number|string} id - ID del cliente potencial a eliminar.
     * @returns {Promise<Object>} Promise que resuelve con la confirmación de eliminación.
     * @throws {Error} Si ocurre un error al eliminar el cliente potencial.
     */
    async eliminarClientePotencial(id) {
        try {
            const safeId = safePathParam(id, 'id');
            const response = await api.delete('/clientes/' + safeId);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar cliente potencial:', error);
            throw error;
        }
    },

    // ==================== CLIENTES NO POTENCIALES ====================

    /**
     * Obtiene todos los clientes no potenciales desde el backend.
     *
     * @param {Object} params - Parámetros de consulta opcionales.
     * @param {number} params.skip - Número de registros a omitir (paginación, default: 0).
     * @param {number} params.limit - Número máximo de registros a retornar (default: 100, max: 1000).
     * @returns {Promise<Array>} Promise que resuelve con un array de clientes no potenciales.
     * @throws {Error} Si ocurre un error al obtener los clientes no potenciales.
     */
    async getClientesNoPotenciales(params = {}) {
        try {
            const response = await api.get('/clientes-no-potenciales', { params });
            return response.data;
        } catch (error) {
            console.error('Error al obtener clientes no potenciales:', error);
            throw error;
        }
    },

    /**
     * Obtiene un cliente no potencial específico por su ID.
     *
     * @param {number|string} id - ID del cliente no potencial.
     * @returns {Promise<Object>} Promise que resuelve con los datos del cliente no potencial.
     * @throws {Error} Si ocurre un error al obtener el cliente no potencial.
     */
    async getClienteNoPotencial(id) {
        try {
            const safeId = safePathParam(id, 'id');
            const response = await api.get('/clientes-no-potenciales/' + safeId);
            return response.data;
        } catch (error) {
            console.error('Error al obtener cliente no potencial:', error);
            throw error;
        }
    },

    /**
     * Crea un nuevo cliente no potencial.
     *
     * @param {Object} payload - Datos del cliente no potencial a crear (todos los campos opcionales).
     * @param {string} [payload.nombre] - Nombre del cliente.
     * @param {string} [payload.telefono] - Teléfono del cliente.
     * @param {number} [payload.clasificacion] - Clasificación del cliente.
     * @param {string} [payload.resumen_conversacion] - Resumen de la conversación.
     * @returns {Promise<Object>} Promise que resuelve con el cliente no potencial creado (201).
     * @throws {Error} Si ocurre un error al crear el cliente no potencial.
     */
    async crearClienteNoPotencial(payload) {
        try {
            const response = await api.post('/clientes-no-potenciales', payload);
            return response.data;
        } catch (error) {
            console.error('Error al crear cliente no potencial:', error);
            throw error;
        }
    },

    /**
     * Actualiza un cliente no potencial existente.
     *
     * @param {number|string} id - ID del cliente no potencial a actualizar.
     * @param {Object} payload - Datos actualizados del cliente no potencial (todos los campos opcionales).
     * @returns {Promise<Object>} Promise que resuelve con el cliente no potencial actualizado.
     * @throws {Error} Si ocurre un error al actualizar el cliente no potencial.
     */
    async actualizarClienteNoPotencial(id, payload) {
        try {
            const safeId = safePathParam(id, 'id');
            const response = await api.put('/clientes-no-potenciales/' + safeId, payload);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar cliente no potencial:', error);
            throw error;
        }
    },

    /**
     * Elimina un cliente no potencial del sistema.
     *
     * @param {number|string} id - ID del cliente no potencial a eliminar.
     * @returns {Promise<Object>} Promise que resuelve con la confirmación de eliminación.
     * @throws {Error} Si ocurre un error al eliminar el cliente no potencial.
     */
    async eliminarClienteNoPotencial(id) {
        try {
            const safeId = safePathParam(id, 'id');
            const response = await api.delete('/clientes-no-potenciales/' + safeId);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar cliente no potencial:', error);
            throw error;
        }
    }
};
