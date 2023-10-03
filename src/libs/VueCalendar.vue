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
import { v4 as uuidv4 } from 'uuid';

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
    },
    eventToEdit: {
      type: Object,
      default: null
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
        console.log('new events', newEvents);
        console.log('all events', this.calendar.getEvents())
        this.initializeCalendar(this.currentView, newEvents);
      },
      deep: true
    },
    eventToEdit: {
      handler(newEvent) {
        console.log('new event running', newEvent);
        this.editEventInstance(newEvent)
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
        eventContent: this.customEventContent,
        eventRender: this.customEventRender,
        headerToolbar: {
          start: '',
          center: '',
          end: '',
        },
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
    getEventById(id) {
      const ei = this.calendar.getEventById(id);
      return ei
    },
    editEventInstance(newEvent) {
      console.log('newEvent', newEvent);
      // Get the original event you want to edit from the calendar
      const originalEvent = this.calendar.getEventById(newEvent.id);

      console.log('originalEvent', originalEvent);
      // Create a new unique ID for the edited event
      const editedEventId = uuidv4();

      // Clone the original event data and update its ID
      const editedEventData = {
        ...newEvent,
        id: editedEventId,
      };

      // Add the start date of the edited event to the excludedDates property of the original event
      if (originalEvent) {
        if (!originalEvent.extendedProps.excludedDates) {
          originalEvent.extendedProps.excludedDates = [newEvent.start];
        } else {
          originalEvent.extendedProps.excludedDates.push(newEvent.start);
        }
      }
      console.log('edited event data', editedEventData)
      this.calendar.addEvent(editedEventData);
    },
    customEventRender(arg) {
      console.log('customEventRender', arg)
      const excludedDates = arg.event.extendedProps.excludedDates || [];
      const startDate = new Date(arg.event.start).toISOString();
      // Check if the event's start date falls within any excluded date
      if (excludedDates.some((excludedDate) => {
        const excludedTomorrrow = new Date(excludedDate);

        const etISOstring = new Date(excludedTomorrrow.setDate(excludedTomorrrow.getDate() + 1)).toISOString();
        console.log( {startDate, excludedDate, etISOstring}, startDate >= excludedDate, startDate < etISOstring)

        if (startDate >= excludedDate && startDate < etISOstring) {
          return false;
        }
      })
      ) {
        return false;
      }
    },
    customEventContent(arg) {

      const formatTime = (date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
      };

      const startTime = formatTime(new Date(arg.event.start));

      const title = `${startTime} ${arg.event.title}`;

      const titleElement = document.createElement('div');
      titleElement.innerText = title;

      return {
        domNodes: [titleElement],
      };
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
