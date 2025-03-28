<template>
  <ServicePage />
</template>

<script>
import ServicePage from './views/ServicePage.vue';

export default {
  name: 'App',
  components: {
    ServicePage
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;

  font-family: 'Montserrat', sans-serif;
}

a {
  color: transparent;
  text-decoration: none;
}

.blue {
  color: #6C67FD;
}
</style>
