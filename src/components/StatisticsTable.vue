<template>
  <div class="main_container">
      <div class="table_controls">
         <label class="switch">
             <input type="checkbox">
             <span class="slider">
                 <span class="option1">PRAKTIKA</span>
                 <span class="option2">LAISVOS</span>
             </span>
          </label>
          <div class="dropdown_wrap">
            <div class="filter timespan"  @click="triggerTimespan()">
                    <h1>LAIKOTARPIS</h1><img class="filter_trigger" src="../assets/tick.svg" alt="">
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
              <tr class="table_header">
                <th class="table_student"></th>
                <div v-for="(week, index) in month" :key="index" :class="'table_week ' + index">
                      <th v-for="day in week" :key="day.getDate()" :class="'table_day_name ' + day.getDate()">{{dayName[day.getDay()]}}</th>
                      <th class="column_sum"></th>
                </div>
              </tr>
              <tr>
                <th class="table_student head">PRAKTIKANTAS</th>
                <div v-for="(week, index) in month" :key="index" :class="'table_week ' + index">
                    <th v-for="day in week" :key="day.getDate()" :class="'table_top ' + day.getDate()">{{day.getDate()}}</th>
                    <th class="table_top sum">SAV</th>
                </div>
                <div class="table_week">
                <th class="table_top month">MĖN</th>
                </div>
              </tr>
              <tr v-for="index in 10" :key="index">
                <th class="table_student">Vardenis Pavardenis</th>
                <div class="table_week_wrap">
                <div v-for="(week, index) in month" :key="index" :class="'table_week ' + index">
                  <td v-for="day in week" :key="day.getDate()" :class="'table_cell ' + day.getDate()">0</td>
                  <td class="table_sum"> </td>
                </div>
                <div class='table_week'>
                <td class="table_cell month">100</td>
                </div>
                </div>
              </tr>
          </table>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    data () {
      return {
        timespanState: false,
        filterState: false,
        inputMonth: '',
        dayName: ['Sk','Pr','An','Tr','Kt','Pn','Št'],
        days: [],
        month: [],
        studentList: [],
        }
    },
    created() {
        this.interval = setInterval(() => this.refreshToken(), 300000);
    },
    mounted() {
        let date = new Date();
        this.inputMonth = date.getFullYear() + '-' + (date.getMonth()+1);
        this.getMonth();
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
            let input = this.inputMonth.split('-');
            console.log(input[0]);
            console.log(input[1]);
            let year = input[0];
            let month = input[1]-1;
            var date = new Date(year, month, 1);
            var firstCut = 0;
            while (date.getMonth() === month) {
                this.days.push(new Date(date));
                date.setDate(date.getDate() + 1);
            }
            if(this.days[firstCut].getDay() === 0)
            this.days.splice(0, 1);
            else if (this.days[firstCut].getDay() === 6)
            this.days.splice(0,2);
            while(this.days[firstCut].getDay() != 6){
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
            console.log("students loading");
            //API GET
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
.main_container{
    height: 70%;
    width: 78%;
    font-family: 'Open Sans';
    margin: 0 4rem 1% 22rem;
    background-color: #ffffff;
    border-radius: 15px;
    .table_controls{
        display: flex;
        height: 20%;
        width: 100%;
        justify-content: space-between;
        padding: 4rem 7%;

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
            width: 18rem;
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
            tr{
                display: flex;
                white-space: nowrap;
            }
            th, td{
                font-weight: 600;
                width: 2vw;
                min-width: 2rem;
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
                border-bottom: #0054A6 solid 3px;
                border-top: #0054A6 solid 3px;
                left: -3px;
            }
            .table_week_wrap:hover .table_week:first-child{
                border-left:#0054A6 solid 3px;
            }
            .table_week_wrap:hover .table_week:last-child td{
                border-right:#0054A6 solid 3px;
            }
            .table_student{
                white-space: nowrap;
                padding: 0.2rem 0.5rem;
                min-width: 12rem;
                font-weight: 400;
                border-bottom: none;
                border-top: none;
            }
            .head{
                border-top: solid 3px #efefef;
                border-bottom: solid 3px #efefef;
                font-weight: 600;
            }
            .table_header th, .table_header td{
                font-weight: 400;
                color: #c4c4c4;
                border:none;
                padding-bottom: 0.2rem;
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