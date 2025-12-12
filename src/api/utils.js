/**
 * Valida y sanitiza parámetros de ruta para prevenir inyección de código.
 *
 * @param {number|string} param - Parámetro a validar.
 * @param {string} paramName - Nombre del parámetro para mensajes de error.
 * @returns {string} Parámetro sanitizado como string.
 * @throws {Error} Si el parámetro no es válido.
 */
export function safePathParam(param, paramName = 'param') {
    if (param === null || param === undefined) {
        throw new Error(`El parámetro ${paramName} es requerido`);
    }

    const paramStr = String(param).trim();

    if (paramStr === '') {
        throw new Error(`El parámetro ${paramName} no puede estar vacío`);
    }

    // Validar que solo contenga caracteres alfanuméricos, guiones y guiones bajos
    if (!/^[a-zA-Z0-9_-]+$/.test(paramStr)) {
        throw new Error(`El parámetro ${paramName} contiene caracteres inválidos`);
    }

    return paramStr;
}

