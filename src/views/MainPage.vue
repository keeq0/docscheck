<template>
  <div class="main-page">
    <div class="main-page__header">
      <h1 class="main-page__title">Загрузка документов</h1>
      <button class="main-page__hide">
        Скрыть меню
      </button>
    </div>
    <div class="main-page__content">
      <UploadDocuments 
        :processing="processing" 
        @processing-started="handleProcessingStarted" 
        @document-uploaded="handleDocumentUploaded" />
      <AnalysisResult 
        v-if="showAnalysis" 
        :documentUrl="uploadedDocumentUrl"
        :documentName="uploadedDocumentName"
        @analysis-complete="handleAnalysisComplete"
        @show-assistant="activateAssistant" />
      
      <AiAssistant 
        v-if="showAssistant"
        ref="assistantRef"
        :visible="assistantVisible" 
        @close="hideAssistant"
        @processing-complete="handleProcessingComplete"
        :analysisResult="analysisData.result"
        :analysisError="analysisData.error" />
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
      uploadedDocumentName: '',
      analysisData: {
        result: null,
        error: false
      }
    }
  },
  methods: {
    handleAnalysisComplete(data) {
      this.analysisData = data;
      if (this.showAssistant) {
        this.assistantVisible = true;
      }
    },

    activateAssistant() {
      this.showAssistant = true;
      this.$nextTick(() => {
        this.assistantVisible = true;
      });
    },


    handleProcessingStarted() {
      this.processing = true;
      setTimeout(() => {
        this.activateAssistant();
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
      this.uploadedDocumentUrl = URL.createObjectURL(file);
      this.uploadedDocumentName = file.name;
    },

    hideAssistant() {
      this.assistantVisible = false;
    }
  }
}
</script>

<style scoped>
.main-page__title {
  font-size: 28px;
}
.main-page__content {
  display: flex;
  gap: 20px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.main-page__header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding-bottom: 20px;
}

.main-page__hide {
  width: fit-content;
  height: 20px;
  background: #fff;
  border: none;
  outline: none;
  border-radius: 10px;
  color: #000;
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid #e6e6e6;
  padding: 0 10px;
}

.main-page__hide:hover {
  background-color: #fdfdfd;
}
</style>