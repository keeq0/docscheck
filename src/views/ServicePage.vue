<template>
    <div>
      <ServiceHeader />
      <ServiceLayout />
    </div>
  </template>
  
  <script>
  import ServiceHeader from '@/components/ServiceHeader.vue'
  import ServiceLayout from '@/components/ServiceLayout.vue'
  
  export default {
    name: 'ServicePage',
    components: { ServiceHeader, ServiceLayout }
  }
  </script>
  