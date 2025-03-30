<template>
  <div class="analysis">
    <div class="analysis__header">
      <h2>Анализ документов</h2>
      <!-- Используем computed-свойство truncatedDocumentName -->
      <p class="header__file">{{ truncatedDocumentName }} ({{ totalPages }} стр.)</p>
    </div>
    <div class="analysis__content">
      <div class="content__document" ref="documentContainer">
        <!-- PDF-страницы будут динамически добавляться сюда -->
      </div>
      <div class="content__panel">
        <ul class="panel__levels">
          <li class="levels__item">
            <div class="item__color green"></div>
            <p class="item__text">Хорошо</p>
          </li>
          <li class="levels__item">
            <div class="item__color yellow"></div>
            <p class="item__text">Сомнительно</p>
          </li>
          <li class="levels__item">
            <div class="item__color red"></div>
            <p class="item__text">Большие риски</p>
          </li>
        </ul>
        <button class="panel__button ai-assistant" @click="toggleAssistant">
          ИИ‑Помощник
        </button>
        <button class="panel__button note">Новая заметка</button>
        <button class="panel__button save">Сохранить</button>
        <button class="panel__button download">Скачать отчет</button>
        <button class="panel__button download-all">Скачать готовый документ</button>
      </div>
    </div>
    <AiAssistant :visible="assistantVisible" @close="assistantVisible = false" />
  </div>
</template>

<script>
import AiAssistant from '@/components/AiAssistant.vue';

export default {
  name: 'AnalysisResult',
  components: { AiAssistant },
  props: {
    documentUrl: {
      type: String,
      default: ''
    },
    documentName: {
      type: String,
      default: 'Документ'
    }
  },
  data() {
    return {
      assistantVisible: false,
      totalPages: 0,
      pdfjsLib: null,
      zoom: 1.5,
      minZoom: 1,
      maxZoom: 3
    };
  },
  computed: {
    truncatedDocumentName() {
      if (this.documentName && this.documentName.length > 15) {
        return this.documentName.slice(0, 15) + '..';
      }
      return this.documentName;
    }
  },
  methods: {
    async renderPDF() {
      if (!this.documentUrl || !this.pdfjsLib) return;
      const container = this.$refs.documentContainer;
      const containerWidth = container.clientWidth;
      container.innerHTML = '';
      
      const loadingTask = this.pdfjsLib.getDocument(this.documentUrl);
      const pdf = await loadingTask.promise;
      this.totalPages = pdf.numPages;
      
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const scale = containerWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale });
        
        const pageContainer = document.createElement('div');
        pageContainer.classList.add('pdf-page-container');
        pageContainer.style.marginBottom = '10px';
        pageContainer.style.position = 'relative';
        
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.classList.add('pdf-page');
        // Set fade in animation on the canvas:
        canvas.style.animation = "fadeInEffect 0.5s ease";
        
        const context = canvas.getContext('2d');
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        await page.render(renderContext).promise;
        
        const overlay = document.createElement('canvas');
        overlay.width = viewport.width;
        overlay.height = viewport.height;
        overlay.classList.add('overlay-canvas');
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.pointerEvents = 'none';
        overlay.style.background = 'transparent';
        const overlayCtx = overlay.getContext('2d');
        this.drawHeatmap(viewport, overlayCtx);
        
        pageContainer.appendChild(canvas);
        pageContainer.appendChild(overlay);
        container.appendChild(pageContainer);
      }
    },
    drawHeatmap(viewport, ctx) {
      ctx.clearRect(0, 0, viewport.width, viewport.height);
      // Test heatmap: three semi-transparent rectangles
      ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
      ctx.fillRect(50, 50, 100, 40);
      ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
      ctx.fillRect(200, 100, 80, 30);
      ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
      ctx.fillRect(150, 200, 120, 50);
    },
    toggleAssistant() {
      this.assistantVisible = !this.assistantVisible;
    }
  },
  watch: {
    documentUrl(newVal) {
      if (newVal && this.pdfjsLib) {
        this.renderPDF();
      }
    }
  },
  async mounted() {
    if (this.documentUrl) {
      // Dynamically import PDF.js from public (using webpackIgnore)
      this.pdfjsLib = await import(/* webpackIgnore: true */ '/pdfjs/legacy/build/pdf.mjs');
      this.pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/legacy/build/pdf.worker.mjs';
      this.renderPDF();
    }
  }
};
</script>

<style scoped>
@keyframes fadeInEffect {
  from { opacity: 0; }
  to { opacity: 1; }
}

.analysis {
  width: 520px;
  height: 580px;
  background-color: #FFF;
  border-radius: 30px;
  border: 1px solid #E6E6E6;
  padding: 15px;
  position: relative;
  z-index: 0;
  animation: fadeInEffect 0.5s ease;
}
.analysis__header {
  display: flex;
  gap: 15px;
  align-items: center;
  padding-bottom: 20px;
}
.header__file {
  font-size: 12px;
  font-weight: 500;
  color: #a2a2a2;
}
.analysis__content {
  display: flex;
  gap: 10px;
}
.content__document {
  width: 390px;
  height: 500px;
  background-color: #f0f0f0;
  overflow-y: auto;
  position: relative;
  padding: 0;
}
.pdf-page-container {
  margin-bottom: 10px;
  position: relative;
}
.pdf-page {
  display: block;
  width: 100%;
}
.overlay-canvas {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  background: transparent;
}
.content__panel {
  width: 110px;
}
.panel__levels {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0;
  margin: 0;
}
.levels__item {
  display: flex;
  gap: 5px;
  align-items: center;
}
.item__color {
  width: 5px;
  height: 5px;
  border-radius: 100%;
}
.green {
  background-color: #008000;
}
.yellow {
  background-color: #FFFF00;
}
.red {
  background-color: #FF0000;
}
.item__text {
  font-size: 11px;
}
.panel__button {
  width: 110px;
  height: 30px;
  border-radius: 10px;
  outline: none;
  border: none;
  margin-top: 10px;
  cursor: pointer;
  font-size: 11px;
  font-weight: bold;
}
.ai-assistant {
  background-color: #6C67FD;
  color: #FFF;
  border: 1px solid #6C67FD;
  margin-bottom: 20px;
  transition: 0.2s;
}
.ai-assistant:hover {
  background-color: #fff;
  color: #6C67FD;
}
.note, .save {
  background-color: #FFF;
  color: #6C67FD;
  border: 1px solid #6C67FD;
  transition: 0.2s;
}
.note:hover, .save:hover {
  background: #6C67FD;
  color: #FFF;
}
.download {
  margin-top: 30px;
}
.download, .download-all {
  background-color: #333;
  color: #FFF;
  border: 1px solid #333;
  transition: 0.2s;
}
.download-all {
  height: 50px;
}
.download:hover, .download-all:hover {
  background-color: #fff;
  color: #333;
}
</style>
