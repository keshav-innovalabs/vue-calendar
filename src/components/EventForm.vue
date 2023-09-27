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
    }
  },
  data() {
    return {
      eventData: {
        title: '',
        description: '',
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
      console.log("datedata", this.dateData)
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
    // saveEvent() {
    //   if (this.eventData.repeatFrequency === 'monthly') {
    //     const currentDate = new Date();
    //     const currentYear = currentDate.getFullYear();
    //     const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

    //     const event = {
    //       title: this.eventData.title,
    //       description: this.eventData.description,
    //       rrule: {
    //         freq: 'monthly',
    //         interval: 1, // Monthly recurrence
    //         dtstart: `${this.eventData.startDate}T${this.eventData.startTime}`,
    //         until: endOfYear.toISOString(),
    //       },
    //       allDay: false, // Assuming it's not an all-day event
    //       includedPeople: this.eventData.includedPeople,
    //       meetingLocation: this.eventData.meetingLocation,
    //       notes: this.eventData.notes,
    //     }
    //     this.$emit('save-event', event);
    //   } else {
    //     const startISO = new Date(
    //       `${this.eventData.startDate}T${this.eventData.startTime}`
    //     ).toISOString();
    //     const endISO = new Date(
    //       `${this.eventData.endDate}T${this.eventData.endTime}`
    //     ).toISOString();
    //     const event = {
    //       title: this.eventData.title,
    //       description: this.eventData.description,
    //       start: startISO,
    //       end: endISO,
    //       allDay: false, // Set to false for events with specific times
    //       includedPeople: this.eventData.includedPeople,
    //       meetingLocation: this.eventData.meetingLocation,
    //       notes: this.eventData.notes,
    //     };
    //     const daysOfWeek = [];

    //     if (this.eventData.repeatFrequency === 'daily') {
    //       daysOfWeek.push(0, 1, 2, 3, 4, 5, 6);
    //     } else if (this.eventData.repeatFrequency === 'weekly') {
    //       const startDate = new Date(
    //         `${this.eventData.startDate}T${this.eventData.startTime}`
    //       );
    //       const startDayOfWeek = startDate.getDay();
    //       daysOfWeek.push(startDayOfWeek);
    //     }
    //     if (daysOfWeek.length > 0) {
    //       event['daysOfWeek'] = daysOfWeek
    //     }
    //     this.$emit('save-event', event);
    //   }
    // },

    saveEvent() {
      const events = [];

      if (!this.eventData.repeatFrequency) {
        // If no repetition, push the single event to the events array
        events.push({
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

        // Set dtstart and until based on repeatFrequency
        if (this.eventData.repeatFrequency === 'daily') {
          rrule.freq = 'daily';
          rrule.dtstart = `${this.eventData.startDate}T${this.eventData.startTime}:00`;
          rrule.until = endOfYear.toISOString();
        } else if (this.eventData.repeatFrequency === 'weekly') {
          rrule.freq = 'weekly';
          rrule.dtstart = new Date(`${this.eventData.startDate}T${this.eventData.startTime}`);
          rrule.until = endOfYear;

          // Determine the day of the week based on startDate and FullCalendar's format (0 for Sunday, 1 for Monday, etc.)
          const startDate = new Date(`${this.eventData.startDate}T${this.eventData.startTime}`);
          const dayOfWeek = startDate.getDay();

          // Adjust dayOfWeek to FullCalendar's format
          const fullCalendarDayOfWeek = (dayOfWeek === 0) ? 7 : dayOfWeek;

          // Push the adjusted day of the week to byweekday array
          rrule.byweekday.push(fullCalendarDayOfWeek);
        } else if (this.eventData.repeatFrequency === 'monthly') {
          rrule.freq = 'monthly';
          rrule.dtstart = `${this.eventData.startDate}T${this.eventData.startTime}:00`;
          rrule.until = endOfYear.toISOString(); // Adjust the end date as needed
          const dayOfMonth = new Date(`${this.eventData.startDate}T${this.eventData.startTime}`).getDate();
          // Set the bymonthday property to the extracted day of the month
          rrule.bymonthday = [dayOfMonth];
        }

        // Push the event data with the rrule property
        events.push({
          title: this.eventData.title,
          description: this.eventData.description,
          rrule, // Include the rrule configuration
          allDay: false,
          includedPeople: this.eventData.includedPeople,
          meetingLocation: this.eventData.meetingLocation,
          notes: this.eventData.notes,
        });
      }

      this.$emit('save-event', events[0]);
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
  