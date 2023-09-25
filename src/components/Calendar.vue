<template>
    <div>
        <VueCalendar :currentView="currentView" ref="calendar" />
        <EventForm :showForm="showForm" @save-event="saveEvent" />
    </div>
</div></template>
  
<script>
import VueCalendar from './../libs/VueCalendar';
import EventForm from './EventForm.vue';

export default {
    name: 'Calendar',
    components: {
        VueCalendar,
        EventForm
    },
    props: {
        currentView: {
            type: String,
            required: true,
            default: 'dayGridMonth'
        }
    },
    data() {
        return {
            showForm: false,
        };
    },
    methods: {
        saveEvent(eventData) {
            console.log('Event data:', eventData);
            this.showForm = false;
        },
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