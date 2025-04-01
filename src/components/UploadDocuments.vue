<template>
  <div class="upload-documents">
    <p class="upload-documents__description">
      Убедитесь, что ваши документы находятся в поддерживаемых форматах (<strong class="upload-documents__format">PDF</strong>, <strong class="upload-documents__format">DOC</strong>, <strong class="upload-documents__format">DOCX</strong>). 
      Перетащите выбранные файлы в область ниже или кликните на неё, чтобы открыть стандартное окно выбора. 
      Вы можете загрузить один или несколько файлов.
    </p>

    <div class="upload-documents__dropmenu">
      <button class="upload-documents__button" @click="toggleFileList">
        Мои документы
      </button>
      
      <div class="files-wrapper" ref="filesWrapper" v-show="showFileList">
        <UploadFilesList />
      </div>
      
      <DropMenu @files-added="onFilesAdded" />
      <p class="upload-documents__warning">
        Каждый загруженный файл считается отдельной проверкой!
      </p>
    </div>

    <h3 class="upload-documents__title">Загруженные документы:</h3>
    <div v-if="files.length === 0" class="upload-documents__empty">
      Загрузите файлы в поле выше для просмотра
    </div>
    <ul v-else class="upload-documents__file-list">
      <li v-for="(file, index) in files" :key="index" class="upload-documents__file-item">
        <div class="upload-documents__file-info">
          <img :src="getFileIcon(file)" alt="" class="upload-documents__file-icon" />
          <span class="upload-documents__file-name">{{ truncateFileName(file.name) }}</span>
        </div>
        <div class="upload-documents__file-details">
          <span class="upload-documents__file-size">{{ formatFileSize(file.size) }}</span>
          <img 
            src="@/assets/trash.svg" 
            alt="Удалить" 
            class="upload-documents__file-delete" 
            @click="removeFile(index)" 
          />
        </div>
      </li>

      <button class="upload__start" 
              :disabled="!agreed || processing || availableFiles === 0" 
              @click="startProcessing">
        <template v-if="!processing && availableFiles > 0">
          <p>Запустить проверку и анализ</p>
          <div class="upload__price">
            <p>({{ availableFiles }} <img class="price" src="@/assets/balance.svg" alt=""/>)</p>
          </div>
        </template>
        <template v-else-if="!processing && availableFiles === 0">
          <p>Добавьте файлы для продолжения</p>
        </template>
        <template v-else>
          <img class="upload__gear" src="@/assets/gear.png" alt="Processing" />
        </template>
      </button>

      <div class="agreement">
        <input type="checkbox" class="agreement__checkbox" v-model="agreed" />
        <p class="agreement__text">
          Я даю согласие на сбор, хранение и обработку <a href="#" class="blue agreement__link">персональных данных</a>, содержащихся в загружаемых мной файлах.
        </p>
      </div>
    </ul>
  </div>
</template>

<script>
import DropMenu from '@/components/DropMenu.vue'
import UploadFilesList from '@/components/UploadFilesList.vue' 

export default {
  name: 'UploadDocuments',
  components: { 
    DropMenu,
    UploadFilesList 
  },
  props: {
    processing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      files: [],
      agreed: false,
      processedCount: 0,
      showFileList: false 
    }
  },
  computed: {
    totalCost() {
      return this.files.length
    },
    availableFiles() {
      return this.files.length - this.processedCount
    }
  },
  methods: {
    toggleFileList() {
      const wrapper = this.$refs.filesWrapper;
      if (this.showFileList) {
        wrapper.classList.remove('fade-in');
        wrapper.classList.add('fade-out');
        setTimeout(() => {
          this.showFileList = false;
        }, 100);
      } else {
       
        this.showFileList = true;
        this.$nextTick(() => {
          const wrapper = this.$refs.filesWrapper;
          wrapper.classList.remove('fade-out');
          wrapper.classList.add('fade-in');
        });
      }
    },
    onFilesAdded(newFiles) {
      const allowedExtensions = ['pdf', 'doc', 'docx'];
      const filteredFiles = newFiles.filter(file => {
        const ext = file.name.split('.').pop().toLowerCase();
        return allowedExtensions.includes(ext);
      });
      this.files.push(...filteredFiles);
    },
    getFileIcon(file) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (ext === 'pdf') {
        return require('@/assets/pdf.png');
      } else if (ext === 'doc' || ext === 'docx') {
        return require('@/assets/doc.png');
      }
    },
    formatFileSize(size) {
      if (size < 1024) {
        return size + ' B';
      } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(1) + ' KB';
      } else {
        return (size / (1024 * 1024)).toFixed(1) + ' MB';
      }
    },
    removeFile(index) {
      this.files.splice(index, 1);
      if (this.processedCount > this.files.length) {
        this.processedCount = this.files.length;
      }
    },
    truncateFileName(name) {
      return name.length > 30 ? name.slice(0, 30) + '..' : name;
    },
    startProcessing() {
      if (!this.agreed || this.processing || this.availableFiles === 0) return;
      this.$emit('processing-started');
      if (this.files.length > 0 && this.availableFiles > 0) {
        this.$emit('document-uploaded', this.files[this.processedCount]);
        this.processedCount++;
      }
    }
  }
}
</script>

<style scoped>
.upload-documents {
  width: 450px;
  overflow: hidden;
  font-family: sans-serif;
  background-color: #FFF;
}

.upload-documents__description {
  font-size: 13px;
  line-height: 150%;
  padding-bottom: 20px;
}
.upload-documents__dropmenu {
  display: flex;
  flex-direction: column;
}
.upload-documents__button {
  width: 100px;
  height: 20px;
  color: #000;
  background-color: #fff;
  border: none;
  outline: none;
  box-shadow: 0 2px 3px 2px rgba(0, 0, 0, 0.05);
  font-size: 10px;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background-color 0.2s;
}
.upload-documents__button:hover {
  background-color: #e6e6e6;
}
.upload-documents__warning {
  margin: 5px auto 20px;
  font-size: 12px;
  font-weight: 500;
  color: #a2a2a2;
  text-align: center;
}
.upload-documents__format {
  color: #6c67fd;
}
.upload-documents__title {
  font-size: 18px;
  padding-bottom: 10px;
}
.upload-documents__empty {
  margin-bottom: 10px;
}
.upload-documents__file-list {
  list-style: none;
  padding-left: 0;
}
.upload-documents__file-item {
  width: 450px;
  height: 40px;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  margin-bottom: 10px;
}
.upload-documents__file-info {
  display: flex;
  align-items: center;
  gap: 5px;
}
.upload-documents__file-icon {
  width: 17px;
  height: 17px;
}
.upload-documents__file-name {
  font-size: 14px;
  color: #000;
}
.upload-documents__file-details {
  display: flex;
  align-items: center;
  gap: 30px;
}
.upload-documents__file-size {
  font-size: 14px;
  color: #6c67fd;
}
.upload-documents__file-delete {
  width: 16px;
  height: 16px;
  cursor: pointer;
}
.upload__start {
  width: 450px;
  height: 50px;
  outline: none;
  border: 1px solid #6c67fd;
  background-color: #6c67fd;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  gap: 10px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.2s, color 0.2s;
}
.upload__start:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.upload__start:hover:not(:disabled) {
  background-color: #fff;
  color: #6c67fd;
}
.upload__start:hover:not(:disabled) .price {
  filter: invert(41%) sepia(75%) saturate(4456%) hue-rotate(233deg) brightness(101%) contrast(97%);
}
.upload__price {
  display: flex;
}
.price {
  filter: contrast(50);
}
.upload__gear {
  width: 24px;
  height: 24px;
  animation: spin 8s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(540deg); }
}
.agreement {
  margin: 10px auto 0;
  display: flex;
  justify-content: center;
  align-items: start;
  gap: 5px;
  text-align: center;
}
.agreement__checkbox {
  cursor: pointer;
}
.agreement__text {
  font-size: 12px;
  width: 400px;
}
.agreement__link:hover {
  text-decoration: underline;
  text-underline-position: under;
}

.files-wrapper {
  transition: opacity 0.15s ease-in-out;
  opacity: 1;
}
.fade-in {
  opacity: 1;
}
.fade-out {
  opacity: 0;
}
</style>
