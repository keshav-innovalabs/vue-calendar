<template>
    <div>
        <VueCalendar :currentView="currentView" ref="calendar" :dateClickHandler="handleDateClick"
            :eventClickHandler="handleEventClick" :events="eventData" />
        <EventForm @click="closeForm" :showForm="showEventForm" @save-event="saveEvent" :dateData="dateData"
            :selectedEvent="selectedEvent" />
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
            selectedEvent: null,
            eventData: [
            ]
        };
    },
    watch: {
    },
    methods: {
        saveEvent(eventToSave) {
            console.log('eventToSave: ', eventToSave);
            console.log('events', this.eventData)
            this.selectedEvent = null;
            const eventIndex = this.eventData.findIndex((event) => {
                console.log( event.id ,eventToSave.id)
                return  event.id === eventToSave.id
            });
            console.log('eventIndex', eventIndex)
            if (eventIndex !== -1) {
                this.eventData[eventIndex] = {
                    ...this.eventData[eventIndex],
                    ...eventToSave,
                };
            } else {
                this.eventData.push(eventToSave);
            }
            this.$emit('close-event-form');
        },
        handleDateClick(dateStr) {
            this.dateData = dateStr;
            this.$emit('date-click', dateStr);
        },
        handleEventClick(eventInfo) {
            this.selectedEvent = eventInfo.event;
            this.$emit('event-click');
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