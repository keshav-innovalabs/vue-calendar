<template>
    <div class="event-form" v-if="showForm">
      <input v-model="eventData.title" placeholder="Title" />
  
      <textarea v-model="eventData.description" placeholder="Description"></textarea>
  
      <label>Start</label>
      <div class="event-row">
        <input v-model="eventData.startDate" placeholder="Date" />
        <input v-model="eventData.startTime" placeholder="Time" />
  
        <button @click="resetStartFields">Reset</button>
      </div>
  
      <label>End</label>
      <div class="event-row">
        <input v-model="eventData.endDate" placeholder="Date" />
        <input v-model="eventData.endTime" placeholder="Time" />
  
        <button @click="resetEndFields">Reset</button>
      </div>
      <label>Repeat Event</label>
      <select v-model="eventData.repeatFrequency">
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
  
      <label>Who is Included</label>
      <div class="event-row">
        <button @click="addNewPerson">+ Add New Person</button>
        <div v-if="showAddPersonModal">
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
        <div v-if="showAddNoteModal">
          <textarea v-model="newNote" placeholder="Add a note"></textarea>
          <button @click="saveNewNote">Save</button>
          <button @click="cancelNewNote">Cancel</button>
        </div>
      </div>
      <div v-for="note in eventData.notes" :key="note">{{ note }}</div>
  
      <button @click="saveEvent">Save</button>
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
    },
    data() {
      return {
        eventData: {
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
        showAddPersonModal: false,
        showAddNoteModal: false,
      };
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
        this.showAddPersonModal = true;
      },
      saveNewPerson() {
        this.eventData.includedPeople.push({ ...this.newPerson });
        this.newPerson = { name: '', email: '' };
        this.showAddPersonModal = false;
      },
      cancelNewPerson() {
        this.newPerson = { name: '', email: '' };
        this.showAddPersonModal = false;
      },
      addNewNote() {
        this.showAddNoteModal = true;
      },
      saveNewNote() {
        this.eventData.notes.push(this.newNote);
        this.newNote = '';
        this.showAddNoteModal = false;
      },
      cancelNewNote() {
        this.newNote = '';
        this.showAddNoteModal = false;
      },
      saveEvent() {
        this.$emit('save-event', this.eventData);
      },
    },
  };
  </script>
  
  <style scoped>
  .event-form {
  }
  
  .event-row {
    display: flex;
    align-items: center;
  }
  
  </style>
  