<template>
    <div
      class="drop-menu__zone"
      :class="{ 'drop-menu__zone--dragover': isDragging }"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="onZoneClick"
    >
      <p class="drop-menu__instruction">Загрузите файл(-ы) сюда</p>
      <img src="@/assets/upload.svg" class="drop-menu__icon" alt="Иконка загрузки" />
      <input
        ref="fileInput"
        type="file"
        multiple
        @change="onFileInputChange"
        style="display: none;"
      />
    </div>
  </template>
  
  <script>
  export default {
    name: 'DropMenu',
    emits: ['files-added'],
    data() {
      return {
        isDragging: false
      }
    },
    methods: {
      onDragOver() {
        this.isDragging = true
      },
      onDragLeave() {
        this.isDragging = false
      },
      onDrop(event) {
        const droppedFiles = Array.from(event.dataTransfer.files)
        this.$emit('files-added', droppedFiles)
        this.isDragging = false
      },
      onZoneClick() {
        this.$refs.fileInput.click()
      },
      onFileInputChange(event) {
        const selectedFiles = Array.from(event.target.files)
        this.$emit('files-added', selectedFiles)
        event.target.value = null
      }
    }
  }
  </script>
  
  <style scoped>
  .drop-menu__zone {
    width: 100%;
    height: 130px;
    border: 2px dashed #6c67fd;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    text-align: center;
    color: #6c67fd;
  }
  
  .drop-menu__zone:hover {
    background-color: #f0f0f0;
  }
  
  .drop-menu__zone--dragover {
    background-color: #eaeaea;
  }
  
  .drop-menu__instruction {
    font-size: 14px;
    font-weight: 500;
    color: #000;
    margin: 0;
  }
  
  .drop-menu__icon {
    margin-top: 5px;
  }
  </style>
  