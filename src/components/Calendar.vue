<template>
    <div>
        <VueCalendar :currentView="currentView" ref="calendar" :dateClickHandler="handleDateClick"
            :eventClickHandler="handleEventClick" :events="eventData" :eventToEdit="eventToEdit" />
        <EventForm @click="closeForm" :showForm="showEventForm" @save-event="saveEvent" :dateData="dateData"
            :selectedEvent="selectedEvent" :getEventById="getEventById" />
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
            ],
            eventToEdit: null
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
                console.log(event.id, eventToSave.id)
                return event.id === eventToSave.id
            });
            console.log('eventIndex', eventIndex)
            if (eventIndex !== -1) {
                // this.eventData[eventIndex] = {
                //     ...this.eventData[eventIndex],
                //     ...eventToSave,
                // };
                this.eventToEdit = eventToSave
            } else {
                this.eventToEdit = eventToSave
            }
            this.$emit('close-event-form');
        },
        handleDateClick(dateStr) {
            this.dateData = dateStr;
            this.$emit('date-click', dateStr);
        },
        handleEventClick(eventInfo) {
            console.log('eventinof', eventInfo, eventInfo.event._instance)
            this.selectedEvent = eventInfo;
            this.$emit('event-click');
        },
        getEventById(EventId) {
            const event = this.$refs.calendar.getEventById(EventId);
            return event;
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

.fc-event:hover {
    background-color: #bedbbb;
    cursor: pointer;
}
.strike-through {
  text-decoration: line-through;
  color: gray; 
}
</style>