<template>
    <div class="analysis">
      <div class="analysis__left">
          <h1>Статистика и аналитика</h1>
          <AnalysisOptions />
          <AnalysisStatistics />
      </div>
      <div class="analysis__right">
          <h1>Анализ моих документов</h1>
          <AnalysisFilesOptions />
      </div>
    </div>
  </template>
  
  <script>
import AnalysisFilesOptions from '@/components/AnalysisFilesOptions.vue';
import AnalysisOptions from '@/components/AnalysisOptions.vue';
import AnalysisStatistics from '@/components/AnalysisStatistics.vue';

  export default {
    name: 'AnalysisPage',
    components: {
      AnalysisOptions,
      AnalysisStatistics,
      AnalysisFilesOptions
    }
  }
  </script>
  
<style>
.analysis {
  display: flex;
  gap:30px;
}
</style>