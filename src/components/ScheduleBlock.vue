<template>
  <div class="block_container">
      <div class="input_container">
          <div class="student_data_row">
            <img class="student_icon" src="../assets/student.svg" alt="Student icon">
            <h1 class="student_name">Vardenis Pavardenis</h1>
          </div>
          <div class="data_input_block">
            <form class="data_input_form" @submit.prevent="timeInput()">
              <div class="data_date_row intern_span">
                  <div class="date_input_wrap">
                      <label for="">Sutartis nuo</label>
                      <input class="student_date_from" type="date">
                  </div>
                  <div class="date_input_wrap">
                      <label for="">Sutartis iki</label>
                      <input class="student_date_till" type="date">
                  </div>
          </div>
          <div>
          <FunctionalCalendar ref="Calendar" v-model="calendarData" v-on:changedMonth="handleMonth" v-on:choseDay="handleDay" :configs="calendarConfigs" v-bind:class="{ error: dateError }"></FunctionalCalendar>
          <span class="input_error_message" v-if="dateError">Pasirinkite norimą datą</span>
          </div>
              <div class="lower_input_column">
                  <span class="input_error_message top" v-if="unavailableError">Šis laikas yra užimtas</span>
                  <span class="input_error_message top" v-if="timeError">Įvestas netinkamas laikas</span>
                  <div class="data_date_row">
                  <div class="date_input_wrap">
                  <label for="student_time_from">Laikas nuo</label>
                  <VueTimepicker name="student_time_from" :hour-range="[8, 9, 10, 11, 12, 13, 14, 15, 16, 17]" :minute-interval="30" hide-disabled-hours v-model="timeFrom" v-bind:class="{ error: fromError }"></VueTimepicker>
                  </div>
                  <div class="date_input_wrap">
                  <label for="student_time_till">Laikas iki</label>
                  <VueTimepicker name="student_time_till" :hour-range="[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]" :minute-interval="30" hide-disabled-hours v-model="timeTill" v-bind:class="{ error: tillError }"></VueTimepicker>
                  </div>
                  </div>
                  <label for="student_type">Tipas</label>
                  <select class="student_type" type="time" v-model="timeType" v-bind:class="{ error: typeError }">
                  <option value="default" selected hidden>Pasirinkti tipą</option>
                  <option value="internship">Praktika</option>
                  <option value="lecture">Paskaita</option>
                  <option value="off-time">Laisvos</option>
                  <option value="break">Pertrauka</option>
              </select>
              </div>
              <input class="schedule_data_input" type="submit" value="ĮRAŠYTI">
            </form>
          </div>
      </div>
      <div class="schedule_container" v-if="month.length">
          <div class="shcedule_control_container">
              <div class="schedule_controls">
                <div class="schedule_date_push" v-bind:class="{ disabled: monthState }">
                    <button class="date_push_button" :disabled="monthState" @click="pushWeek(-1)">&lt;</button>
                    <span class="selected_date">{{month[currentWeek][0][0].getMonth()+1}}<span class="date_dash">/</span>{{month[currentWeek][0][0].getDate()}} - {{month[currentWeek][4][0].getMonth()+1}}<span class="date_dash">/</span>{{month[currentWeek][4][0].getDate()}}</span>
                    <button class="date_push_button" :disabled="monthState" @click="pushWeek(1)">&gt;</button>
                </div>
                <div class="schedule_span_select">
                    <button class="schedule_span_button" v-bind:class="{ selected: weekState }" @click="monthState=false; weekState=true">Savaitė</button>
                    <button class="schedule_span_button" v-bind:class="{ selected: monthState }" @click="monthState=true; weekState=false">Mėnuo</button>
                </div>
              </div>
              <div class="schedule_colors">
                  <span>Praktika <div class="color_cube intern"></div></span>
                  <span>Laisvos <div class="color_cube free"></div></span>
                  <span>Paskaita <div class="color_cube lecture"></div></span>
                  <span>Pertrauka <div class="color_cube break"></div></span>
              </div>
          </div>
          <WeekTable v-if="weekState" v-bind:array="month[currentWeek]"></WeekTable>
          <MonthTable v-if="monthState" v-bind:array="month" v-bind:month="calendarData.currentDate.getMonth()"></MonthTable>
      </div>
  </div>
</template>

<script>
import Vue from 'vue';
 import axios from 'axios';
import WeekTable from '../components/WeeklyTable.vue';
import MonthTable from '../components/MonthlyTable.vue';
import FunctionalCalendar from 'vue-functional-calendar';
import VueTimepicker from 'vue2-timepicker'
import 'vue2-timepicker/dist/VueTimepicker.css'

Vue.use(FunctionalCalendar, {
    dayNames: ['Pr', 'An', 'Tr', 'Kt', 'Pn', 'Št', 'Sk'],
    monthNames: ["SAUSIS", "VASARIS", "KOVAS", "BALANDIS", "GEGUŽĖ", "BIRŽELIS",
     "LIEPA","RUGPJŪTIS", "RUGSĖJIS", "SPALIS", "LAPKRITIS", "GRUODIS"]
});
export default {
    components: {WeekTable, MonthTable, VueTimepicker},
    data () {
      return {
        timespanState: false,
        filterState: false,
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
        dateError: false,
        typeError: false,
        fromError: false,
        timeError: false,
        tillError: false,
        unavailableError: false,
        config: {
            headers: {
                Authorization: localStorage.token
            }
        },
        }
    },
    mounted(){
        this.inputMonth = this.calendarData.currentDate.getFullYear() + '-' + (this.calendarData.currentDate.getMonth()+1);
        this.getMonth();
        this.calendarData.selectedDate = this.month[this.currentWeek][0][0].toLocaleDateString('el-GR');
    },
    watch: {
    timeFrom: function() {
          if(this.timeFrom != ""){
              this.fromError = false;
          }
          if(this.unavailableError){
              this.unavailableError = false;
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
        if(this.timeError){
            this.timeError = false;
        }
    },
    timeType: function() {
        if(this.timeType != "default"){
              this.typeError = false;
        }
    }
    },
    methods: {
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
                date.setDate(date.getDate() + 1);
            }
            if (this.days[0][0].getDay() > 1)
            {
                let add = new Date(year, month, 0);
                while(this.days[0][0].getDay() != 1)
                {
                    this.days.unshift([new Date(add)]);
                    add.setDate(add.getDate() - 1);
                }
            }
            if (this.days[this.days.length-1][0].getDay() != 0){
                let add = new Date(year, month+1, 1);
                while(this.days[this.days.length-1][0].getDay() != 0)
                {
                    this.days.push([new Date(add)]);
                    add.setDate(add.getDate() + 1);
                }
            }
            while(this.days.length){
                this.month.push(this.days.splice(0, 5));
                this.days.splice(0,2);
            }
        },
        pushWeek(direction){
            if(direction < 0 && this.currentWeek > 0){
                this.currentWeek--;
                this.calendarData.selectedDate = this.month[this.currentWeek][0][0].toLocaleDateString('el-GR');
            }
            else if(direction > 0 && this.currentWeek < 4){
                this.currentWeek++;
                this.calendarData.selectedDate = this.month[this.currentWeek][0][0].toLocaleDateString('el-GR');
            }
        },
        handleMonth(){
            this.inputMonth = this.calendarData.currentDate.getFullYear() + '-' + (this.calendarData.currentDate.getMonth()+1);
            this.getMonth();
            this.currentWeek = 0;
            this.calendarData.selectedDate = this.month[this.currentWeek][0][0].toLocaleDateString('el-GR');
        },
        handleDay(){
            this.dateError = false;
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
            if(!this.calendarData.selectedDate){
                this.dateError = true;
            }
            if(this.timeFrom === "" || this.timeFrom.includes('HH') || this.timeFrom.includes('mm')){
                this.fromError = true;
            }
            if(this.timeTill === "" || this.timeTill.includes('HH') || this.timeTill.includes('mm')){
                this.tillError = true;
            }
            if (this.timeType === "default"){
                this.typeError = true;
            }
            if (this.timeFrom >= this.timeTill && this.timeFrom != "" && this.timeTill != ""){
                this.timeError = true;
            }
            if(!this.dateError && !this.fromError && !this.tillError && !this.typeError && !this.timeError){
                let timeData = [
                    this.timeType,
                    this.timeFrom,
                    this.timeTill,
                ]
                let timeAvailable = false;
                for(let i = 0; i < this.month.length; i++){
                    for(let j = 0; j < this.month[i].length; j++){
                        if(this.month[i][j][0].toLocaleDateString('el-GR') === this.calendarData.selectedDate){
                            if(this.month[i][j].length > 1){
                                for(let k = 1; k < this.month[i][j].length; k++){
                                    if((this.month[i][j][k][1] >= this.timeTill) || (this.month[i][j][k][2] <= this.timeFrom)){
                                        timeAvailable = true;
                                    }
                                    else {
                                        this.unavailableError = true;
                                        timeAvailable = false;
                                        break;
                                    }
                                }
                            } else {timeAvailable = true;}
                            if(timeAvailable){
                                this.month[i][j].push(timeData);
                            }
                        }
                    }
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
.block_container{
     display: flex;
     background-color: #ffffff;
     margin: 0 4rem 1% 22rem;
     height: 80%;
     min-width: 1300px;
     min-height: 700px;
     border-radius: 15px;

    .error{
        border: solid 2px #F2A268 !important;
        border-radius: 5px !important;
    }

    .input_error_message{
        color: #F2A268;
        font-family: 'Open Sans';
        font-size: 0.8rem;
        font-weight: 600;
        display: block;
        text-align: center;
        margin-top: 0.3rem;
        white-space: nowrap;
    }

    .top{
        margin-bottom: 15px;
    }

    .input_container{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        width: 25%;
        height: 100%;
        border-radius: 15px;
        box-shadow: 3px 0px 5px -1px rgba(0, 0, 0, 0.10);

        .student_data_row{
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
            padding: 1.5rem 0.5rem 0.5rem 0.5rem;
            h1{
                font-family: 'Open Sans';
                font-size: 1.2rem;
                color: #5C5C5C;
                margin: auto 0;
            }
            .student_icon{
                width: 2.5rem;
            }
        }
        .data_input_block{
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            padding: 0 1.5rem;
            font-family: 'Open Sans';

            label{
                margin-bottom: 0.25rem;
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
                display: flex;
                flex-direction: column;
            }
            .schedule_data_input{
                display: block;
                font-family: "Oswald";
                background-color:#0054a6;
                color: #f2f2f2;
                font-size: 0.9rem;
                margin: 1rem auto;
                padding: 0.3rem 1.5rem;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
        }
    }
    .schedule_container{
        width: 75%;
        float: right;

        .shcedule_control_container{
            display: flex;
            width: 100%;
            height: 15%;
            font-family: 'Open Sans';

            .schedule_controls{
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 85%;

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