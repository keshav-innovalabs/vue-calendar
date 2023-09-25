<template>
  <div class="home">
    <Schedular/>
    <Calendar/>
  </div>
</template>

<script>
// @ is an alias to /src
import Schedular from '@/components/Schedular.vue'

export default {
  name: 'HomeView',
  components: {
    Schedular,
  }
}
</script>
