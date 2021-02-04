<template>
<div>
  <div class="generaldata_container">
        <generaldata class="data_text" v-bind:data="studentList.length">PRAKTIKANTŲ</generaldata>
        <generaldata class="data_text" v-bind:data="this.internSum">SUPLANUOTŲ PRAKTIKOS VALANDŲ</generaldata>
        <generaldata class="data_text" v-bind:data="this.attendedSum">ATLIKTŲ PRAKTIKOS VALANDŲ</generaldata>
        <generaldata class="data_text" v-bind:data="this.offSum">LAISVŲ VALANDŲ</generaldata>
  </div>
  <div class="main_container">
      <div class="table_controls">
         <label class="switch">
             <input type="checkbox" v-model="offMode">
             <span class="slider">
                 <span class="option1">PRAKTIKA</span>
                 <span class="option2">LAISVOS</span>
             </span>
          </label>
          <div class="dropdown_wrap">
            <div class="filter timespan"  @click="triggerTimespan()">
                    <h1>{{monthName[monthInd]}}</h1><img class="filter_trigger" src="../assets/tick.svg" alt="">
            </div>
            <div class="filter_input_wrap timespan" v-if="timespanState">
                <label for="StartDate">Pasirinkti mėnesį:</label>
                <input id="StartDate" type="month" v-model="inputMonth" @change="getMonth()">
            </div>
          </div>
          <input type="text" class="statistics_searchbar">
          <div class="dropdown_wrap">
            <div class="filter data" @click="triggerFilter()">
                <h1>FILTRUOTI </h1><img class="filter_trigger" src="../assets/tick.svg" alt="">
            </div>
                <div class="filter_input_wrap data" v-if="filterState">
                    <label for="StartDate">Pradžios data:</label>
                    <input id="StartDate" type="date">
                    <label for="EndDate">Pabaigos data:</label>
                    <input id="EndDate" type="date">
          </div>
        </div>
      </div>
      <div class="table_container">
          <table>
              <!-- <tr class="table_header">
                <th class="table_student">{{monthName[monthInd]}}</th>
                <div v-for="(week, index) in month" :key="index" :class="'table_week ' + index">
                      <th v-for="day in week" :key="day.date.getDate()" :class="'table_day_name ' + day.date.getDate()">{{dayName[day.date.getDay()]}}</th>
                      <th class="column_sum"></th>
                </div>
                <th class="table_top month"></th>
              </tr> -->
              <tr>
                <th class="table_student head">PRAKTIKANTAS</th>
                <div v-for="(week, index) in month" :key="index" :class="'table_week ' + index">
                    <th v-for="day in week" :key="day.date.getDate()" :class="'table_top ' + day.date.getDate()">{{day.date.getDate()}}</th>
                    <th class="table_top sum">SAV</th>
                </div>
                <div class="table_week">
                <th class="table_top month">MĖN</th>
                </div>
              </tr>
              <tr v-for="(student,index) in studentList" :key="index" @mouseover="hover=index" @mouseleave="hover='out'">
                <th class="table_student" @click="routeSchedule(student.id)" v-bind:class="{blue: hover==index && hover!='out'}">{{student.firstname}} {{student.lastname}}</th>
                <div class="table_week_wrap">
                <div v-for="(week, index) in month" :key="index" :class="'table_week ' + index">
                  <td v-for="day in week" :key="day.date.getDate()" 
                  :class="['table_cell ' + day.date.getDate(),{ grey : (!offMode && day.hours[student.id].intern_hours == 0) || (offMode && day.hours[student.id].off_hours == 0)}]">
                  <span v-if="!offMode">{{day.hours[student.id].intern_hours}}</span><span v-if="offMode">{{day.hours[student.id].off_hours}}</span>
                  </td>
                  <td class="table_sum" v-bind:class="{grey: weekSum(week,student.id) == 0}">{{weekSum(week,student.id)}}</td>
                </div>
                <div class='table_week'>
                <td class="table_cell month">
                    <span v-if="!offMode">{{monthInternSum[index]}}</span><span v-if="offMode">{{monthOffSum[index]}}</span>
                </td>
                </div>
                </div>
              </tr>
          </table>
      </div>
  </div>
</div>
</template>

<script>
import Generaldata from '../components/StatisticsDataBlock.vue'
import axios from 'axios'
export default {
    components: {Generaldata},
    data () {
      return {
        timespanState: false,
        filterState: false,
        offMode: false,
        internSum: 0,
        attendedSum: 0,
        offSum: 0,
        overSum: 0,
        inputMonth: '',
        monthInd: 0,
        monthInternSum: [],
        monthOffSum: [],
        dayName: ['Sk','Pr','An','Tr','Kt','Pn','Št'],
        monthName: ['SAUSIS','VASARIS','KOVAS','BALANDIS','GEGUŽĖ','BIRŽELIS',
                    'LIEPA','RUGPJŪTIS','RUGSĖJIS','SPALIS','LAPKRITIS','GRUODIS'],
        days: [],
        month: [],
        studentList: [],
        hover: 'out',
        config: {
            headers: { Authorization: `Bearer ${localStorage.token}` }
        }
        }
    },
    created() {
        this.interval = setInterval(() => this.refreshToken(), 300000);
    },
    watch:{
        inputMonth: function() {
            this.monthInd = new Date(this.inputMonth).getMonth();
        }
    },
    mounted() {
        let date = new Date();
        this.inputMonth = date.getFullYear() + '-' + (date.getMonth()+1);
        this.getStudents();
    },
    beforeDestroy(){
            clearInterval(this.interval);
    },
    methods: {
        triggerFilter(){
            if(this.filterState)
            this.filterState = false;
            else this.filterState = true;
        },
        triggerTimespan(){
            if(this.timespanState)
            this.timespanState = false;
            else this.timespanState = true;
        },
        getMonth(){
            this.days=[];
            this.month=[];
            this.internSum = 0;
            this.attendedSum = 0;
            this.offSum = 0;
            this.overSum = 0;
            let input = this.inputMonth.split('-');
            let year = input[0];
            let month = input[1]-1;
            let hours = {};
            let internHours = 0;
            let offHours = 0;
            let overHours = 0;
            var date = new Date(year, month, 1);
            var firstCut = 0;
            while (date.getMonth() === month) {
                for(let i = 0; i < this.studentList.length; i++){
                    for(let j=0; j < this.studentList[i].schedules.length; j++){
                        for(let n=0; n < this.studentList[i].schedules[j].months.length; n++){
                            if(this.studentList[i].schedules[j].months[n].index == input[1]){
                                for(let k=0; k < this.studentList[i].schedules[j].months[n].days.length; k++){
                                    if(this.studentList[i].schedules[j].months[n].days[k].index == date.getDate()){
                                    internHours = internHours + Math.round(this.studentList[i].schedules[j].months[n].days[k].statistics_hours.intern_hours/60);
                                    this.internSum = this.internSum + internHours;
                                    if(date.setHours(0,0,0) <= new Date().setHours(0,0,0)){
                                        this.attendedSum = this.attendedSum + internHours;
                                    }
                                    offHours = offHours + Math.round(this.studentList[i].schedules[j].months[n].days[k].statistics_hours.off_time_hours/60);
                                    this.offSum = this.offSum + offHours;
                                    overHours = overHours + Math.round(this.studentList[i].schedules[j].months[n].days[k].statistics_hours.over_time_hours/60);
                                    this.overSum = this.overSum + overHours;
                                    }
                                }
                            }
                        }
                    }
                    hours[this.studentList[i].id] = {intern_hours : internHours, off_hours : offHours, over_hours : overHours}
                    if(this.monthInternSum[i]){
                        this.monthInternSum[i] = this.monthInternSum[i] + internHours;
                    } else {
                        this.monthInternSum[i] = internHours
                    }
                    if(this.monthOffSum[i]){
                        this.monthOffSum[i] = this.monthOffSum[i] + offHours;
                    } else {
                        this.monthOffSum[i] = offHours
                    }
                    internHours = 0;
                    offHours = 0;
                    overHours = 0;
                }
                this.days.push({date: new Date(date), hours});
                date.setDate(date.getDate() + 1);
                hours = {};
            }
            if(this.days[firstCut].date.getDay() === 0)
            this.days.splice(0, 1);
            else if (this.days[firstCut].date.getDay() === 6)
            this.days.splice(0,2);
            while(this.days[firstCut].date.getDay() != 6){
                firstCut++;
            }
            this.month.push(this.days.splice(0, firstCut));
            this.days.splice(0, 2);
            while(this.days.length){
                this.month.push(this.days.splice(0, 5));
                this.days.splice(0, 2);
            }
        },
         getStudents(){
            axios.get('http://127.0.0.1:8000/api/trainee',this.config)
                .then((resp) => {
                    this.studentList = resp.data.trainees;
                    this.getMonth();
                })
                .catch(error => {
                    if(error.response.data.message == "Route [login] not defined."){
                        if(this.$route.name != 'Prisijungimas'){
                        this.$router.push({name: 'Prisijungimas'});
                        }
                    }
                });
        },
        weekSum(week, id){
            let sum = 0;
            for(let i = 0; i < week.length; i++){
                if(this.offMode){
                    sum = sum + week[i].hours[id].off_hours;
                } else {
                    sum = sum + week[i].hours[id].intern_hours
                }
            }
            return sum;
        },
        routeSchedule(id){
            this.$router.push({name: 'Tvarkarastis', params: {id: id}});
        },
        refreshToken(){
            let config= {
                headers: { Authorization: `Bearer ${localStorage.token}` }
            };
            axios.post('http://127.0.0.1:8000/api/auth/refresh','',config)
            .then((resp) => {
                console.log('refresh');
                localStorage.token = resp.data.access_token;
            })
            .catch(error => {
                if(error.response.data.message == "Route [login] not defined."){
                    this.$router.push({name: 'Prisijungimas'});
                }
            });
        }
    }
}
</script>

<style scoped lang="scss">
.generaldata_container{
  display: flex;
  padding: 1.5rem 0;
  min-width: 1300px;
  height: 9rem;
  margin: 0 1% 0 20rem;
  justify-content: space-between;
}
.main_container{
    height: max-content;
    min-width: 1300px;
    min-height: 770px;
    font-family: 'Open Sans';
    margin: 0 1% 1% 20rem;
    background-color: #ffffff;
    border-radius: 15px;

    .blue{
        color: #0054A6;
        font-weight: 600!important;
    }

    .grey{
        color: #c4c4c4!important;
   }

    .table_controls{
        display: flex;
        height: 20%;
        width: 100%;
        justify-content: space-between;
        padding: 3rem 7% 1rem 7%;

    .switch {
        position: relative;
        display: inline-block;
        width: 14rem;
        margin: auto 0;
        height: 3.5rem;
    }

    .switch input {
    opacity: 0;
    width: 0;
    height: 0;
    }

    .slider {
        display: flex;
        justify-content: space-between;
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ffffff;
        box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.10);
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 10px;

        .option1, .option2{
            position: absolute;
            color: #5c5c5c;
            width: 50%;
            font-weight: 600;
            top: 50%;
            padding: 0 8%;
            -ms-transform: translateY(-50%);
            transform: translateY(-50%);
            }
                .option2{
                    left: 52%;
                }
        }

        .slider:before {
            position: absolute;
            content: "";
            width: 50%;
            height: 100%;
            left: 0;
            bottom: 0;
            border-radius: 10px;
            background-color: #0054A6;
            -webkit-transition: .4s;
            transition: .4s;
        }

        input:checked + .slider .option2 {
            color: #ffffff;
            -webkit-transition: .4s;
            transition: .4s;
        }
        input:checked + .slider .option1 {
            color:  #5c5c5c;
            -webkit-transition: .4s;
            transition: .4s;
        }

        input:not(:checked) + .slider .option1 {
            color: #ffffff;
            -webkit-transition: .4s;
            transition: .4s;
        }

        input:checked + .slider:before {
            -webkit-transform: translateX(100%);
            -ms-transform: translateX(100%);
            transform: translateX(100%);
        }
        .statistics_searchbar{
            font-size: 1.5rem;
            color: #5c5c5c;
            padding: 1rem;
            width: 30%;
            height: 3.5rem;
            border: none;
            outline: none;
            margin-top: auto;
            margin-bottom: auto;
            background: url(../assets/search.svg) no-repeat 96% 52%;
            border-radius: 8px;
            box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.10);
        }
        .statistics_searchbar:focus{
            box-shadow: 0px 0px 4px 4px rgba(0,84,166, 0.3);
        }
        .dropdown_wrap{
            display: flex;
            flex-direction: column;
            height: 3.5rem;
            margin: auto 0;
        }
        .filter{
            display: inline-block;
            padding: 0.8rem 2.5rem;
            height: 3.5rem;
            background-color: #ffffff;
            border-radius: 8px;
            margin-top: auto;
            margin-bottom: auto;
            box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.10);
            cursor: pointer;
            h1{
                display: inline-block;
                font-size: 1.25rem;
                height: 100%;
                color: #5c5c5c;
                width: 80%;
            }     
            .filter_trigger{
                width: 0.7rem;
                margin-left: 11%;
                -ms-transform: translateY(-20%);
                transform: translateY(-20%);
            } 
        }
       .timespan{
            width: 15rem;
        }
        .data{
            width: 13.5rem;
        }
        .active{
            -ms-transform: scaleY(-1) translateY(-13%);
            transform: scaleY(-1) translateY(-13%);
        }
        .filter_input_wrap{
            position: absolute;
            display: flex;
            flex-direction: column;
            margin-top: 4.5rem;
            padding: 1rem 1rem;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.10);
            z-index: 99;
            label{
                color:#c4c4c4;
            }
            input{
                color:#5c5c5c;
                font-size: 1.3rem;
                padding-top: 0.3rem;
                outline: none;
                border: none;
                border-radius: 3px;
                margin-bottom: 0.5rem;
            }          
        }
    }
    .table_container{
        display: flex;
        width: 100%;
        padding: 3rem 2rem;
        justify-content: center;
        overflow-x: auto;
        table{
            color: #5c5c5c;
            font-size: 0.9rem;
            border-collapse: collapse;
            width:90%;
            tr{
                display: flex;
                width: 100%;
                white-space: nowrap;
                justify-content: row;
            }
            th, td{
                font-weight: 600;
                width: 2.2vw;
                min-width: 2.5rem;
                text-align: center;
                border-right: solid 3px #efefef;
                border-bottom: solid 1px #c4c4c4;
                vertical-align: middle;
            }
            .table_sum{
                color: #0054A6;
                background-color: #efefef;
            }
            tr:last-child{
                border-bottom: solid 3px #efefef;
            }
            tr:last-child td, tr:last-child th{
                border-bottom: none;
            }
            .table_student{
                border-left: solid 3px #efefef;
            }
            .table_cell, .table_top{
                vertical-align: middle;
                height: 2rem;
            }
            .table_top{
                border: solid 3px #efefef;
                border-left: none;
            }
            .table_week{
                display: table-cell;
                height: 100%;
            }
            .table_week_wrap{
                position: relative;
            }
            .table_week_wrap:hover{
                // border-bottom: #0054A6 solid 2px;
                // box-shadow: 0px -3px 0px #0054A6 inset, 0px 3px 0px #0054A6 inset;
                background-color: #0054A6;
                color: #ffffff;
                // border-top: #0054A6 solid 2px;
                // left: -3px;
            }
            // .table_week_wrap:hover .table_week:first-child{
            //     // border-left:#0054A6 solid 2px;
            //     // box-shadow: 3px 0px 0px #0054A6 inset;
            // }
            // .table_week_wrap:hover .table_week:last-child td{
            //     // border-right:#0054A6 solid 2px;
            //     // box-shadow: 0px 0px 3px #0054A6 inset;
            // }
            .table_student{
                white-space: nowrap;
                padding: 0.2rem 0.5rem;
                min-width: 12rem;
                font-weight: 400;
                border-bottom: none;
                border-top: none;
                flex-grow: 1;
                cursor: pointer;
            }
            .head{
                border-top: solid 3px #efefef;
                border-bottom: solid 3px #efefef;
                font-weight: 600;
                cursor: default;
            }
            .table_header .month{
                padding: 0 3px;
                background-color: transparent;
                flex: 0;
            }
            .table_header th, .table_header td{
                font-weight: 400;
                color: #c4c4c4;
                border:none;
                padding-bottom: 0.2rem;
                width: 2.2vw;
            }
            .table_header .table_week{
                padding-right: 3px;
                flex: 10%;
            }
            .column_sum{
                width: 2.1vw;
            }
            .month{
                color: #ffffff;
                background-color: #2e5c8a;
                width: 2.3vw;
                border-right: solid 3px #efefef;
            }
        }
    }
}
</style>