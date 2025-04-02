<template>
  <div :class="['assistant', { 'assistant--visible': internalVisible }]">
    <div class="assistant__header">
      <div class="assistant__title">
        <h3>ИИ-помощник</h3>
        <h2>Анализ документа(-ов)</h2>
      </div>
      <button class="assistant__close" @click="hideAssistant">Скрыть</button>
    </div>
  
   
    <div
      class="assistant__messages"
      ref="messagesContainer"
      @scroll="handleScroll"
    >
    
      <div class="assistant__first-message">
        <template v-if="showFirstLoading">
          <div class="loading-dots">•••</div>
        </template>
        <template v-else>
          <div class="message message--first">
            <img src="@/assets/ai.svg" class="assistant__logo" alt=""/>
            <p class="message__text" v-html="typedFirstMessage"></p>
          </div>
        </template>
      </div>
      

      <div class="assistant__second-message" v-if="firstMessageComplete">
        <template v-if="showSecondLoading">
          <div class="loading-dots">•••</div>
        </template>
        <template v-else>
          <div class="message message--complete">
            <img src="@/assets/ai.svg" class="assistant__logo" alt=""/>
            <div class="message__content">
              <h4 class="message__header" v-html="typedSecondHeader"></h4>
              <p class="message__text" v-html="typedSecondBody"></p>
            </div>
          </div>
        </template>
      </div>

      
      <div 
        v-if="showScrollToBottom"
        class="scroll-to-bottom"
        @click="scrollToBottom"
      >
        <img src="@/assets/arrow_down.png" class="scroll-to-bottom__icon" alt="">
      </div>
    </div>

    <footer class="assistant__footer">
      <div class="footer__buttons">
        <button class="footer__button report" :class="{ visible: allMessagesComplete }">
          Скачать отчёт
        </button>
        <button class="footer__button full" :class="{ visible: allMessagesComplete }">
          Скачать готовый документ
        </button>
      </div>
      <div class="footer__line" />
      <p class="footer__text">
        Есть вопросы или что-то не устраивает? Мы всегда открыты к вашим отзывам и предложениям — свяжитесь с нами, и мы постараемся решить любые возникшие проблемы.
      </p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'AiAssistant',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    analysisResult: String,
    analysisError: Boolean
  },
  data() {
    return {
      internalVisible: this.visible,
      firstMessageComplete: false,
      showFirstLoading: true,
      fullFirstMessage:
        "Я начинаю анализ прикрепленных вами документов. Вы получите полный отчёт и рекомендации. Пожалуйста, подождите минуточку!",
      typedFirstMessage: "",
      firstTypingIndex: 0,
      firstTypingInterval: null,
      showSecondLoading: true,
      fullSecondHeader: "Анализ ваших документов успешно завершен.",
      fullSecondBody: this.analysisError 
        ? "Анализ недоступен" 
        : this.analysisResult || "Идет анализ документа...",
      typedSecondHeader: "",
      typedSecondBody: "",
      secondTypingIndex: 0,
      secondTypingInterval: null,
      headerTypingSpeed: 50,
      bodyTypingSpeed: 5,
      allMessagesComplete: false,
      showScrollToBottom: false,
      waitingForAnalysis: false,
    }
  },
  watch: {
    visible(newVal) {
      this.internalVisible = newVal;
    },
    analysisResult(newVal) {
      if (newVal && this.waitingForAnalysis) {
        this.fullSecondBody = newVal;
        this.startSecondSequence();
        this.waitingForAnalysis = false;
      }
    },
    analysisError(newVal) {
      if (newVal && this.waitingForAnalysis) {
        this.fullSecondBody = "Анализ недоступен";
        this.startSecondSequence();
        this.waitingForAnalysis = false;
      }
    },
  },
  mounted() {
   
    setTimeout(() => {
      this.showFirstLoading = false;
      this.startFirstTyping();
    }, 2000);
    
    this.$nextTick(() => {
      this.handleScroll();
    });
  },
  updated() {
    
    this.$nextTick(() => {
      if (this.$refs.messagesContainer) {
        this.handleScroll();
      }
    });
  },
  methods: {
    hideAssistant() {
    this.internalVisible = false;
    this.$emit('close');
  },

    
    startFirstTyping() {
      const text = this.fullFirstMessage;
      this.typedFirstMessage = "";
      this.firstTypingIndex = 0;
      this.firstTypingInterval = setInterval(() => {
        this.typedFirstMessage += text[this.firstTypingIndex];
        this.firstTypingIndex++;
        if (this.firstTypingIndex >= text.length) {
          clearInterval(this.firstTypingInterval);
          this.firstMessageComplete = true;
          this.waitForAnalysis();
        }
      }, 12);
    },

    waitForAnalysis() {
      this.waitingForAnalysis = true;
      this.showSecondLoading = true;
      // Проверяем, если ответ уже пришел до завершения первой анимации
      if (this.analysisResult || this.analysisError) {
        this.startSecondSequence();
        this.waitingForAnalysis = false;
      }
    },

    formatAnalysisText(text) {
  if (!text) return '';
  
  // Удаляем все markdown-символы
  let cleanText = text
    .replace(/^#+\s*/gm, '') // Удаляем решетки в начале строк
    .replace(/\*\*/g, '') // Удаляем ** для жирного текста
    .replace(/\*/g, '') // Удаляем * для курсива
    .replace(/^\d+\.\d+\.?\s*/gm, '') // Удаляем нумерацию типа 1.1.
    .replace(/^-\s*/gm, '') // Удаляем маркеры списков
    .replace(/\n{3,}/g, '\n\n'); // Удаляем лишние переносы строк

  // Разбиваем на строки и добавляем отступы
  const lines = cleanText.split('\n');
  let htmlOutput = '';

  lines.forEach((line, index) => {
    line = line.trim();
    
    if (!line) {
      // Добавляем отступ между абзацами
      if (index > 0 && index < lines.length - 1 && lines[index - 1].trim() && lines[index + 1].trim()) {
        htmlOutput += '<div class="text-block"><br></div>';
      }
      return;
    }

    // Определяем уровень заголовка по отступам
    if (line.match(/^[A-ZА-ЯЁ][A-ZА-ЯЁa-zа-яё\s-]+$/)) {
      // Заголовок верхнего уровня (только заглавные буквы и дефисы)
      htmlOutput += `<h3 class="section-title">${line}</h3>`;
    } else if (line.match(/^\s{4}/)) {
      // Подпункт с отступом
      htmlOutput += `<p class="indented-text">${line.trim()}</p>`;
    } else {
      // Обычный текст
      htmlOutput += `<p class="regular-text">${line}</p>`;
    }
  });

  return htmlOutput;
},
   
    startSecondSequence() {
      this.showSecondLoading = false;
      this.startSecondTypingHeader();
    },

    
    startSecondTypingHeader() {
      this.typedSecondHeader = "";
      this.secondTypingIndex = 0;
      const headerText = this.fullSecondHeader;
      this.secondTypingInterval = setInterval(() => {
        this.typedSecondHeader += headerText[this.secondTypingIndex];
        this.secondTypingIndex++;
        if (this.secondTypingIndex >= headerText.length) {
          clearInterval(this.secondTypingInterval);
          this.startSecondTypingBody();
        }
      }, this.headerTypingSpeed);
    },

  
    startSecondTypingBody() {
    this.typedSecondBody = "";
    const bodyText = this.formatAnalysisText(this.fullSecondBody);
    this.secondTypingIndex = 0;
    this.secondTypingInterval = setInterval(() => {
      this.typedSecondBody = bodyText.substring(0, this.secondTypingIndex);
      this.secondTypingIndex++;
      if (this.secondTypingIndex >= bodyText.length) {
        clearInterval(this.secondTypingInterval);
        this.allMessagesComplete = true;
        this.$emit('processing-complete');
      }
    }, this.bodyTypingSpeed);
  },

   
    handleScroll() {
      const container = this.$refs.messagesContainer;
      const scrollHeight = container.scrollHeight;
      const scrollTop = container.scrollTop;
      const clientHeight = container.clientHeight;
    
      const nearBottom = scrollHeight - (scrollTop + clientHeight) <= 20;
      this.showScrollToBottom = !nearBottom;
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }
}
</script>

<style scoped>
.analysis-result {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
  padding: 15px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 25px 0 15px 0;
  color: #2c3e50;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.regular-text {
  font-size: 14px;
  margin: 10px 0;
  text-align: left;
}

.indented-text {
  font-size: 14px;
  margin: 8px 0 8px 20px;
  text-align: left;
}

.text-block {
  margin-bottom: 15px;
}
.assistant {
  position: fixed;
  top: 0;
  right: 0;
  width: 46.5%;
  height: 100vh;
  background: #333;
  color: #fff;
  padding: 30px;
  box-sizing: border-box;
  transform: translateX(100%);
  transition: transform 0.2s ease-out;
  will-change: transform;
  z-index: 1000;
}
.assistant--visible {
  transform: translateX(0);
}
.assistant__header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
}
.assistant__title h3 {
  font-size: 12px;
  color: #d9d9d9;
  margin: 0 0 5px 0;
}
.assistant__title h2 {
  font-size: 24px;
  margin: 0;
}
.assistant__close {
  background: transparent;
  border: none;
  outline: none;
  color: #a2a2a2;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
.assistant__close:hover {
  text-decoration: underline;
  text-underline-position: under;
}
.assistant__logo {
  width: 25px;
  height: 25px;
}
.loading-dots {
  font-size: 24px;
  color: #a2a2a2;
  animation: blink 1s infinite;
}
@keyframes blink {
  0% { opacity: 0.2; }
  20% { opacity: 1; }
  100% { opacity: 0.2; }
}
.assistant__messages {
  height: calc(100vh - 250px);
  overflow-y: auto;
  padding-right: 10px;
  position: relative;
}
.assistant__messages::-webkit-scrollbar {
  width: 8px;
}
.assistant__messages::-webkit-scrollbar-track {
  background: #444;
  border-radius: 4px;
}
.assistant__messages::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}
.message {
  display: flex;
  gap: 15px;
  padding-bottom: 25px;
  align-items: flex-start;
}
.message__text {
  margin: 0;
  line-height: 1.4;
  font-size: 14px;
  opacity: 0;
  animation: fadeIn 0.25s forwards;
}
.message--complete .message__header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  opacity: 0;
  animation: fadeIn 0.25s forwards;
}
.message__content {
  display: flex;
  flex-direction: column;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.assistant__first-message,
.assistant__second-message {
  transition: opacity 0.25s ease-in-out;
}
.assistant__footer {
  padding-top: 10px;
}
.footer__buttons {
  width: 535px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  height: 60px;
}
.footer__button {
  height: 50px;
  width: fit-content;
  border-radius: 10px;
  outline: none;
  border: none;
  padding: 0 40px;
  cursor: pointer;
  transition: opacity 0.5s ease;
  opacity: 0;
}
.footer__button.visible {
  opacity: 1;
}
.report {
  color: #FFF;
  background-color: #6C67FD;
  border: 1px solid #6C67FD;
  transition: 0.2s;
  font-size: 16px;
  font-weight: bold;
}
.full {
  color: #000;
  background-color: #FFF;
  border: 1px solid #FFF;
  transition: 0.2s;
  font-size: 16px;
  font-weight: bold;
}
.report:hover {
  color: #6C67FD;
  background-color: #FFF;
}
.full:hover {
  background-color: #333;
  color: #FFF;
}
.footer__line {
  width: 100%;
  height: 1px;
  background-color: #e6e6e6;
}
.footer__text {
  margin-top: 20px;
  font-size: 12px;
  color: #a2a2a2;
  width: 450px;
}

.scroll-to-bottom {
  position: sticky;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 25px;
  height: 25px;
  background: #fff;
  color: #333;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  border: 1px solid #E6E6E6;
}
.scroll-to-bottom__icon {
  height: 15px;
}
</style>