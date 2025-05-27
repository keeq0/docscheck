<template>
  <div class="analysis-memory-bar">
    <div class="analysis-memory-bar__container">
      <div 
        v-for="(segment, index) in memorySegments" 
        :key="index"
        class="analysis-memory-bar__segment"
        :style="{
          width: segment.percentage + '%',
          backgroundColor: segment.color,
          left: segment.offset + '%'
        }"
        :title="`${documents[index]?.name}: ${formatMemory(segment.sizeMB)}`"
      ></div>
    </div>
    <div class="analysis-memory-bar__info">
      <div>
        <span class="analysis-memory-bar__value">{{ animatedMemory }}</span>
        <span class="analysis-memory-bar__total"> / 2 ГБ</span>
      </div>
      <span class="analysis-memory-bar__label">Использование памяти</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    documents: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      animatedMemory: '0 МБ',
      maxMemory: 2048, // 2 ГБ в МБ
      animationDuration: 500,
      animationDelay: 500,
      animationFrameId: null,
      currentMemory: 0,
      colorPalette: [
        '#6C67FD', '#FF7D45', '#4CD97B', '#FFC145', '#5B8DF0',
        '#A162E8', '#F06292', '#4DB6AC', '#FF8A65', '#9575CD'
      ]
    }
  },
  computed: {
    totalUsedMemoryMB() {
      if (!this.documents || !Array.isArray(this.documents)) return 0;
      
      return this.documents.reduce((total, doc) => {
        return total + this.getFileSizeInMB(doc);
      }, 0);
    },
    memorySegments() {
      if (!this.documents || this.documents.length === 0) return [];
      
      const totalMemory = this.totalUsedMemoryMB;
      if (totalMemory === 0) return [];
      
      const segments = [];
      let offset = 0;
      
      this.documents.forEach((doc, index) => {
        const sizeMB = this.getFileSizeInMB(doc);
        const percentage = (sizeMB / this.maxMemory) * 100;
        const color = this.colorPalette[index % this.colorPalette.length];
        
        segments.push({
          percentage: percentage * (this.currentMemory / totalMemory),
          color,
          offset,
          sizeMB
        });
        
        offset += percentage * (this.currentMemory / totalMemory);
      });
      
      return segments;
    },
    formattedUsedMemory() {
      return this.formatMemory(this.totalUsedMemoryMB);
    }
  },
  mounted() {
    this.startAnimation();
  },
  beforeUnmount() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  },
  watch: {
    documents: {
      deep: true,
      handler() {
        this.startAnimation();
      }
    }
  },
  methods: {
    getFileSizeInMB(doc) {
      if (!doc?.size) return 0;
      
      const sizeStr = String(doc.size).replace(',', '.');
      const size = parseFloat(sizeStr) || 0;
      const unit = String(doc.size).replace(/[^а-яА-Яa-zA-Z]/g, '').toLowerCase();
      
      switch(unit) {
        case 'тб':
        case 'tb':
          return size * 1024 * 1024;
        case 'гб':
        case 'gb':
          return size * 1024;
        case 'мб':
        case 'mb':
          return size;
        case 'кб':
        case 'kb':
          return size / 1024;
        case 'байт':
        case 'byte':
        case 'b':
          return size / (1024 * 1024);
        case 'бит':
        case 'bit':
        case 'б':
          return size / (8 * 1024 * 1024);
        default:
          return size;
      }
    },
    formatMemory(mb) {
      if (mb >= 1024 * 1024) {
        return `${(mb / (1024 * 1024)).toFixed(2)} ТБ`;
      }
      if (mb >= 1024) {
        return `${(mb / 1024).toFixed(2)} ГБ`;
      }
      if (mb < 1) {
        const kb = mb * 1024;
        if (kb < 1) {
          const bytes = kb * 1024;
          if (bytes < 1) {
            const bits = bytes * 8;
            return `${bits.toFixed(2)} бит`;
          }
          return `${bytes.toFixed(2)} Байт`;
        }
        return `${kb.toFixed(2)} КБ`;
      }
      return `${mb.toFixed(2)} МБ`;
    },
    startAnimation() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }

      setTimeout(() => {
        this.animateValues();
      }, this.animationDelay);
    },
    animateValues() {
      const targetMemory = this.totalUsedMemoryMB;
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / this.animationDuration, 1);
        
        this.currentMemory = progress * targetMemory;
        this.animatedMemory = this.formatMemory(this.currentMemory);
        
        if (progress < 1) {
          this.animationFrameId = requestAnimationFrame(animate);
        } else {
          this.animatedMemory = this.formattedUsedMemory;
          this.currentMemory = targetMemory;
        }
      };
      
      this.currentMemory = 0;
      this.animatedMemory = '0 МБ';
      this.animationFrameId = requestAnimationFrame(animate);
    }
  }
}
</script>

<style scoped>
.analysis-memory-bar {
  width: 250px;
}

.analysis-memory-bar__container {
  height: 25px;
  background-color: #d9d9d9;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}

.analysis-memory-bar__segment {
  position: absolute;
  top: 0;
  height: 100%;
  transition: width 0.3s ease, left 0.3s ease;
}

.analysis-memory-bar__info {
  display: flex;
  margin-top: 5px;
  justify-content: space-between;
}

.analysis-memory-bar__value {
  font-size: 12px;
  color: #a2a2a2;
  text-align: left;
}

.analysis-memory-bar__total {
  font-size: 12px;
  color: #a2a2a2;
}

.analysis-memory-bar__label {
  font-size: 12px;
}
</style>