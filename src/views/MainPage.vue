<template>
  <div class="main-page">
    <h1 class="main-page__title">Загрузка и анализ документа(-ов)</h1>
    <UploadDocuments :processing="processing" @processing-started="handleProcessingStarted" />
    <AiAssistant v-if="showAssistant" :visible="assistantVisible" @processing-complete="handleProcessingComplete" />
  </div>
</template>

<script>
import AiAssistant from '@/components/AiAssistant.vue'
import UploadDocuments from '@/components/UploadDocuments.vue'
export default {
  name: 'MainPage',
  components: { AiAssistant, UploadDocuments },
  data() {
    return {
      processing: false,
      showAssistant: false,
      assistantVisible: false
    }
  },
  methods: {
    handleProcessingStarted() {
      this.processing = true;
      setTimeout(() => {
        this.showAssistant = true;
        this.assistantVisible = false; 
        this.$nextTick(() => {
          setTimeout(() => {
            this.assistantVisible = true;
          }, 50);
        });
      }, 1000);
    },
    handleProcessingComplete() {
      this.processing = false;
    }
  }
}
</script>

<style scoped>
.main-page__title {
  font-size: 24px;
  padding-bottom: 20px;
}
</style>
