<template>
    <div class="calendar-navbar">
        <!-- Left Section -->
        <div class="left-section">
            <ButtonContainer :currentView="currentView" :views="views" @nav-button-click="(view) => changeView(view)" />
        </div>

        <!-- Center Section -->
        <div class="center-section">
            <button @click="navigate(-1)">&lt;</button>
            <span>{{ centerText }}</span>
            <button @click="navigate(1)">></button>
        </div>

        <!-- Right Section -->
        <div class="right-section">
            <button @click="openCreateEventModal">+ Create New Event</button>
        </div>
    </div>

    <!-- Calendar -->
    <Calendar :currentView="currentView.viewId" />
</template>
  
<script>
import ButtonContainer from './ButtonContainer.vue'
import Calendar from './Calendar.vue'
export default {
    name: 'Schedular',
    components: {
        ButtonContainer,
        Calendar
    },
    data() {
        return {
            views:
                [
                    { viewName: 'DAY', viewId: 'timeGridDay' },
                    { viewName: 'WEEK', viewId: 'timeGridWeek' },
                    { viewName: 'MONTH', viewId: 'dayGridMonth' },
                    { viewName: 'QUARTER', viewId: 'multiMonthFourMonth' },
                ]
            ,
            currentView: { viewName: 'MONTH', viewId: 'dayGridMonth' },
            currentDate: new Date(),
        };
    },
    computed: {
        centerText() {
            const text = this.getViewText(this.currentView.viewName );
            if (this.currentView.viewName === 'QUARTER') {
                return `Quarter ${text}`;
            }
            return text;
        },
    },
    methods: {
        changeView(view) {
            this.currentView = view;
        },
        navigate(change) {
            const step = this.getStep(this.currentView.viewName );
            this.currentDate = new Date(this.currentDate.getTime() + change * step);
        },
        getViewText(view) {
            switch (view) {
                case 'DAY':
                    return this.formatDate(this.currentDate);
                case 'WEEK':
                    return this.getWeekText(this.currentDate);
                case 'MONTH':
                    return this.formatMonth(this.currentDate);
                case 'QUARTER':
                    return this.getQuarterText(this.currentDate);
                default:
                    return '';
            }
        },
        formatDate(date) {
            const options = { weekday: 'short', day: 'numeric', MONTH: 'long', year: 'numeric' };
            return date.toLocaleDateString(undefined, options);
        },
        getWeekText(date) {
            const weekNumber = this.getWeekNumber(date);
            const formattedDate = this.formatDate(date);
            const year = date.getFullYear();
            return `Week ${weekNumber} - ${formattedDate} ${year}`;
        },

        getWeekNumber(date) {
            const dateObj = new Date(date);
            const dayOfWeek = dateObj.getDay();
            const daysSinceYearStart = Math.floor((dateObj.getTime() - new Date(dateObj.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24));
            const weekNumber = Math.ceil((dayOfWeek + 1 + daysSinceYearStart) / 7);
            return weekNumber;
        },
        formatMonth(date) {
            const options = { month: 'long', year: 'numeric' };
            return date.toLocaleDateString(undefined, options);
        },
        getQuarterText(date) {
            const quarter = this.getQuarter(date);
            const month = this.formatMonth(date)
            return `${quarter} - ${month}`;
        },
        getQuarter(date) {
            const month = date.getMonth();
            if (month >= 0 && month < 4) {
                return 1;
            } else if (month >= 4 && month < 8) {
                return 2;
            } else {
                return 3;
            }
        },
        getStep(view) {
            switch (view) {
                case 'DAY':
                    return 1000 * 60 * 60 * 24;
                case 'WEEK':
                    return 1000 * 60 * 60 * 24 * 7;
                case 'MONTH':
                    return 1000 * 60 * 60 * 24 * 30;
                case 'QUARTER':
                    return 1000 * 60 * 60 * 24 * 30 * 3;
                default:
                    return 0;
            }
        },
        openCreateEventModal() {
            // Logic to open the create event modal
        },
    },
};
</script>
  
<style scoped>
.calendar-navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f0f0f0;
    padding: 30px;
}

.left-section {
    width: 25%;
}

.left-section button {
    cursor: pointer;
}

.left-section .active {
    font-weight: bold;
}

.center-section {
    display: flex;
    align-items: center;
}

.right-section button {
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 5px 10px;
    margin-right: 10px;
    border-radius: 5px;
}

.right-section button:hover {
    background-color: #0056b3;
}

.center-section span {
    font-weight: bold;
    margin: 0 10px;
}
</style>
  