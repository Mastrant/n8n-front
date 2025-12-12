/**
 * Servicio para gestionar el Chatbot IA.
 * Maneja sesiones, mensajes y comunicación con el backend.
 *
 * @namespace iaService
 */
import api from '@/api/index.js';
import { safePathParam } from '@/api/utils';

/**
 * Crea una nueva sesión de chat con IA.
 *
 * @param {Object} payload - Datos de la sesión.
 * @param {string} [payload.rol_ia] - Rol de la IA (ej: "Asesor de compras").
 * @returns {Promise<Object>} Promise que resuelve con {session_id, rol_ia}.
 * @throws {Error} Si ocurre un error al crear la sesión.
 */
async function crearSesionIA(payload = {}) {
    try {
        const response = await api.post('/chat/session', payload);
        return response.data;
    } catch (error) {
        console.error('Error al crear sesión IA:', error);
        throw error;
    }
}

/**
 * Envía un mensaje al chatbot IA y obtiene respuesta.
 *
 * @param {string} sessionId - ID de la sesión de chat (UUID).
 * @param {string} messageText - Mensaje del usuario.
 * @returns {Promise<Object>} Promise que resuelve con la respuesta de la IA.
 * @throws {Error} Si ocurre un error al enviar el mensaje.
 */
async function enviarMensajeIA(sessionId, messageText) {
    try {
        const safeSessionId = safePathParam(sessionId, 'session_id');
        const payload = {
            session_id: safeSessionId,
            sender: 'user',
            message_text: messageText.trim()
        };
        
        const response = await api.post('/chat/message', payload);
        return response.data;
    } catch (error) {
        console.error('Error al enviar mensaje IA:', error);
        throw error;
    }
}

/**
 * Obtiene el historial de mensajes de una sesión.
 *
 * @param {string} sessionId - ID de la sesión de chat (UUID).
 * @param {Object} [params] - Parámetros opcionales.
 * @param {number} [params.limit] - Número máximo de mensajes (default: 50).
 * @returns {Promise<Array>} Promise que resuelve con array de mensajes.
 * @throws {Error} Si ocurre un error al obtener mensajes.
 */
async function obtenerMensajesSesion(sessionId, params = {}) {
    try {
        const safeSessionId = safePathParam(sessionId, 'session_id');
        const response = await api.get(`/chat/messages/${safeSessionId}`, { 
            params: { 
                limit: params.limit || 50 
            } 
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener mensajes de sesión:', error);
        throw error;
    }
}

export const iaService = {
    crearSesionIA,
    enviarMensajeIA,
    obtenerMensajesSesion
};
