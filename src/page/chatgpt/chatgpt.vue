<template>
  <div>
    <input v-model="message" @keyup.enter="sendMessage" />
    <div v-for="(msg, index) in messages" :key="index">
      {{ msg }}
    </div>
  </div>
</template>
 
<script>
import chatgptAPI from '@/api/chatgpt';
 
export default {
  data() {
    return {
      message: '',
      messages: [],
    };
  },
  methods: {
    async sendMessage() {
      const response = await chatgptAPI.getResponse(this.message);
      this.messages.push(response.message);
      this.message = '';
    },
  },
};
</script>