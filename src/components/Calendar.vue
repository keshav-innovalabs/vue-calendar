<template>
    <div>
        <VueCalendar :currentView="currentView" ref="calendar" :dateClickHandler="handleDateClick"
            :eventClickHandler="handleEventClick" />
        <!-- <EventForm 
        v-click-outside="closeForm" 
        @click.self="closeForm" 
        :showForm="showEventForm"
         @save-event="saveEvent" 
         /> -->
        <EventForm 
        @click.self="closeForm" 
        :showForm="showEventForm"
         @save-event="saveEvent" 
         />
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
        }
    },
    data() {
        return {
        };
    },
    methods: {
        saveEvent(eventData) {
            this.showForm = false;
        },
        handleDateClick(dateStr) {
            this.$emit('date-click', dateStr);
        },
        handleEventClick(eventInfo) {
            console.log('Event clicked:', eventInfo);
        },
        closeForm() {
            this.$emit('close-form');
        }
    },
};
</script>
  
<style>

</style>