<template>
    <Card class="mt-5">
      <template #title>
        <h3 class="text-primary">Chat con IA</h3>
      </template>
      <template #content>
        <!-- Rol IA -->
        <div class="mb-3">
          <label for="rol" class="block mb-2">Definir Rol:</label>
          <Textarea
            id="rol"
            v-model="rolIA"
            rows="2"
            placeholder="Ej: Actúa como asesor de compras..."
          />
          <Button
            v-if="!sessionId"
            label="Iniciar Chat"
            @click="createSession"
            class="mt-2"
          />
        </div>
  
        <!-- Chat Window -->
        <div
          class="chat-window p-3 border-round surface-card shadow-1"
          style="height:300px; overflow-y:auto;"
        >
          <div
            v-for="msg in chatMessages"
            :key="msg.id"
            class="mb-2 animate__animated animate__fadeIn"
          >
            <div :class="msg.sender === 'user' ? 'text-right' : 'text-left'">
              <span
                :class="msg.sender === 'user'
                  ? 'bg-blue-100 p-2 border-round'
                  : 'bg-green-100 p-2 border-round'"
              >
                {{ msg.message_text }}
              </span>
            </div>
          </div>
          <div v-if="isLoading" class="text-center p-3">
            <i class="pi pi-spin pi-spinner mr-2"></i>
            IA está respondiendo...
          </div>
          <div
            v-if="chatMessages.length === 0 && sessionId"
            class="text-center p-3 text-500"
          >
            💬 ¡Chat listo! Escribe tu primer mensaje.
          </div>
        </div>
  
        <!-- Input -->
        <div class="flex gap-2 mt-3" v-if="sessionId">
          <InputText
            v-model="newMessage"
            placeholder="Escribe tu mensaje..."
            class="flex-1"
            @keyup="handleKeyup"
            :disabled="isLoading || !sessionId"
            autocomplete="off"
          />
          <Button
            icon="pi pi-send"
            @click="sendMessage"
            :loading="isLoading"
            :disabled="!newMessage?.trim() || isLoading"
          />
        </div>
      </template>
    </Card>
  </template>
  



<script setup>
    import { ref } from 'vue';
    import { useToast } from 'primevue/usetoast';
    import { iaService } from '@/service/IaService.js';
    
    const toast = useToast();
    
    // Estado
    const rolIA = ref('');
    const chatMessages = ref([]);
    const newMessage = ref('');
    const sessionId = ref(null);
    const isLoading = ref(false);
    
    /**
     * Crea nueva sesión de chat con IA.
     */
    async function createSession() {
      if (!rolIA.value.trim()) {
        toast.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'Define un rol para la IA antes de iniciar'
        });
        return;
      }
    
      try {
        isLoading.value = true;
        const response = await iaService.crearSesionIA({
          rol_ia: rolIA.value.trim()
        });
    
        sessionId.value = response.session_id;
        chatMessages.value = [];
    
        toast.add({
          severity: 'success',
          summary: 'Chat iniciado',
          detail: `Sesión ${response.session_id.slice(0, 8)}... creada`
        });
    
        // Mensaje de bienvenida IA
        chatMessages.value.push({
          id: 'welcome',
          sender: 'ia',
          message_text: `¡Hola! Soy tu ${rolIA.value.toLowerCase()}. ¿En qué puedo ayudarte?`,
          created_at: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error creando sesión:', error);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo iniciar el chat. Revisa la conexión.'
        });
      } finally {
        isLoading.value = false;
      }
    }
    
    /**
     * Envía mensaje al chatbot y agrega respuesta.
     */
    async function sendMessage() {
      if (!newMessage.value?.trim() || isLoading.value || !sessionId.value) return;
    
      const userMessage = newMessage.value.trim();
      newMessage.value = '';
    
      const userMsgId = Date.now();
      chatMessages.value.push({
        id: userMsgId,
        sender: 'user',
        message_text: userMessage,
        created_at: new Date().toISOString()
      });
    
      isLoading.value = true;
    
      try {
        const iaResponse = await iaService.enviarMensajeIA(sessionId.value, userMessage);
    
        chatMessages.value.push({
          id: iaResponse.id,
          sender: 'ia',
          message_text: iaResponse.message_text,
          created_at: iaResponse.created_at
        });
      } catch (error) {
        console.error('Error enviando mensaje:', error);
    
        const errorIndex = chatMessages.value.findIndex(msg => msg.id === userMsgId);
        if (errorIndex !== -1) {
          chatMessages.value[errorIndex] = {
            id: userMsgId,
            sender: 'user',
            message_text: '✖️ Error de conexión',
            created_at: new Date().toISOString()
          };
        }
    
        chatMessages.value.push({
          id: Date.now(),
          sender: 'ia',
          message_text: 'Lo siento, hubo un error. Intenta de nuevo.',
          created_at: new Date().toISOString()
        });
      } finally {
        isLoading.value = false;
        setTimeout(() => {
          const chatWindow = document.querySelector('.chat-window');
          if (chatWindow) chatWindow.scrollTop = chatWindow.scrollHeight;
        }, 100);
      }
    }
    
    // Enter para enviar
    const handleKeyup = event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    };
    </script>
    