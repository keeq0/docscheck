<template>
  <div class="main-page">
    <h1 class="main-page__title">Загрузка и анализ документа(-ов)</h1>
    <div class="main-page__content">
      <UploadDocuments 
        :processing="processing" 
        @processing-started="handleProcessingStarted" 
        @document-uploaded="handleDocumentUploaded" />
      <AiAssistant 
        v-if="showAssistant" 
        :visible="assistantVisible" 
        @processing-complete="handleProcessingComplete" />
      <transition name="fade">
        <!-- Передаем как URL, так и имя файла -->
        <AnalysisResult 
          v-if="showAnalysis" 
          :documentUrl="uploadedDocumentUrl"
          :documentName="uploadedDocumentName" />
      </transition>
    </div>
  </div>
</template>

<script>
import AiAssistant from '@/components/AiAssistant.vue';
import AnalysisResult from '@/components/AnalysisResult.vue';
import UploadDocuments from '@/components/UploadDocuments.vue';

export default {
  name: 'MainPage',
  components: { AiAssistant, AnalysisResult, UploadDocuments },
  data() {
    return {
      processing: false,
      showAssistant: false,
      assistantVisible: false,
      showAnalysis: false,
      uploadedDocumentUrl: '',
      uploadedDocumentName: ''
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
      setTimeout(() => {
        this.showAnalysis = true;
      }, 2500);
    },
    handleProcessingComplete() {
      this.processing = false;
    },
    handleDocumentUploaded(file) {
      // Сохраняем URL и имя файла
      this.uploadedDocumentUrl = URL.createObjectURL(file);
      this.uploadedDocumentName = file.name;
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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
