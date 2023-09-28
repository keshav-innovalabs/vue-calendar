<template>
  <div ref="calendar"></div>
</template>

<script>
import { Calendar } from '@fullcalendar/core';
import DayGridPlugin from '@fullcalendar/daygrid';
import TimeGridPlugin from '@fullcalendar/timegrid';
import InteractionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import rrulePlugin from '@fullcalendar/rrule'
export default {
  name: 'VueCalendar',
  props: {
    currentView: {
      type: String,
      required: true
    },
    dateClickHandler: {
      type: Function,
      default: () => () => { } 
    },
    eventClickHandler: {
      type: Function,
      default: () => () => { } 
    },
    events: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      calendar: null
    };
  },
  watch: {
    currentView(newView) {
      this.initializeCalendar(newView, this.events);
    },
    events: {
      handler(newEvents) {
        this.initializeCalendar(this.currentView, newEvents);
      },
      deep: true
      }
  },
  mounted() {
    this.initializeCalendar(this.currentView);
  },
  methods: {
    initializeCalendar(currentView, events) {
      if (this.calendar) {
        this.calendar.destroy();
      }

      let plugins = [
        DayGridPlugin,
        TimeGridPlugin,
        InteractionPlugin,
        rrulePlugin,
      ];
      let calendaroptions = {
        plugins,
        initialView: currentView,
        dateClick: this.dateClickHandler,
        eventClick: this.eventClickHandler,
        events: events,
        headerToolbar: {
          start: '',
          center: '',
          end: '',
        },
        timeZone: 'local',
        editable: true,
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
      console.log(events)

      const calendarEl = this.$refs.calendar;
      this.calendar = new Calendar(calendarEl, calendaroptions);
      this.calendar.render();
    },
    goToPrev() {
      this.calendar.prev();
    },
    goToNext() {
      this.calendar.next(); 
    },
  },
  beforeDestroy() {
    if (this.calendar) {
      this.calendar.destroy();
    }
  }
};
</script>

<style scoped></style>
