<template>
  <div class="event-form" v-if="showForm">
    <!-- <div class="event-header-container">
      <div>&lt;</div>
      <h4>Create New Event</h4>
    </div> -->
    <div class="event-form-content">
      <input v-model="eventData.title" placeholder="Title" />

      <textarea v-model="eventData.description" placeholder="Description"></textarea>

      <label>Start</label>
      <div class="event-row">
        <input type="date" v-model="eventData.startDate" placeholder="Date" :disabled="eventData.startDate" />
        <input type="time" v-model="eventData.startTime" placeholder="Time" />

        <button @click="resetStartFields">Reset</button>
      </div>

      <label>End</label>
      <div class="event-row">
        <input type="date" v-model="eventData.endDate" placeholder="Date" />
        <input type="time" v-model="eventData.endTime" placeholder="Time" />

        <button @click="resetEndFields">Reset</button>
      </div>
      <label>Repeat Event</label>
      <select v-model="eventData.repeatFrequency">
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>

      <label>Who is Included</label>
      <div class="event-row">
        <button @click="addNewPerson">+ Add New Person</button>
        <div v-if="showAddPersonFields">
          <input v-model="newPerson.name" placeholder="Name" />
          <input v-model="newPerson.email" placeholder="Email" />
          <button @click="saveNewPerson">Save</button>
          <button @click="cancelNewPerson">Cancel</button>
        </div>
      </div>
      <div v-for="person in eventData.includedPeople" :key="person.email">
        {{ person.name }} ({{ person.email }})
      </div>

      <label>Event Location</label>
      <input v-model="eventData.meetingLocation" placeholder="Meeting URL" />

      <label>Notes</label>
      <div class="event-row">
        <button @click="addNewNote">+ Add a Note</button>
        <div v-if="showAddNoteField">
          <textarea v-model="newNote" placeholder="Add a note"></textarea>
          <button @click="saveNewNote">Save</button>
          <button @click="cancelNewNote">Cancel</button>
        </div>
      </div>
      <div v-for="note in eventData.notes" :key="note">{{ note }}</div>

      <button @click="saveEvent">Save</button>
    </div>
  </div>
</template>
  
<script>
import { v4 as uuidv4 } from 'uuid';
export default {
  name: 'EventForm',
  props: {
    showForm: {
      type: Boolean,
      required: true,
    },
    dateData: {
      type: Object,
      required: true,
    },
    selectedEvent: {
      type: Object
    }
  },
  data() {
    return {
      eventData: {
        id:'',
        title: '',
        description: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        repeatFrequency: '',
        includedPeople: [],
        meetingLocation: '',
        notes: [],
      },
      newPerson: {
        name: '',
        email: '',
      },
      newNote: '',
      showAddPersonFields: false,
      showAddNoteField: false,
    };
  },
  mounted() {
  },
  watch: {
    dateData(newDateData) {
      const gridType = newDateData.view.type;

      if (gridType === 'dayGridMonth' || gridType === 'multiMonthFourMonth') {
        this.eventData.startDate = newDateData.dateStr;
      } else if (gridType === 'timeGridDay' || gridType === 'timeGridWeek') {
        const dateAndTime = new Date(newDateData.date);
        this.eventData.startDate = dateAndTime.toISOString().split('T')[0];
        const hours = dateAndTime.getHours();
        const minutes = dateAndTime.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        this.eventData.startTime = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      }
    },
    showForm(newValue, oldValue) {
      if (oldValue === true && newValue === false) {
        this.resetState();
      }
    },
    selectedEvent: {
      handler(newEvent) {
        console.log('event to edit', newEvent)
        if (newEvent) {
          this.eventData.id = newEvent.id
          this.eventData.title = newEvent.title;
          this.eventData.description = newEvent.extendedProps.description;
          const startDate = new Date(newEvent.startStr);
          console.log(newEvent)
          const endDate = new Date(newEvent.endStr);
          console.log(startDate, endDate);
          this.eventData.startDate = startDate.toISOString().split('T')[0];
          this.eventData.startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          this.eventData.endDate = endDate.toISOString().split('T')[0];
          this.eventData.endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          this.eventData.repeatFrequency = newEvent.extendedProps.repeatFrequency;
          this.eventData.meetingLocation = newEvent.extendedProps.meetingLocation;
          this.eventData.notes = newEvent.extendedProps.notes;
          this.eventData.includedPeople = newEvent.extendedProps.includedPeople;
        }
      },
      deep: true
    }
  },
  methods: {
    resetStartFields() {
      this.eventData.startDate = '';
      this.eventData.startTime = '';
    },
    resetEndFields() {
      this.eventData.endDate = '';
      this.eventData.endTime = '';
    },
    addNewPerson() {
      this.showAddPersonFields = true;
    },
    saveNewPerson() {
      this.eventData.includedPeople.push({ ...this.newPerson });
      this.newPerson = { name: '', email: '' };
      this.showAddPersonFields = false;
    },
    cancelNewPerson() {
      this.newPerson = { name: '', email: '' };
      this.showAddPersonFields = false;
    },
    addNewNote() {
      this.showAddNoteField = true;
    },
    saveNewNote() {
      this.eventData.notes.push(this.newNote);
      this.newNote = '';
      this.showAddNoteField = false;
    },
    cancelNewNote() {
      this.newNote = '';
      this.showAddNoteField = false;
    },

    saveEvent() {
      const events = [];
      if (!this.eventData.repeatFrequency) {
        events.push({
          id:this.eventData.id? this.eventData.id :uuidv4(),
          title: this.eventData.title,
          description: this.eventData.description,
          start: new Date(`${this.eventData.startDate}T${this.eventData.startTime}`).toISOString(),
          end: new Date(`${this.eventData.endDate}T${this.eventData.endTime}`).toISOString(),
          allDay: false,
          includedPeople: this.eventData.includedPeople,
          meetingLocation: this.eventData.meetingLocation,
          notes: this.eventData.notes,
        });
      } else {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

        const rrule = {
          freq: '',
          dtstart: '',
          until: '',
          byweekday: [],
        };
        if (this.eventData.repeatFrequency === 'daily') {
          rrule.freq = 'daily';
          rrule.dtstart = `${this.eventData.startDate}T${this.eventData.startTime}:00`;
          rrule.until = endOfYear.toISOString();
        } else if (this.eventData.repeatFrequency === 'weekly') {
          rrule.freq = 'weekly';

          const startDate = new Date(`${this.eventData.startDate}T${this.eventData.startTime}`);
          startDate.setDate(startDate.getDate() - 1);
          rrule.dtstart = startDate;
          rrule.until = endOfYear;
          const dayOfWeek = startDate.getDay();
          rrule.byweekday.push(dayOfWeek);
        } else if (this.eventData.repeatFrequency === 'monthly') {
          rrule.freq = 'monthly';
          rrule.dtstart = `${this.eventData.startDate}T${this.eventData.startTime}:00`;
          rrule.until = endOfYear.toISOString();
          const dayOfMonth = new Date(`${this.eventData.startDate}T${this.eventData.startTime}`).getDate();
          rrule.bymonthday = [dayOfMonth];
        }

        events.push({
          id:this.eventData.id ? this.eventData.id:uuidv4(),
          title: this.eventData.title,
          description: this.eventData.description,
          rrule,
          allDay: false,
          includedPeople: this.eventData.includedPeople,
          meetingLocation: this.eventData.meetingLocation,
          notes: this.eventData.notes,

        });
      }

      this.$emit('save-event', events[0]);
      this.resetState();
    }
    ,
    resetState() {
      this.eventData = {
        title: '',
        description: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        repeatFrequency: '',
        includedPeople: [],
        meetingLocation: '',
        notes: [],
      };
      this.newPerson = {
        name: '',
        email: '',
      };
      this.newNote = '';
      this.showAddPersonFields = false;
      this.showAddNoteField = false;
    },
  },
};
</script>
  
<style scoped>
.event-form {
  position: fixed;
  top: 0;
  right: 0;
  width: 33%;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 20px);
}

.event-header-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #E1E5FD;
}

.event-form-content {
  flex-grow: 1;
  padding: 20px;

}

.event-form {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 500px;
  margin: 0 auto;
}

.event-form-content {
  flex-grow: 1;
}

.event-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

input,
textarea,
select {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
}

button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
}

button:hover {
  background-color: #0069d9;
}

label {
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
  