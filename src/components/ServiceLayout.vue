<template>
    <div class="layout">
      <NavigationPanel/>
    </div>
  </template>
  
  <script>
  import NavigationPanel from './NavigationPanel.vue'
  
  export default {
    components: {
        NavigationPanel,
     },
  }
  </script>
  
  <style scoped>
  .layout {
    margin: 0 auto;
    display: flex;
    width: 1200px;
    padding-top: 50px;
  }
  </style>
  