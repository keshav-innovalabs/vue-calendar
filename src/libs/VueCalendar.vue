<template>
  <div ref="calendar"></div>
</template>

<script>
import { Calendar } from '@fullcalendar/core';
import DayGridPlugin from '@fullcalendar/daygrid';
import TimeGridPlugin from '@fullcalendar/timegrid';
import InteractionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';

export default {
  name: 'VueCalendar',
  props: {
    currentView: {
      type: String,
      required: true
    },
    dateClickHandler: {
      type: Function,
      default: () => () => {} // Default is an empty function
    },
    eventClickHandler: {
      type: Function,
      default: () => () => {} // Default is an empty function
    }
  },
  data() {
    return {
      calendar: null
    };
  },
  watch: {
    currentView(newView) {
      this.initializeCalendar(newView);
    }
  },
  mounted() {
    this.initializeCalendar(this.currentView);
  },
  methods: {
    initializeCalendar(currentView) {
      if (this.calendar) {
        this.calendar.destroy();
      }

      let plugins = [
        DayGridPlugin,
        TimeGridPlugin,
        InteractionPlugin
      ];
      let calendaroptions = {
        plugins,
        initialView: currentView,
        dateClick: this. dateClickHandler,
        eventClick: this.eventClickHandler,
        headerToolbar: {
          start: '',
          center: '',
          end: '',
        }
      }

      if (currentView === 'multiMonthFourMonth') {
        plugins.push(multiMonthPlugin);
        calendaroptions.initialView = 'multiMonth';
        calendaroptions.views = {
          multiMonth: {
            type: 'multiMonth',
            duration: { months: 4 }
          }
        }
      }
      const calendarEl = this.$refs.calendar;
      this.calendar = new Calendar(calendarEl, calendaroptions);
      this.calendar.render();
    }
  },
  beforeDestroy() {
    if (this.calendar) {
      this.calendar.destroy();
    }
  }
};
</script>

<style scoped></style>
