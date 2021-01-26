<template>
  <div class="schedule_wrap">
  <div class="generaldata_container" v-if="scheduleState">
    <generaldata class="data_text" v-bind:data="weekHours">VALANDŲ ŠIĄ SAVAITĘ:</generaldata>
    <generaldata class="data_text" v-bind:data="monthHours">VALANDŲ ŠĮ MĖNESĮ:</generaldata>
    <generaldata class="data_text" v-bind:data="totalHours">BENDRA VALANDŲ SUMA:</generaldata>
  </div>
  <div class="block_container" v-bind:class="{middle: !scheduleState}">
      <div class="input_container" v-if="month.length">
          <a class="schedule_back" @click="$router.go({name: 'Tvarkarastis'})">&#60; STUDENTŲ SĄRAŠAS</a>
          <div class="student_data_row">
            <button class="schedule_add" title="Pridėti tvarkaraštį" @click="newSchedule()"
            @mouseover="addIcon = require('../assets/add_active.svg')"
            @mouseout="addIcon = require('../assets/add.svg')">
            <img class="unselectable add_icon" :src="addIcon" alt="Add button" title="Pridėti tvarkaraštį"></button>
            <div class="student_name_wrap">
            <img class="student_icon" src="../assets/student.svg" alt="Student icon">
            <h1 class="student_name">{{traineeFname}} {{traineeLname}}</h1>
            </div>
          </div>
          <div class="data_input_block">
            <form class="data_input_form" @submit.prevent="timeInput()">
                <div class="schedule_select_wrap">
                <label v-if="scheduleData.trainee[0].schedules.length > 1" for="schedule_select">Tvarkaraštis</label>
                <select v-if="scheduleData.trainee[0].schedules.length > 1" class="schedule_select" v-model="scheduleID">
                  <option value="default" selected hidden>Pasirinkti tvarkaraštį</option>
                  <option v-for="(item, index) in scheduleData.trainee[0].schedules" v-bind:key="index" :value="index">{{item.start_date}} / {{item.end_date}}</option>
                </select>
                <img class="delete_icon unselectable" v-bind:class="{ one: scheduleData.trainee[0].schedules.length == 1}" @click="deleteSchedule()" src="../assets/delete.svg" title="Trinti tvarkaraštį" alt="Delete">
                </div>
              <div class="data_date_row intern_span">
                  <div class="date_input_wrap">
                      <label for="student_date_from">Praktika nuo</label>
                      <input class="student_date_from" type="date" v-model="internFrom" v-bind:class="{error: scheduleSpanError}">
                  </div>
                  <div class="date_input_wrap">
                      <label for="student_date_till">Praktika iki</label>
                      <input class="student_date_till" type="date" v-model="internTill" v-bind:class="{error: scheduleSpanError}">
                  </div>
          </div>
          <div>
          <FunctionalCalendar ref="Calendar" v-model="calendarData" v-on:changedMonth="handleMonth" v-on:choseDay="handleDay" :configs="calendarConfigs" v-bind:class="{ error: dateError || dateBeforeError || scheduleSpanError, edit_disable: timeEdit }"></FunctionalCalendar>
          </div>
              <div class="lower_input_column">
                  <span class="input_error_message" v-if="dateError">Pasirinkite norimą datą</span>
                  <span class="input_error_message" v-if="dateBeforeError">Įvedimas atgaline data negalimas</span>
                  <span class="input_error_message" v-if="scheduleSpanError">Įvedamo laiko data nepriklauso praktikos laikotarpiui</span>
                  <span class="input_error_message top" v-if="unavailableError">Šis laikas yra užimtas</span>
                  <span class="input_error_message top" v-if="timeError">Įvestas netinkamas laikas</span>
                  <span class="input_error_message top" v-if="timeSpanError">Įvesta veikla trumpesnė nei 30 min.</span>
                  <div class="data_date_row">
                  <div class="date_input_wrap">
                  <label for="student_time_from">Laikas nuo</label>
                  <VueTimepicker name="student_time_from" :hour-range="[8, 9, 10, 11, 12, 13, 14, 15, 16, 17]" :minute-interval="5" hide-disabled-hours v-model="timeFrom" v-bind:class="{ error: fromError || timeError, edit: timeEdit }"></VueTimepicker>
                  </div>
                  <div class="date_input_wrap">
                  <label for="student_time_till">Laikas iki</label>
                  <VueTimepicker name="student_time_till" :hour-range="[8, 9, 10, 11, 12, 13, 14, 15, 16, 17]" :minute-interval="5" hide-disabled-hours v-model="timeTill" v-bind:class="{ error: tillError || timeError || timeSpanError, edit: timeEdit }"></VueTimepicker>
                  </div>
                  </div>
                  <label for="student_type">Tipas</label>
                  <select class="student_type" type="time" v-model="timeType" v-bind:class="{ error: typeError, edit: timeEdit }">
                  <option value="default" selected hidden>Pasirinkti tipą</option>
                  <option value="intern">Praktika</option>
                  <option value="lecture">Paskaita</option>
                  <option value="off-time">Laisvos</option>
                  <option value="break">Pertrauka</option>
              </select>
              </div>
              <input v-if="!timeEdit" class="schedule_data_input" type="submit" value="ĮRAŠYTI">
              <div class="edit_button_wrap">
              <input v-if="timeEdit" class="schedule_data_input" type="submit" value="REDAGUOTI">
              <input v-if="timeEdit" class="schedule_data_input" type="button" value="ATŠAUKTI" @click="cancelEditTime()">
              </div>
            </form>
          </div>
      </div>
          <a class="schedule_back" v-if="createSchedule || selectSchedule" @click="$router.go({name: 'Tvarkarastis'})">&#60; STUDENTŲ SĄRAŠAS</a>
          <div class="option_wrap" v-if="createSchedule">
            <img class="student_icon" src="../assets/student.svg" alt="Student icon">
            <h1>SUKURKITE {{traineeFname}} TVARKARAŠTĮ</h1>
            <form @submit.prevent="scheduleCreate()">
                <label for="start">Praktika nuo</label>
                <input id="start" type="date" v-model="internFrom" required>
                <label for="end">Praktika iki</label>
                <input id="end" type="date" v-model="internTill" required>
                <span class="input_error_message static" v-if="scheduleBeforeError">Įvedimas atgaline data negalimas!</span>
                <span class="input_error_message static" v-if="scheduleEndError">Praktikos pabaiga ankstesnė už pradžią!</span>
                <input class="option_submit" type="submit" value="SUKURTI">
                <input class="option_submit" type="button" value="ATŠAUKTI" v-if="scheduleData.trainee[0].schedules.length > 0" @click="scheduleCreateCancel()">
            </form>
          </div>
          <div class="option_wrap" v-if="selectSchedule" @submit.prevent="scheduleSelect()">
              <img class="student_icon" src="../assets/student.svg" alt="Student icon">
              <h1>PASIRINKITE {{traineeFname}} TVARKARAŠTĮ</h1>
              <form>
              <select v-model="scheduleID" required>
                  <option value="default" selected hidden>Pasirinkti tvarkaraštį</option>
                  <option v-for="(item, index) in scheduleData.trainee[0].schedules" v-bind:key="index" :value="index">{{item.start_date}} / {{item.end_date}}</option>
              </select>
              <input class="option_submit" type="submit" value="PASIRINKTI">
              </form>
          </div>
      <div class="schedule_container" v-if="month.length">
          <div class="shcedule_control_container">
              <img class="schedule_download" src="../assets/download.svg" title="Atsisiųsti tvarkaraštį" alt="Download" @click="downloadSchedule()">
              <div class="schedule_controls">
                <div class="schedule_date_push" v-bind:class="{ disabled: monthState || timeEdit }">
                    <button class="date_push_button unselectable" v-bind:class="{push_disabled: currentWeek == 0}" :disabled="monthState || (currentWeek == 0)" @click="pushWeek(-1)">&lt;</button>
                    <span class="selected_date unselectable">{{month[currentWeek][0][0].getMonth()+1}}<span class="date_dash unselectable">/</span>{{month[currentWeek][0][0].getDate()}} - {{month[currentWeek][4][0].getMonth()+1}}<span class="date_dash unselectable">/</span>{{month[currentWeek][4][0].getDate()}}</span>
                    <button class="date_push_button unselectable" v-bind:class="{push_disabled: currentWeek == month.length-1}" :disabled="monthState" @click="pushWeek(1)">&gt;</button>
                </div>
                <div class="schedule_span_select">
                    <button class="schedule_span_button unselectable" v-bind:class="{ selected: weekState }" @click="monthState=false; weekState=true">Savaitė</button>
                    <button class="schedule_span_button unselectable" v-bind:class="{ selected: monthState }" @click="monthState=true; weekState=false">Mėnuo</button>
                </div>
              </div>
              <div class="schedule_colors">
                  <span>Praktika <div class="color_cube intern"></div></span>
                  <span>Laisvos <div class="color_cube free"></div></span>
                  <span>Paskaita <div class="color_cube lecture"></div></span>
                  <span>Pertrauka <div class="color_cube break"></div></span>
              </div>
          </div>
          <WeekTable v-if="weekState && scheduleData.trainee[0].schedules.length > 0" v-bind:array="month[currentWeek]" v-bind:selectedDate="calendarData.selectedDate" v-bind:id="id" v-bind:scheduleID="scheduleData.trainee[0].schedules[scheduleID].id"></WeekTable>
          <MonthTable v-if="monthState && scheduleData.trainee[0].schedules.length > 0" v-bind:array="month" v-bind:month="calendarData.currentDate.getMonth()"></MonthTable>
      </div>
  </div>
</div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import Generaldata from './DataBlock.vue'
import WeekTable from './WeeklyTable.vue';
import MonthTable from './MonthlyTable.vue';
import FunctionalCalendar from 'vue-functional-calendar';
import VueTimepicker from 'vue2-timepicker'
import router from '../router/index'
import 'vue2-timepicker/dist/VueTimepicker.css'

Vue.use(FunctionalCalendar, {
    dayNames: ['Pr', 'An', 'Tr', 'Kt', 'Pn', 'Št', 'Sk'],
    monthNames: ["SAUSIS", "VASARIS", "KOVAS", "BALANDIS", "GEGUŽĖ", "BIRŽELIS",
     "LIEPA","RUGPJŪTIS", "RUGSĖJIS", "SPALIS", "LAPKRITIS", "GRUODIS"]
});
export default {
    props: ['id'],
    components: {Generaldata, WeekTable, MonthTable, VueTimepicker},
    data () {
      return {
        timespanState: false,
        filterState: false,
        traineeFname: "",
        traineeLname: "",
        calendarData: {
            currentDate: new Date(),
            dateRange : {
                end: "",
                start: "",
            },
            multipleDateRange: [],
            selectedDate: false,
            selectedDateTime: false,
            selectedDates: [],
            selectedDatesItem: "",
            selectedHour: "00",
            selectedMinute: "00"
        },
        calendarConfigs: {
                sundayStart: false,
                dateFormat: 'dd/mm/yyyy',
                isDatePicker: true,
                isDateRange: false
        },
        createSchedule: false,
        scheduleBeforeError: false,
        scheduleEndError: false,
        selectSchedule: false,
        tableReload: false,
        scheduleID: 0,
        scheduleData: {

        },
        scheduleState: false,
        addIcon: require("../assets/add.svg"),
        weekHours: 0,
        monthHours: 0,
        totalHours: 0,
        times: [],
        days: [],
        month: [],
        inputMonth: '',
        currentWeek: 0,
        studentList: [],
        monthState: false,
        weekState: true,
        timeType: "default",
        timeFrom: "",
        timeTill: "",
        internFrom: "",
        internTill: "",
        timeEdit: false,
        editID: undefined,
        dateError: false,
        dateBeforeError: false,
        typeError: false,
        fromError: false,
        timeError: false,
        tillError: false,
        timeSpanError: false,
        scheduleSpanError: false,
        unavailableError: false
        }
    },
    mounted(){
        this.loadData();
        this.inputMonth = this.calendarData.currentDate.getFullYear() + '-' + (this.calendarData.currentDate.getMonth()+1);
        this.$root.$on('ScheduleDeleted', () => {
            if(this.scheduleData.trainee[0].schedules.length > 1){
                this.tableReload = true;
                if(this.scheduleID > 0){
                  this.scheduleID--;
                }
                this.loadData();
            } else {
                this.month = [];
                this.loadData();
            }
        });
        this.$root.$on('TimeDeleted', () => {
            this.tableReload = true;
            this.month = [];
            this.loadData();
            this.handleMonth();
        });
        this.$root.$on('TimeEdit', (item,date) => {
            this.editTime(item,date);
        })
    },
    watch: {
    timeFrom: function() {
          if(this.timeFrom != ""){
              this.fromError = false;
          }
          if(this.unavailableError){
              this.unavailableError = false;
          }
          if(this.timeSpanError){
            this.timeSpanError = false;
          }
          if(this.timeError){
            this.timeError = false;
          }
        },
    timeTill: function() {
        if(this.timeTill != ""){
              this.tillError = false;
        }
        if(this.unavailableError){
              this.unavailableError = false;
        }
        if(this.timeSpanError){
            this.timeSpanError = false;
        }
        if(this.timeError){
            this.timeError = false;
        }
    },
    timeType: function() {
        if(this.timeType != "default"){
              this.typeError = false;
        }
    },
    internFrom: function() {
        if(this.scheduleBeforeError || this.scheduleEndError || this.scheduleSpanError){
            this.scheduleBeforeError = false;
            this.scheduleEndError = false;
            this.scheduleSpanError = false;
        }
        if(!this.createSchedule){
            this.updateScheduleDates();
        }
    },
    internTill: function() {
        if(this.scheduleEndError || this.scheduleSpanError){
            this.scheduleEndError = false;
            this.scheduleSpanError = false;
        }
        if(!this.createSchedule){
            this.updateScheduleDates();
        }
    },
    scheduleID: function() {
        if(!this.selectSchedule && !this.createSchedule){
        this.scheduleSelect();
        }
    }
    },
    methods: {
        loadData(){
        let config= {
                headers: { Authorization: `Bearer ${localStorage.token}` }
        };
        axios.get('http://127.0.0.1:8000/api/trainee/schedule/'+this.id,config)
            .then((resp) => {
                 this.scheduleData = resp.data;
                 this.traineeFname = this.scheduleData.trainee[0].firstname;
                 this.traineeLname = this.scheduleData.trainee[0].lastname;
                 if(this.scheduleData.trainee[0].schedules.length == 0){
                     this.scheduleState = false;
                     this.createSchedule = true;
                 }else if(this.scheduleData.trainee[0].schedules.length == 1 && !this.createSchedule){
                 this.scheduleState = true;
                 this.internFrom = this.scheduleData.trainee[0].schedules[0].start_date;
                 this.internTill = this.scheduleData.trainee[0].schedules[0].end_date;
                 this.weekHours = Math.floor(this.scheduleData.trainee[0].schedules[this.scheduleID].works_hours.week_hours/60);
                 this.monthHours = Math.floor(this.scheduleData.trainee[0].schedules[this.scheduleID].works_hours.month_hours/60);
                 this.totalHours = Math.floor(this.scheduleData.trainee[0].schedules[this.scheduleID].works_hours.total_hours/60);
                 this.getMonth();
                 }else if(this.scheduleData.trainee[0].schedules.length > 1 && !this.createSchedule && !this.tableReload){
                     this.selectSchedule = true;
                 }else if(this.createSchedule){
                        this.scheduleID = (this.scheduleData.trainee[0].schedules.length)-1;
                        this.internFrom = this.scheduleData.trainee[0].schedules[this.scheduleID].start_date;
                        this.internTill = this.scheduleData.trainee[0].schedules[this.scheduleID].end_date;
                        this.weekHours = Math.floor(this.scheduleData.trainee[0].schedules[this.scheduleID].works_hours.week_hours/60);
                        this.monthHours = Math.floor(this.scheduleData.trainee[0].schedules[this.scheduleID].works_hours.month_hours/60);
                        this.totalHours = Math.floor(this.scheduleData.trainee[0].schedules[this.scheduleID].works_hours.total_hours/60);
                        this.getMonth();
                        this.createSchedule=false;
                 } else if(this.tableReload){
                     this.tableReload = false;
                     this.weekHours = Math.floor(this.scheduleData.trainee[0].schedules[this.scheduleID].works_hours.week_hours/60);
                     this.monthHours = Math.floor(this.scheduleData.trainee[0].schedules[this.scheduleID].works_hours.month_hours/60);
                     this.totalHours = Math.floor(this.scheduleData.trainee[0].schedules[this.scheduleID].works_hours.total_hours/60);
                     this.getMonth();
                 }
            })
            .catch(error => {
                if(error.response.data.message == "Route [login] not defined."){
                    router.push({name: 'Prisijungimas'});
                }
            });
        },
        scheduleCreate(){
            let config= {
                headers: { Authorization: `Bearer ${localStorage.token}` }
            };
            var today = new Date();
            var internFrom = new Date(this.internFrom);
            var internTill = new Date(this.internTill);
            if(internFrom >= today){
                if(internFrom < internTill){
                    let internSpan = {
                        start_date : this.internFrom,
                        end_date : this.internTill
                    }
                    axios.post('http://127.0.0.1:8000/api/schedule/'+this.id,internSpan,config)
                    .then(resp => {
                        this.scheduleState = true;
                        this.loadData();
                    })
                    .catch(error => {
                        if(error.response.data.message == "Route [login] not defined."){
                            router.push({name: 'Prisijungimas'});
                        }
                    });
                } else {
                    this.scheduleEndError = true;
                }
            }else {
                this.scheduleBeforeError = true;
            }
        },
        scheduleCreateCancel(){
            this.createSchedule=false;
            this.getMonth();
            this.internFrom = this.scheduleData.trainee[0].schedules[this.scheduleID].start_date;
            this.internTill = this.scheduleData.trainee[0].schedules[this.scheduleID].end_date;
        },
        scheduleSelect(){
            this.selectSchedule = false;
            this.internFrom = this.scheduleData.trainee[0].schedules[this.scheduleID].start_date;
            this.internTill = this.scheduleData.trainee[0].schedules[this.scheduleID].end_date;
            this.weekHours = Math.floor(this.scheduleData.trainee[0].schedules[this.scheduleID].works_hours.week_hours/60);
            this.monthHours = Math.floor(this.scheduleData.trainee[0].schedules[this.scheduleID].works_hours.month_hours/60);
            this.totalHours = Math.floor(this.scheduleData.trainee[0].schedules[this.scheduleID].works_hours.total_hours/60);
            this.scheduleState = true;
            this.getMonth();
        },
        newSchedule(){
            this.internFrom = '';
            this.internTill = '';
            this.month = [];
            this.createSchedule = true;
        },
        deleteSchedule(){
            let deleteID = this.scheduleData.trainee[0].schedules[this.scheduleID].id;
            let title = this.scheduleData.trainee[0].schedules[this.scheduleID].start_date + '/' + this.scheduleData.trainee[0].schedules[this.scheduleID].end_date;
            this.$root.$emit('Alert', 'scheduleDelete', this.id, deleteID, 'AR TIKRAI NORITE PAŠALINTI TVARKARAŠTĮ', title);
        },
        getMonth(){
            this.days=[];
            this.month=[];
            this.times=[];
            let input = this.inputMonth.split('-');
            let year = input[0];
            let month = input[1]-1;
            var date = new Date(year, month, 1);
            while (date.getMonth() === month) {
                this.days.push([new Date(date)]);
                    for(let f = 0; f < this.scheduleData.trainee[0].schedules[this.scheduleID].months.length; f++){
                     if((month+1) == this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].index && year == this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].year){
                         for(let j = 0; j < this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].days.length; j++){
                         if(date.getDate() == this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].days[j].index){
                             for(let k = 0; k < this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].days[j].times.length; k++){
                                let timeData = {
                                    time_from: this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].days[j].times[k].time_from,
                                    time_to: this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].days[j].times[k].time_to,
                                    type_of_time: this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].days[j].times[k].type,
                                    time_id: this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].days[j].times[k].id
                                };
                                this.days[this.days.length-1].push(timeData);
                             }
                         }
                         }
                     }
                }
                date.setDate(date.getDate() + 1);
            }
            if (this.days[0][0].getDay() > 1)
            {
                let add = new Date(year, month, 0);
                while(this.days[0][0].getDay() != 1)
                {
                    this.days.unshift([new Date(add)]);
                    for(let f = 0; f < this.scheduleData.trainee[0].schedules[this.scheduleID].months.length; f++){
                     if((add.getMonth()+1) == this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].index && add.getFullYear() == this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].year){
                         for(let j = 0; j < this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].days.length; j++){
                         if(add.getDate() == this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].days[j].index){
                             for(let k = 0; k < this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].days[j].times.length; k++){
                                let timeData = {
                                    time_from: this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].days[j].times[k].time_from,
                                    time_to: this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].days[j].times[k].time_to,
                                    type_of_time: this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].days[j].times[k].type,
                                    time_id: this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].days[j].times[k].id
                                };
                                this.days[0].push(timeData);
                             }
                         }
                     }
                  }
                }
                    add.setDate(add.getDate() - 1);
                }
            }
            if (this.days[this.days.length-1][0].getDay() != 0){
                let add = new Date(year, month+1, 1);
                while(this.days[this.days.length-1][0].getDay() != 0)
                {
                    this.days.push([new Date(add)]);
                    for(let f = 0; f < this.scheduleData.trainee[0].schedules[this.scheduleID].months.length; f++){
                     if((add.getMonth()+1) == this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].index && add.getFullYear() == this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].year){
                         for(let j = 0; j < this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].days.length; j++){
                         if(add.getDate() == this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].days[j].index){
                             for(let k = 0; k < this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].days[j].times.length; k++){
                                let timeData = {
                                    time_from: this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].days[j].times[k].time_from,
                                    time_to: this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].days[j].times[k].time_to,
                                    type_of_time: this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].days[j].times[k].type,
                                    time_id: this.scheduleData.trainee[0].schedules[this.scheduleID].months[f].days[j].times[k].id
                                };
                                this.days[this.days.length-1].push(timeData);
                             }
                         }
                     }
                  }
                }
                    add.setDate(add.getDate() + 1);
                }
            }
            while(this.days.length){
                this.month.push(this.days.splice(0, 5));
                this.days.splice(0,2);
            }
            if(!this.calendarData.selectedDate){
            this.calendarData.selectedDate = this.month[this.currentWeek][0][0].toLocaleDateString('el-GR');
            //this.calendarData.selectedDate = new Date(this.internFrom).toLocaleDateString('el-GR');
            //this.handleDay();
            }
        },
        pushWeek(direction){
            if(direction < 0 && this.currentWeek > 0){
                this.currentWeek--;
                this.calendarData.selectedDate = this.month[this.currentWeek][0][0].toLocaleDateString('el-GR');
            }
            else if(direction > 0 && this.currentWeek < this.month.length-1){
                this.currentWeek++;
                this.calendarData.selectedDate = this.month[this.currentWeek][0][0].toLocaleDateString('el-GR');
            }
        },
        handleMonth(){
            this.dateError = false;
            this.dateBeforeError = false;
            this.scheduleSpanError = false;
            this.currentWeek = 0;
            this.inputMonth = this.calendarData.currentDate.getFullYear() + '-' + (this.calendarData.currentDate.getMonth()+1);
            this.getMonth();
            this.calendarData.selectedDate = this.month[this.currentWeek][0][0].toLocaleDateString('el-GR');
        },
        handleDay(){
            this.dateError = false;
            this.dateBeforeError = false;
            this.scheduleSpanError = false;
            let selected = this.calendarData.selectedDate.split('/');
            let dateSelected = new Date(selected[2],selected[1]-1,selected[0]);
            if(dateSelected < this.month[this.currentWeek][0][0]){
                this.currentWeek--;
                if(dateSelected < this.month[this.currentWeek][0][0]){
                    this.handleDay();
                }
            } else if(dateSelected > this.month[this.currentWeek][this.month[this.currentWeek].length-1][0]){
                this.currentWeek++;
                if(dateSelected > this.month[this.currentWeek][0][0]){
                    this.handleDay();
                }
            }
        },
        timeInput(){
            let config= {
                headers: { Authorization: `Bearer ${localStorage.token}` }
            };
            let fromInput = (parseInt(this.timeFrom.substring(0,2))*60) + parseInt(this.timeFrom.substring(3,5));
            let tillInput = (parseInt(this.timeTill.substring(0,2))*60) + parseInt(this.timeTill.substring(3,5));
            let dateInput = this.calendarData.selectedDate.split('/');
            dateInput = new Date(dateInput[2],dateInput[1]-1,dateInput[0]).setHours(0,0,0,0);
            if(!this.calendarData.selectedDate){
                this.dateError = true;
            }
            else if(dateInput < new Date().setHours(0,0,0,0)){
                this.dateBeforeError = true;
            }
            else if(this.timeFrom === "" || this.timeFrom.includes('HH') || this.timeFrom.includes('mm')){
                this.fromError = true;
            }
            else if(this.timeTill === "" || this.timeTill.includes('HH') || this.timeTill.includes('mm')){
                this.tillError = true;
            }
            else if (this.timeType === "default"){
                this.typeError = true;
            }
            else if (fromInput >= tillInput && this.timeFrom != "" && this.timeTill != ""){
                this.timeError = true;
            }
            else if (tillInput - fromInput < 30){
                this.timeSpanError = true;
            }
            else if ((dateInput < new Date(this.internFrom).setHours(0,0,0,0) || dateInput > new Date(this.internTill).setHours(0,0,0,0))){
                this.scheduleSpanError = true
            }
            else{
                let inputDate = this.calendarData.selectedDate.split('/');
                let timeData = {
                    date: inputDate[2]+'-'+inputDate[1]+'-'+inputDate[0],
                    time_from: fromInput,
                    time_to: tillInput,
                    type: this.timeType
                };
                let timeAvailable = false;
                for(let i = 0; i < this.month.length; i++){
                    for(let j = 0; j < this.month[i].length; j++){
                        if(this.month[i][j][0].toLocaleDateString('el-GR') === this.calendarData.selectedDate){
                            if(this.month[i][j].length > 1){
                                for(let k = 1; k < this.month[i][j].length; k++){
                                    if((this.month[i][j][k].time_from > tillInput) || (this.month[i][j][k].time_to < fromInput)){
                                        timeAvailable = true;
                                    }
                                    else {
                                        if(this.month[i][j][k].time_id != this.editID){
                                        this.unavailableError = true;
                                        timeAvailable = false;
                                        break;
                                        } else {
                                            timeAvailable = true;
                                        }
                                    }
                                }
                            } else {timeAvailable = true;}
                            if(timeAvailable){
                                
                                this.unavailableError = false;
                                this.timeError = false;
                                this.timeSpanError = false;
                                if(!this.timeEdit){
                                    axios.post('http://127.0.0.1:8000/api/time/'+this.id+'/'+this.scheduleData.trainee[0].schedules[this.scheduleID].id, timeData, config)
                                    .then(data => {
                                        this.tableReload = true;
                                        this.loadData();
                                    })
                                    .catch(error => {
                                        if(error.response.data.message == "Route [login] not defined."){
                                            router.push({name: 'Prisijungimas'});
                                        }
                                    });  
                                }else if(this.timeEdit){
                                    axios.put('http://127.0.0.1:8000/api/time/'+this.id+'/'+this.scheduleData.trainee[0].schedules[this.scheduleID].id+'/'+this.editID, timeData, config)
                                    .then(data => {
                                        this.editID = undefined;
                                        this.timeEdit = false;
                                        this.tableReload = true;
                                        this.loadData();
                                    })
                                    .catch(error => {
                                        if(error.response.data.message == "Route [login] not defined."){
                                            router.push({name: 'Prisijungimas'});
                                        }
                                    });  
                                }                         
                            }
                        }
                    }
                }
            }
        },
        editTime(item,date){
            this.timeEdit = true;
            this.calendarData.selectedDate = date.toLocaleDateString('el-GR');
            this.timeFrom = ('0'+Math.floor(item.time_from/60).toString()).slice(-2)+':'+('0'+(item.time_from%60).toString()).slice(-2);
            this.timeTill = ('0'+Math.floor(item.time_to/60).toString()).slice(-2)+':'+('0'+(item.time_to%60).toString()).slice(-2);
            this.timeType = item.type_of_time;
            this.editID = item.time_id;
        },
        cancelEditTime(){
            this.timeEdit = false;
            this.fromError = false;
            this.tillError = false;
            this.timeError = false;
            this.timeSpanError = false;
        },
        updateScheduleDates(){
            let oldFrom = this.scheduleData.trainee[0].schedules[this.scheduleID].start_date;
            let oldTill = this.scheduleData.trainee[0].schedules[this.scheduleID].end_date;
            if(this.internFrom !== oldFrom || this.internTill !== oldTill){
                let config= {
                headers: { Authorization: `Bearer ${localStorage.token}` },
                };
                let data= {
                    start_date: this.internFrom,
                    end_date: this.internTill
                };
                axios.put('http://127.0.0.1:8000/api/schedule/'+this.id+'/'+this.scheduleData.trainee[0].schedules[this.scheduleID].id, data, config)
                .then(data => {
                    this.tableReload = true;
                    this.loadData();
                })
                .catch(error => {
                    console.log(error.response.data.message);
                    if(error.response.data.message == "Route [login] not defined."){
                        router.push({name: 'Prisijungimas'});
                    }
                });                 
            }
        },
        downloadSchedule(){
            let config= {
                params: {
                firstname: this.traineeFname,
                lastname: this.traineeLname
                },
                headers: { Authorization: `Bearer ${localStorage.token}` },
                responseType: 'blob'
            };
            let getID = this.scheduleData.trainee[0].schedules[this.scheduleID].id;
            axios.get('http://127.0.0.1:8000/api/document/'+ this.id + '/' + getID,config)
            .then((response) => {
                var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                var fileLink = document.createElement('a');
                fileLink.href = fileURL;
                fileLink.setAttribute('download', this.traineeFname + ' ' +  this.traineeLname + ' tvarkaraštis.docx');
                document.body.appendChild(fileLink);
                fileLink.click();
            })
            .catch(error => {
                console.log(error.response.data.message);
                if(error.response.data.message == "Route [login] not defined."){
                    router.push({name: 'Prisijungimas'});
                }
            }); 
        }
    }
}
</script>

<style scoped lang="scss">
.generaldata_container{
    display: flex;
    padding: 1rem 0;
    height: 8rem;
    min-width: 1300px;
    margin: 0 4rem 0rem 22rem;
    justify-content: space-between;
    .data_text{
      margin-right: 1rem;
      padding: 1rem 0;
    }
    .data_text:last-child{
      margin:0;
    }
  }
.block_container{
     position: relative;
     display: flex;
     background-color: #ffffff;
     margin: 0 4rem 1rem 22rem;
     width: calc(100vw - 420px);
     height: calc(100vh - 9rem);
     min-width: 1300px;
     min-height: 770px;
     border-radius: 15px;

    .error{
        box-shadow: 0px 0px 4px 4px rgba(242,162,104,0.6) !important;
        border-radius: 5px !important;
    }

    .edit{
        box-shadow: 0px 0px 4px 4px rgba(0,84,166, 0.3)!important;
        border-radius: 5px !important;
    }

    .edit.error{
        box-shadow: 0px 0px 4px 4px rgba(242,162,104,0.6) !important;
    }

    .edit_disable{
        pointer-events: none;
        filter: opacity(50%);
    }

    .unselectable{
        -moz-user-select: -moz-none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
    }

    .input_error_message{
        position: absolute;
        color: #f3996fe5;
        font-family: 'Open Sans';
        font-size: 0.8rem;
        font-weight: 600;
        display: block;
        text-align: center;
        top:0;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
    }

    .top{
        margin-bottom: 15px;
    }

    .static{
        position: static!important;
        transform: none;
    }

    .schedule_back{
        top: 10px;
        position: absolute;
        font-family: 'Open Sans';
        font-size: 0.9rem;
        height: max-content;
        margin-left: 2rem;
        cursor: pointer;
        white-space: nowrap;
    }
    .schedule_back:hover{
        color: #0054a6;
    }

    .schedule_add{
        height: 3rem;
        width: 3rem;
        border-radius: 50%;
        background-color: #ffffff;
        border: 0;
        outline: none;
        box-shadow: 0px 0px 4px 4px rgba(0, 0, 0, 0.10);
        cursor:pointer;
    }
    .schedule_add:hover{
        box-shadow: 0px 0px 4px 4px rgba(0,84,166, 0.3);
    }

    .add_icon{
        width: 1.25rem;
        height: auto;
    }

    .input_container{
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 400px;
        height: 100%;
        border-radius: 15px;
        box-shadow: 3px 0px 5px -1px rgba(0, 0, 0, 0.10);

        .student_data_row{
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            padding: 0.5rem 1.5rem;
            .student_name_wrap{
            display: flex;
            flex-direction: row;
            justify-content: start;
            h1{
                font-family: 'Open Sans';
                font-size: 1.2rem;
                padding-left: 1rem;
                color: #5C5C5C;
                margin: auto 0;
            }
            .student_icon{
                width: 2.5rem;
            }
            }
        }
        .data_input_block{
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            padding: 0 1.5rem;
            font-family: 'Open Sans';

            label{
                margin-bottom: 0.35rem;
                margin-left: 0.5rem;
                font-size: 0.8rem;
            }

            input, select{
                outline: none;
                border: none;
                box-shadow: 0px 0px 4px 1px  rgba(0, 0, 0, 0.20);
                border-radius: 6px;
                padding: 0.3rem 0.5rem;
                color: #5C5C5C;
            }

            input::placeholder{
                color: #C4C4C4;
            }
            .schedule_select_wrap{
                margin: 0.5rem 0;
                select{
                    margin-top: 0.25rem;
                }
                .schedule_select{
                    width: 85%;
                }
            }
            .delete_icon{
                margin: 0 0 -0.35rem 0.8rem;
                width: 1.3rem;
                cursor: pointer;
            }
            .delete_icon:hover{
                content:url("../assets/delete_active.svg");
            }
            .delete_icon.one{
                width: 1.7rem;
            }
            .data_date_row{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            }
            .date_input_wrap{
                display: flex;
                flex-direction: column;
                width: 45%;
                margin-bottom: 0.8rem;
            }

            .intern_span{
                margin-bottom: 5%;
            }
            .lower_input_column{
                position: relative;
                display: flex;
                flex-direction: column;
                margin-top: 0.5rem;
                padding-top: 1.5rem;
            }
            .schedule_data_input{
                display: block;
                font-family: "Oswald";
                background-color:#0054a6;
                color: #f2f2f2;
                font-size: 0.9rem;
                margin: 1.5rem auto 0.5rem auto;
                padding: 0.3rem 1.5rem;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            .edit_button_wrap{
                display: flex;
                justify-content: center;
                input{
                    margin: 1.5rem 0.5rem 0.5rem 0.5rem;
                }
            }
        }
    }
    .option_wrap{
        display: flex;
        flex-direction: column;
        align-self: center;
        margin: auto;
        h1{
            color: #5C5C5C;
            text-align: center;
            font-family: 'Oswald';
            font-weight: 400;
            margin: 2rem 0;
            text-transform: uppercase;
        }
        form{
            font-family: 'Open Sans';
            width: 75%;
            display: flex;
            align-self: center;
            flex-direction: column;
            justify-content: center;

            input, select{
                color: #5C5C5C;
                outline: none;
                border: none;
                font-size: 1.2rem;
                box-shadow: 0px 0px 4px 1px  rgba(0, 0, 0, 0.20);
                border-radius: 6px;
                padding: 0.5rem 0.8rem;
                margin-bottom: 1.5rem;
            }
            label{
                color: #5C5C5C;
                margin: 0 0 0.5rem 0.5rem;
                font-size: 1rem;
            }
            .option_submit{
                display: block;
                font-family: "Oswald";
                background-color:#0054a6;
                color: #f2f2f2;
                font-size: 1.2rem;
                margin: 1.2rem auto;
                padding: 0.3rem 1.5rem;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
        }
    }
    .schedule_container{
        width: calc(100% - 400px);
        float: right;

        .shcedule_control_container{
            display: flex;
            width: 100%;
            height: 15%;
            font-family: 'Open Sans';

            .schedule_download{
                width: 4rem;
                margin: 1.5rem 0 0 4%;
                cursor: pointer;
            }
            .schedule_download:hover{
                content: url("../assets/download_active.svg");
            }
            .schedule_controls{
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 75%;

                .schedule_date_push{
                    margin: 1.5rem auto;

                    .selected_date{
                        padding: 0 0.5rem;
                        font-weight: 600;
                        color: #5C5C5C;

                        .date_dash{
                            color: #C4C4C4;
                        }
                    }
                    .date_push_button{
                        background: #ffffff;
                        color: #C4C4C4;
                        border: 1px solid #C4C4C4;
                        border-radius: 3px;
                        padding: 0.25rem 0.45rem;
                        outline: none;
                        cursor: pointer;
                    }
                    .date_push_button:hover{
                        color:#0054A6;
                        border-color: #0054A6;
                    }
                }

                .disabled{
                    button, span{
                    color: #efefef !important;
                    cursor: default !important;
                    }
                    button{
                        border-color: #efefef !important;
                    }
                }

                .push_disabled{
                    color: #efefef !important;
                    border-color: #efefef !important;
                    cursor: default !important;
                }

                .schedule_span_select{
                    margin: 0 auto;
                    
                    .schedule_span_button{
                        background: #ffffff;
                        color: #5C5C5C;
                        border: 1px solid #C4C4C4;
                        border-radius: 6px;
                        outline: none;
                        padding: 0.35rem 1rem;
                        margin: 0 0.2rem;
                        cursor: pointer;
                    }

                    .schedule_span_button:hover{
                        border-color: #0054A6;
                    }

                    .selected{
                        background: #0054A6;
                        color: #ffffff;
                        border: none;
                    }
                }
            }
            .schedule_colors{
                display: flex;
                flex-direction: column;
                justify-content: center;
                text-align: right;
                font-size: 0.7rem;
                color: #5C5C5C;
                height: max-content;
                padding: 3% 4% 3% 0;
                margin: auto 0 auto auto;

                span{
                    margin-bottom: 0.6rem;
                }

                .color_cube{
                    display: inline-block;
                    width: 0.8rem;
                    height: 0.8rem;
                    border-radius: 3px;
                    margin-left: 0.5rem;
                }
                                    
                    .intern{
                        background-color: #0054A6;
                    }
                    .free{
                        background-color: #5C5C5C;
                    }
                    .lecture{
                        background-color: #C4C4C4;
                    }
                    .break{
                        background-color: #efefef;
                    }

            }
        }
    }
}
.middle{
    height: 90vh;
    position: absolute;
    top:50%;
    transform: translateY(-50%);
}
</style>

<style lang="scss">
.vfc-main-container{
            box-shadow: none !important;
            padding: 0 0.3rem;
            font-family: 'Open Sans' !important;
            z-index: 98;
            .vfc-callendar, .vfc-content{
                margin-bottom: 0 !important;
            }
            .vfc-top-date{
                 font-size: 1rem;
                 font-weight: 600;
                 margin: 1rem;
                 span{
                  color: #5C5C5C;
                 }
            }   
            .vfc-cursor-pointer{
                height: max-content;
                margin: 0.8rem 15%;
                .vfc-arrow-left, .vfc-arrow-right{
                width: 8px;
                height: 8px;
                }
            }
            .vfc-day:last-child, .vfc-day:nth-last-child(2){
                color: #c4c4c4 !important;
                pointer-events: none;
            }
            .vfc-dayNames span{
                font-weight: 600;
                color: #5C5C5C;
            }
            .vfc-week .vfc-day span.vfc-span-day{
                border-radius: 5px;
            }
            .vfc-week .vfc-day span.vfc-span-day.vfc-today {
                background-color: #C4C4C4;
                border-radius: 5px;
            }
            .vfc-marked{
                background-color: #0054A6 !important;
            }
        }
</style>