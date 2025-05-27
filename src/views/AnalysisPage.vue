<template>
    <div>
      <h1>Статистика и аналитика</h1>
      <AnalysisOptions />
      <AnalysisStatistics />
    </div>
  </template>
  
  <script>
import AnalysisOptions from '@/components/AnalysisOptions.vue';
import AnalysisStatistics from '@/components/AnalysisStatistics.vue';

  export default {
    name: 'AnalysisPage',
    components: {
      AnalysisOptions,
      AnalysisStatistics
    }
  }
  </script>
  