<template>
  <div class="button-container">
    <button v-for="view in views" :key="view" :class="{ active: currentView.viewId === view.viewId }" @click="()=>onButtonClick(view)"
      class="button">
      <div class="inner-button" v-if="currentView.viewId === view.viewId"></div>
      <div class="text">{{ view.viewName }}</div>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ButtonContainer',
  props: {
    currentView: {
      type: Object,
      required: true
    },
    views: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
    };
  },
  computed: {
  },
  methods: {
    onButtonClick(view) {
      this.$emit('nav-button-click', view);
    },
  },
};
</script>

<style scoped>
.button-container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  border: 1px solid blue;
  padding: 7px 15px 24px 0px;
  align-items: center;
  background-color: #E9EEF9;
  border-radius: 4px;
}

.button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #58595E;
  cursor: pointer;
  background-color: #58595E;
}

.button-container button:not(:last-child)::after {
  content: '';
  width: 57px;
  height: 10%;
  background-color: #58595E;
  margin: 0 10px;
  display: flex;
  position: relative;
  top: 0px;
  z-index: 111;
  margin-left: 22px;
}

.button-container button.active:not(:last-child)::after {
  top: -7px;
}

.inner-button {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #fff;
  margin: auto;
}

.text-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  margin-top: 10px;
}

.button .text {
  font-size: 11px;
  color: #ccc;
  position: relative;
  top: 20px;
  padding: 0;
  margin: 0;
  left: -7px;
  height: 0;
  color: #000;
}

.button.active .text {
  top: 12px;
}
</style>
