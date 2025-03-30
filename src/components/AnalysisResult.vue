<template>
    <div class="analysis">
      <div class="analysis__header">
        <h2>Анализ документов</h2>
        <p class="header__file">Договор_аренды.pdf</p>
      </div>
  
      <div class="analysis__content">
        <div class="content__document">
          <!-- Здесь отображается документ -->
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
          <!-- При клике по кнопке "ИИ-Помощник" просто выставляем флаг assistantVisible в true -->
          <button class="panel__button ai-assistant" @click="showAssistant">
            ИИ-Помощник
          </button>
          <button class="panel__button note">
            Новая заметка
          </button>
          <button class="panel__button save">
            Сохранить
          </button>
          <button class="panel__button download">
            Скачать отчет
          </button>
          <button class="panel__button download-all">
            Скачать готовый документ
          </button>
        </div>
      </div>
    </div>
    
    <!-- Компонент AiAssistant.vue, который выезжает при изменении свойства visible -->
    <AiAssistant :visible="assistantVisible" />
  </template>
  
  <script>
  import AiAssistant from '@/components/AiAssistant.vue'
  
  export default {
    name: 'AnalysisResult',
    components: { 
      AiAssistant 
    },
    data() {
      return {
        assistantVisible: false
      }
    },
    methods: {
      showAssistant() {
        this.assistantVisible = true;
      }
    }
  }
  </script>
  
  <style scoped>
  .analysis {
    width: 520px;
    height: 580px;
    background-color: #FFF;
    border-radius: 30px;
    border: 1px solid #E6E6E6;
    padding: 15px;
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
  
  .panel__levels {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 5px;
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
  
  .content__document {
    width: 390px;
    height: 500px;
    background-color: #f0f0f0;
  }
  
  .content__panel {
    width: 110px;
  }
  
  .panel__button {
    width: 110px;
    height: 30px;
    border-radius: 10px;
    outline: none;
    border: none;
    margin-top: 10px;
    cursor: pointer;
    font-size: 10px;
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
  