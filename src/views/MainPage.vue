<template>
  <div class="main-page">
    <h1 class="main-page__title">Загрузка и анализ документа(-ов)</h1>
    <div class="main-page__content">
      <UploadDocuments :processing="processing" @processing-started="handleProcessingStarted" />
      <AiAssistant v-if="showAssistant" :visible="assistantVisible" @processing-complete="handleProcessingComplete" />
      <AnalysisResult />
    </div>
  </div>
</template>

<script>
import AiAssistant from '@/components/AiAssistant.vue'
import AnalysisResult from '@/components/AnalysisResult.vue';
import UploadDocuments from '@/components/UploadDocuments.vue'
export default {
  name: 'MainPage',
  components: { AiAssistant, UploadDocuments, AnalysisResult },
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

.main-page__content {
  display: flex;
  gap: 40px;
}
</style>
