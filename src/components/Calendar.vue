<template>
    <div>
        <VueCalendar :currentView="currentView" ref="calendar" :dateClickHandler="handleDateClick"
            :eventClickHandler="handleEventClick" :events="eventData" />
        <EventForm @click="closeForm" :showForm="showEventForm" @save-event="saveEvent" :dateData="dateData" />
    </div>
</template>
  
<script>
import VueCalendar from './../libs/VueCalendar';
import EventForm from './EventForm.vue';
import ClickOutsideDirective from './../directives/click-outside';
export default {
    name: 'Calendar',
    directives: {
        clickOutside: ClickOutsideDirective, // Register the custom directive
    },
    components: {
        VueCalendar,
        EventForm
    },
    props: {
        currentView: {
            type: String,
            required: true,
            default: 'dayGridMonth'
        },
        showEventForm: {
            type: Boolean,
            required: true,
            default: false
        },
        closeForm: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            dateData: null,
            eventData: [
            ]
        };
    },
    watch: {
    },
    methods: {
        saveEvent(eventData) {
            this.eventData.push(eventData);
            this.$emit('close-event-form');
        },
        handleDateClick(dateStr) {
            this.dateData = dateStr;
            this.$emit('date-click', dateStr);
        },
        handleEventClick(eventInfo) {
            console.log('Event clicked:', eventInfo);
        }
    },
};
</script>
  
<style>
.fc .fc-toolbar-title {
    font-size: 1.75em;
    margin: 0px 5px;
    display: inline-block;
    position: relative;
    top: 6px;
}
</style>