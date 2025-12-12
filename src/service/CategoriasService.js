import api from '@/api/index';
import { safePathParam } from '@/api/utils';

/**
 * Servicio para gestionar categorías y subcategorías de productos.
 *
 * @namespace CategoriasService
 */
export const CategoriasService = {
    /**
     * Obtiene todas las categorías de productos.
     *
     * @returns {Promise<Array>} Promise que resuelve con un array de categorías.
     * @throws {Error} Si ocurre un error al obtener las categorías.
     */
    async getCategorias() {
        try {
            const response = await api.get('/categorias/');
            return response.data;
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            throw error;
        }
    },

    /**
     * Obtiene todas las subcategorías (clases) de productos.
     *
     * @returns {Promise<Array>} Promise que resuelve con un array de subcategorías.
     * @throws {Error} Si ocurre un error al obtener las subcategorías.
     */
    async getSubCategorias() {
        try {
            const response = await api.get('/subcategorias/');
            return response.data;
        } catch (error) {
            console.error('Error al obtener subcategorías:', error);
            throw error;
        }
    },

    /**
     * Obtiene una categoría específica por su ID.
     *
     * @param {number|string} id - ID de la categoría.
     * @returns {Promise<Object>} Promise que resuelve con los datos de la categoría.
     * @throws {Error} Si ocurre un error al obtener la categoría.
     */
    async getCategoria(id) {
        try {
            const safeId = safePathParam(id, 'id');
            const response = await api.get('/categorias/' + safeId);
            return response.data;
        } catch (error) {
            console.error('Error al obtener categoría:', error);
            throw error;
        }
    }
};

