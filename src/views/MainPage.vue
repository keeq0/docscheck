<template>
    <div>
      <h1>Загрузка и анализ документа(-ов)</h1>
      <UploadDocuments />
    </div>
  </template>
  
<script>
import UploadDocuments from '@/components/UploadDocuments.vue';

  export default {
    name: 'MainPage',
    components: {
      UploadDocuments
    }
  }
</script>
  
<style scoped>

h1 {
  font-size: 24px;
  padding-bottom: 20px;
}

</style>