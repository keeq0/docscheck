<template>
  <div class="analysis">
    <div class="analysis__header">
      <h2>Анализ документов</h2>
      <p class="header__file">{{ truncatedDocumentName }} ({{ totalPages }} стр.)</p>
    </div>
    <div class="analysis__content">
      <div class="content__document" ref="documentContainer">
        <!-- PDF-страницы  -->
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
        <img src="@/assets/ai_white.svg" class="button__icon" alt=""/> 
        <p>ИИ-помощник</p>
      </button>
        <button class="panel__button note">
          <img src="@/assets/note.svg" class="button__icon" alt=""/> 
          <p>Новая заметка</p>
        </button>
        <button class="panel__button save">
          <img src="@/assets/save.svg" class="button__icon" alt=""/> 
          <p>Сохранить</p>
        </button>
        <button class="panel__button download">
          <img src="@/assets/save_report.svg" class="button__icon" alt=""/> 
          <p>Скачать отчет</p>
        </button>
        <button class="panel__button download-all">
          <p>Скачать готовый документ</p>
        </button>
      </div>
    </div>
  </div>
</template>


<script>

import axios from 'axios';

export default {
  name: 'AnalysisResult',
  components: {},
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
      totalPages: 0,
      pdfjsLib: null,
      zoom: 1.5,
      minZoom: 1,
      maxZoom: 3,
      analysisResult: null,
      analysisError: false,
    };
  },
  computed: {
    truncatedDocumentName() {
      return this.documentName && this.documentName.length > 15
        ? this.documentName.slice(0, 15) + '..'
        : this.documentName;
    }
  },
  methods: {


    async analyzeDocument(text) {
      const prompt = `Ты - ведущий эксперт по аналитике документов с 15-летним опытом. Проведи всесторонний аудит предоставленного документа и сформируй исчерпывающий отчет в СТРОГОМ соответствии со структурой ниже. 

# Полный профессиональный анализ документа

## 1. Юридико-технический аудит
### 1.1. Формальные параметры
- Полное наименование документа: [указать с реквизитами]
- Вид документа: [договор/акт/регламент и т.д.] 
- Нормативная база: [перечень регулирующих документов]
- Юрисдикция: [применимое право]

### 1.2. Структурный анализ
- Полнота обязательных разделов: [проверка по ГОСТ/отраслевым стандартам]
- Логика построения: [оценка последовательности разделов]
- Ссылочный аппарат: [корректность внутренних/внешних ссылок]

## 2. Содержательная экспертиза
### 2.1. Существенные условия
- [Условие 1] - соответствие законодательству
- [Условие 2] - коммерческая целесообразность
- [Условие 3] - риски исполнения

### 2.2. Правовые аспекты
- Конфликт норм: [выявленные противоречия]
- Пробелы регулирования: [отсутствующие положения]
- Арбитражная практика: [анализ спорных моментов]

### 2.3. Финансовые параметры
- Расчетные формулы: [проверка корректности]
- Валютные оговорки: [анализ рисков]
- Санкционные механизмы: [эффективность]

## 3. Риск-ориентированный анализ
### 3.1. Критические уязвимости (красный уровень)
- [Риск 1] - вероятность/последствия
- [Риск 2] - финансовый/репутационный ущерб

### 3.2. Потенциальные угрозы (желтый уровень)
- [Угроза 1] - условия реализации
- [Угроза 2] - превентивные меры

### 3.3. Оптимизационные резервы (зеленый уровень)
- [Резерв 1] - возможные улучшения
- [Резерв 2] - best practices отрасли

## 4. Детализированные рекомендации
### 4.1. Обязательные исправления
- [Пункт X] - требуемая правка (с обоснованием)
- [Раздел Y] - необходимость дополнения

### 4.2. Стратегические предложения
- [Оптимизация 1] - долгосрочный эффект
- [Оптимизация 2] - синергетический потенциал

### 4.3. Альтернативные решения
- [Вариант A] - сравнительные преимущества
- [Вариант B] - ограничения реализации

## 5. Итоговое заключение
- Интегральная оценка: [по 10-балльной шкале]
- Уровень готовности: [процентное соотношение]
- Рекомендуемые действия: [приоритетный план]

Требования к подаче:
1. Глубина анализа - минимум 3 уровня вложенности
2. Каждый тезис подтверждается конкретными выдержками
3. Использование профессиональной лексики без жаргонизмов
4. Четкое разделение фактов и экспертных оценок
5. Обязательная привязка к отраслевым стандартам
6. Визуальное выделение ключевых терминов CAPS
7. Пустые строки между смысловыми блоками

Пример формулировки:
"Раздел 3.2.1 содержит НЕСООТВЕТСТВИЕ требованиям ФЗ-№152 (п.4 ст.5): 
- Факт: отсутствует явное согласие на обработку ПДн 
- Риск: штраф до 300К руб по ст.13.11 КоАП 
- Решение: добавить отдельный пункт о получении письменного согласия"

Дополнительные указания:
- Анализировать документ через призму последних законодательных изменений
- Учитывать отраслевую специфику и практику арбитражных судов
- Предусматривать multi-case сценарии развития событий
- Давать comparative analysis с аналогичными документами
- Использовать принцип "red flag first"
      Документ для анализа:
      ${text.substring(0, 10000)}`;

      try {
        console.log('Отправка запроса к Deepseek API...');
        const response = await axios.post(
          'https://api.deepseek.com/chat/completions',
          {
            messages: [
              {
                content: "You are a professional document analyst",
                role: "system"
              },
              {
                content: prompt,
                role: "user"
              }
            ],
            model: "deepseek-chat",
            max_tokens: 2048,
            temperature: 0.7
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer sk-adf1807396484490882cd63ab534d01e'
            }
          }
        );
        
        console.log('Ответ от Deepseek API:', response.data);

        this.analysisResult = response.data.choices[0].message.content;
        this.analysisError = false;
      } catch (error) {
        console.error('Ошибка при анализе документа:', error);
        this.analysisResult = null;
        this.analysisError = true;
      }
      
      this.$emit('analysis-complete', {
        result: this.analysisResult,
        error: this.analysisError
      });
    },


    async extractPdfText() {
      if (!this.documentUrl || !this.pdfjsLib) return;
      const loadingTask = this.pdfjsLib.getDocument(this.documentUrl);
      const pdf = await loadingTask.promise;
      let fullText = '';
      
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      await this.analyzeDocument(fullText);
    },







    async renderPDF() {
      if (!this.documentUrl || !this.pdfjsLib) return;

      const container = this.$refs.documentContainer;
      container.innerHTML = '';
      
      const loadingTask = this.pdfjsLib.getDocument(this.documentUrl);
      const pdf = await loadingTask.promise;
      this.totalPages = pdf.numPages;

      const containerWidth = container.clientWidth * 1;
      
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const scale = containerWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale });
        
        const pageContainer = document.createElement('div');
        pageContainer.classList.add('pdf-page-container');
        pageContainer.style.position = 'relative';
        
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.classList.add('pdf-page');
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
      ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
      ctx.fillRect(50, 50, 100, 40);
      ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
      ctx.fillRect(200, 100, 80, 30);
      ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
      ctx.fillRect(150, 200, 120, 50);
    },
    toggleAssistant() {
      this.$emit('show-assistant'); 
    },
    updatePdfSize() {
    if (this.documentUrl) {
      this.renderPDF();
    }
  },

  },
  watch: {
    analysisResult(newVal) {
    if (newVal && this.waitingForAnalysis) {
      this.fullSecondBody = this.formatAnalysisText(newVal);
      this.startSecondSequence();
      this.waitingForAnalysis = false;
    }
  },
    documentUrl(newVal) {
      if (newVal && this.pdfjsLib) {
        this.renderPDF();
        
        this.extractPdfText();
      }
    }
  },
  async mounted() {
    if (this.documentUrl) {
      this.pdfjsLib = await import(/* webpackIgnore: true */ '/pdfjs/legacy/build/pdf.mjs');
      this.pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/legacy/build/pdf.worker.mjs';
      this.renderPDF();
      
      this.extractPdfText();
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
  width: 88%;
  height: 100%;
  background-color: #FFF;
  border-radius: 30px;
  border: 1px solid #E6E6E6;
  padding: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
}




.expanded .analysis {
  width: 900px;
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
  width: 100%;
  height: 500px;
  overflow: scroll;
}

.expanded .content__document {
  width: 780px; /* 900px - padding и т.д. */
}

.pdf-page-container {
  margin-bottom: 10px;
}
.pdf-page {
  width: 100%;
  max-width: 100%;
  transition: all 0.3s ease;
}
.overlay-canvas {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  background: transparent;
}
.content__panel {
  width: 130px;
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
  width: 120px;
  height: 35px;
  border-radius: 10px;
  outline: none;
  border: none;
  margin-top: 10px;
  cursor: pointer;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.ai-assistant {
  background-color: #6C67FD;
  color: #FFF;
  border: 1px solid #6C67FD;
  margin-bottom: 20px;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.ai-assistant:hover {
  background-color: #fff;
  color: #6C67FD;
}

.button__icon {
  width: 15px;
  height: 15px;
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