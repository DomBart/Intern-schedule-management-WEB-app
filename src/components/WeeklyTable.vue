<template>
  <div class="schedule_table_container">
              <table>
                  <tr class="label_row">
                      <th></th>
                      <th v-for="count in 5" v-bind:key="count" v-bind:class="{ selected:(array[count-1][0].getDate() == selectedDate.split('/')[0] && array[count-1][0].getMonth() == (selectedDate.split('/')[1]-1)) }">{{array[count-1][0].getMonth()+1}} / {{array[count-1][0].getDate()}}</th>
                  </tr>
                  <tr class="title_row">
                      <th>Time</th>
                      <th>Pr</th>
                      <th>An</th>
                      <th>Tr</th>
                      <th>Kt</th>
                      <th>Pn</th>
                  </tr>
                  <div class="row_wrap" v-for="(item, index) in time" v-bind:key="index">
                  <tr>
                      <th class="time_cell" rowspan="4">{{timeStr[index]}}</th>
                      <td v-for="count in 5" v-bind:key="count">
                          <div v-if="array[count-1]">
                          <div class="time_data_wrap" v-for="(time, ind) in array[count-1].slice(1)" v-bind:key="ind">
                              <span class="time_data_text"  v-if="(item - time.time_from < 15 && time.time_from <= item && time.time_from - item >= 0 && time.time_from != time.time_to)"
                              v-bind:class="{single: (time.time_to - time.time_from <= 30),
                              dark: time.type_of_time == 'break' || time.type_of_time == 'lecture' || time.type_of_time == 'over-time'}">
                               <span>{{Math.floor(time.time_from/60)}}:{{('0'+(time.time_from%60).toString()).slice(-2)}} - {{Math.floor(time.time_to/60)}}:{{('0'+(time.time_to%60).toString()).slice(-2)}}</span>
                               <img class="edit_time" v-if="array[count-1][0].setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)" title="Redaguoti" src="../assets/edit_time_light.svg" alt="Edit" @click="editTime(time, array[count-1][0])" v-bind:class="{dark_edit: time.type_of_time == 'break' || time.type_of_time == 'lecture' || time.type_of_time == 'over-time'}">
                               <button v-if="array[count-1][0].setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)" title="Trinti" @click="deleteTime(time.time_id,time.time_from,time.time_to)" v-bind:class="{dark: time.type_of_time == 'break' || time.type_of_time == 'lecture' || time.type_of_time == 'over-time'}">X</button>
                              </span>
                              <div class="time_data" v-if="time.time_from <= item && time.time_to > item"
                                 v-bind:class="{
                                 single: (time.time_to - time.time_from <= 30),
                                 first: (item - time.time_from) < 15 && (time.time_from - item) >= 0,
                                 last:  (time.time_to - item) <= 15,
                                    intern: time.type_of_time == 'intern', free: time.type_of_time == 'off-time', lecture: time.type_of_time == 'lecture', break: time.type_of_time == 'break', over: time.type_of_time == 'over-time'
                                    }">
                              </div>
                          </div>
                          </div>
                      </td>
                  </tr>
                  <tr class="quarter_cell">
                        <td v-for="count in 5" v-bind:key="count">
                          <div v-if="array[count-1]">
                          <div class="time_data_wrap" v-for="(time, indh) in array[count-1].slice(1)" v-bind:key="indh">
                              <span class="time_data_text" v-if="((halfTime[index]-15) - time.time_from) < 15 && (time.time_from <= (halfTime[index]-15)) && time.time_from != time.time_to"
                              v-bind:class="{single: (time.time_to - time.time_from <= 30),
                              dark: time.type_of_time == 'break' || time.type_of_time == 'lecture' || time.type_of_time == 'over-time'}">
                               <span>{{Math.floor(time.time_from/60)}}:{{('0'+(time.time_from%60).toString()).slice(-2)}} - {{Math.floor(time.time_to/60)}}:{{('0'+(time.time_to%60).toString()).slice(-2)}}</span>
                               <img class="edit_time" v-if="array[count-1][0].setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)" title="Redaguoti" src="../assets/edit_time_light.svg" alt="Edit" @click="editTime(time,array[count-1][0])" v-bind:class="{dark_edit: time.type_of_time == 'break' || time.type_of_time == 'lecture' || time.type_of_time == 'over-time'}">
                               <button v-if="array[count-1][0].setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)" title="Trinti" @click="deleteTime(time.time_id,time.time_from,time.time_to)" v-bind:class="{dark: time.type_of_time == 'break' || time.type_of_time == 'lecture' || time.type_of_time == 'over-time'}">X</button>
                              </span>
                              <div class="time_data" v-if="time.time_from <= halfTime[index]-15 && time.time_to > halfTime[index]-15"
                                v-bind:class="{
                                 single: (time.time_to - time.time_from <= 30), 
                                 first: (halfTime[index]-15 - time.time_from) < 15,
                                 last:  (time.time_to - (halfTime[index]-15))  <= 15,
                                 intern: time.type_of_time == 'intern', free: time.type_of_time == 'off-time', lecture: time.type_of_time == 'lecture', break: time.type_of_time == 'break', over: time.type_of_time == 'over-time'
                                 }">
                                  
                              </div>
                          </div>
                          </div>
                      </td>
                  </tr>
                  <tr class="half_cell">
                        <td v-for="count in 5" v-bind:key="count">
                          <div v-if="array[count-1]">
                          <div class="time_data_wrap" v-for="(time, indh) in array[count-1].slice(1)" v-bind:key="indh">
                              <span class="time_data_text" v-if="(halfTime[index] - time.time_from) < 15 && (time.time_from <= halfTime[index]) && time.time_from != time.time_to"
                              v-bind:class="{single: ((time.time_to - time.time_from) <= 30),
                              dark: time.type_of_time == 'break' || time.type_of_time == 'lecture' || time.type_of_time == 'over-time'}">
                              <span>{{Math.floor(time.time_from/60)}}:{{('0'+(time.time_from%60).toString()).slice(-2)}} - {{Math.floor(time.time_to/60)}}:{{('0'+(time.time_to%60).toString()).slice(-2)}}</span>
                              <img class="edit_time" v-if="array[count-1][0].setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)" title="Redaguoti" src="../assets/edit_time_light.svg" alt="Edit" @click="editTime(time,array[count-1][0])" v-bind:class="{dark_edit: time.type_of_time == 'break' || time.type_of_time == 'lecture' || time.type_of_time == 'over-time'}">
                              <button v-if="array[count-1][0].setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)" title="Trinti" @click="deleteTime(time.time_id,time.time_from,time.time_to)" v-bind:class="{dark: time.type_of_time == 'break' || time.type_of_time == 'lecture'  || time.type_of_time == 'over-time'}">X</button>
                              </span>
                              <div class="time_data" v-if="time.time_from <= halfTime[index] && time.time_to > halfTime[index]"
                                v-bind:class="{
                                 single: (time.time_to - time.time_from) <= 30, 
                                 first: (halfTime[index] - time.time_from) < 15,
                                 last:  (time.time_to - halfTime[index])  <= 15,
                                 intern: time.type_of_time == 'intern', free: time.type_of_time == 'off-time', lecture: time.type_of_time == 'lecture', break: time.type_of_time == 'break', over: time.type_of_time == 'over-time'
                                 }">
                                  
                              </div>
                          </div>
                          </div>
                      </td>
                  </tr>
                  <tr class="quarter_cell">
                        <td v-for="count in 5" v-bind:key="count">
                          <div v-if="array[count-1]">
                          <div class="time_data_wrap" v-for="(time, indh) in array[count-1].slice(1)" v-bind:key="indh">
                              <span class="time_data_text" v-if="((halfTime[index]+30) - time.time_from) < 30 && time.time_from < (halfTime[index]+30) && (((halfTime[index]+30) - time.time_from) > 0) && time.time_from != time.time_to"
                              v-bind:class="{single: (time.time_to - time.time_from) <= 30,
                              dark: time.type_of_time == 'break' || time.type_of_time == 'lecture' || time.type_of_time == 'over-time'}">
                              <span>{{Math.floor(time.time_from/60)}}:{{('0'+(time.time_from%60).toString()).slice(-2)}} - {{Math.floor(time.time_to/60)}}:{{('0'+(time.time_to%60).toString()).slice(-2)}}</span>
                              <img class="edit_time" v-if="array[count-1][0].setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)" title="Redaguoti" src="../assets/edit_time_light.svg" alt="Edit" @click="editTime(time,array[count-1][0])" v-bind:class="{dark_edit: time.type_of_time == 'break' || time.type_of_time == 'lecture' || time.type_of_time == 'over-time'}">
                              <button v-if="array[count-1][0].setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)" title="Trinti" @click="deleteTime(time.time_id,time.time_from,time.time_to)" v-bind:class="{dark: time.type_of_time == 'break' || time.type_of_time == 'lecture' || time.type_of_time == 'over-time'}">X</button>
                              </span>
                              <div class="time_data" v-if="time.time_from < (halfTime[index]+30) && time.time_to > (halfTime[index]+15)"
                                v-bind:class="{
                                 single: (time.time_to - time.time_from) <= 30, 
                                 first: ((halfTime[index]+30) - time.time_from) < 30,
                                 last:  (time.time_to - (halfTime[index]+15))  <= 15,
                                 intern: time.type_of_time == 'intern', free: time.type_of_time == 'off-time', lecture: time.type_of_time == 'lecture', break: time.type_of_time == 'break', over: time.type_of_time == 'over-time'
                                 }">
                              </div>
                          </div>
                          </div>
                      </td>
                  </tr>
                  </div>
              </table>
          </div>
</template>

<script>
export default {
    
props: ['array','selectedDate','id','scheduleID'],
    data () {
      return {
          time: [480,540,600,660,720,
                 780,840,900,960,1020],
          halfTime: [510,570,630,690,750,
                 810,870,930,990,1050],
          timeStr: ['8:00','9:00','10:00','11:00','12:00',
                    '13:00','14:00','15:00','16:00','17:00']
      }
    },
    methods:{
        deleteTime(time_id, time_from, time_to){
            let itemids = [this.scheduleID,time_id];
            this.$root.$emit('Alert', 'timeDelete', this.id, itemids, 'AR TIKRAI NORITE PAŠALINTI LAIKĄ',
            Math.floor(time_from/60)+':'+('0'+(time_from%60).toString()).slice(-2) + ' - ' + Math.floor(time_to/60)+':'+('0'+(time_to%60).toString()).slice(-2))
        },
        editTime(time,date){
            this.$root.$emit('TimeEdit',time,date);
        }
    }
}
</script>

<style scoped lang="scss">
        .schedule_table_container{
            width: 100%;
            height: 85%;
            padding-top: 3%;
            th, td{
                border: 3px solid #efefef;
            }
            td{
                border-bottom: none;
            }
            table{
                 font-family: "Open Sans";
                 border-collapse: collapse;
                 width: 100%;
                 height: 100%;

            }
            th:first-child{
                border-bottom: none;
                border-top:none;
                border-left: none;
            }
            th:last-child{
                border-right: none;
            }
            .time_cell{
                vertical-align: middle;
            }
            .half_cell td{
                border-top: 2.5px dashed #efefef;
            }
            .quarter_cell td{
                border-top: none;
            }
            .time_data_wrap{
                position: relative;
            }
            .time_data{
                position: absolute;
                width: 95%;
                height: 1.7vh;
                left: 50%;
                -ms-transform: translateX(-50%);
                transform: translateX(-50%);
                background-color: #c4c4c4;
                z-index: 10;
            }
            .first{
                 border-top-left-radius: 10px;
                 border-top-right-radius: 10px;
                 -ms-transform: translate(-50%, 25%);
                 transform: translate(-50%, 25%);
            }
            .last{
                 border-bottom-left-radius: 10px;
                 border-bottom-right-radius: 10px;
                 -ms-transform: translate(-50%, -30%);
                 transform: translate(-50%, -30%);
            }
            .quarter_cell{
                .first{
                    -ms-transform: translate(-50%, 25%);
                    transform: translate(-50%, 25%);
                }
                .last{
                    -ms-transform: translate(-50%, -25%);
                    transform: translate(-50%, -25%);
                }
            }
            .single{
                height: 1.2vh!important;
                min-height: 0.7rem!important;
            }
            .single.first{
                -ms-transform: translate(-50%, 10%);
                transform: translate(-50%, 10%);
            }
            .single.last{
                -ms-transform: translate(-50%, -30%);
                transform: translate(-50%, -30%);
            }
            .quarter_cell{
                .single.last{
                    -ms-transform: translate(-50%, -5%);
                    transform: translate(-50%, -5%);
                }
            }
            .half_cell{
                .single.first{
                    -ms-transform: translate(-50%, 15%);
                    transform: translate(-50%, 15%);
                }
                .single.last{
                    -ms-transform: translate(-50%, -20%);
                    transform: translate(-50%, -20%);
                }
            }
            .first.last{
                -ms-transform: translate(-50%, 10%);
                transform: translate(-50%, 10%);
                height: 2.3vh;
            }
            .time_data_text{
                color: #ffffff;
                font-family: 'Oswald';
                position: absolute;
                font-size: 0.9rem;
                width: 100%;
                padding-top: 1%;
                white-space: nowrap;
                left: 50%;
                top: 50%;
                -ms-transform: translate(-50%, 50%);
                transform: translate(-50%, 50%);
                z-index: 20;
                span{
                    position: absolute;
                    text-align: center;
                    width: 100%;
                    top: 5px;
                }
                button{
                    position: absolute;
                    color: #ffffff;
                    font-family: 'Open Sans';
                    font-size: 0.95rem;
                    font-weight: 600;
                    background: none;
                    outline: none;
                    border: none;
                    cursor: pointer;
                    right: 15px;
                    top: 5px;
                }
                button:hover{
                    color: #FF7B7B!important;
                }
                .edit_time{
                    position: absolute;
                    left: 13px;
                    top: 6px;
                    width: 17px;
                    cursor: pointer;
                }
                .edit_time:hover{
                    content:url("../assets/edit_time_light_active.svg");
                }
            }
            .dark_edit{
                content:url("../assets/edit_time_dark.svg");
            }
            .dark_edit:hover{
                content:url("../assets/edit_time_dark_active.svg")!important;
            }
            .dark{
                color: #5f5f5f!important;
            }
            .time_data_text.single{
                -ms-transform: translate(-50%,0%);
                transform: translate(-50%,0%);
                span{
                    top:5%;
                }
                button{
                    top: 3%;
                }
                .edit_time{
                        top: 12%;
                }
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
            .over{
                background-color: #5fcfff;
            }

            .label_row th{
                color: #c4c4c4;
                border: none;
            }
            .label_row th.selected{
                color: #0054A6;
            }
            .label_wrap{
                display: table-cell;
            }
            .title_row{
                vertical-align: middle;
            }
            .row_wrap{
                display: table-row-group;
                td{
                    height: 1.4vh;
                }
            }
            .title_row{
                height: 7vh;
                th{
                border-top: 3px solid #efefef;
                border-bottom: 3px solid #efefef;
            }
            }
            th{
                width: 13%;
            }
            th:first-child{
                width: 9%;
            }
            td {
                border-right: 3px solid #efefef;
            }
            @media only screen and (max-height: 920px) {
                .schedule_table_container{
                    padding-top: 0;
                }
                .row_wrap{
                 td{
                     height:0.75rem;
                 }
                }
                .title_row{
                    height: 3.5rem;
                }
                .time_data_text{
                    padding-top: 0.15rem;
                    font-size: 0.8rem;
                }
                .first{
                    transform: translate(-50%, 12%); 
                }
                .last{
                    transform: translate(-50%, -20%);
                }
                .time_data_wrap{
                 .time_data{
                    height: 0.95rem;
                }
                .single.first{
                     -ms-transform: translate(-50%, 10%);
                     transform: translate(-50%, 10%);
                     height: 0.7rem;
                }
                .single.last{
                     -ms-transform: translate(-50%, -10%);
                     transform: translate(-50%, -10%);
                     height: 0.7rem;
                }
                .first.last{
                    height: 1.2rem;
                    -ms-transform: translate(-50%, 10%);
                    transform: translate(-50%, 10%);
                }
                .quarter_cell{
                    .first{
                    -ms-transform: translate(-50%, 30%);
                    transform: translate(-50%, 30%);
                    }
                    .last{
                    -ms-transform: translate(-50%, -25%);
                    transform: translate(-50%, -25%);
                    }
                }
                .time_data_text.single{
                    -ms-transform: translate(-50%, -20%);
                    transform: translate(-50%, -20%);
                    font-size: 0.9rem;
                    span{
                        top:10%;
                    }
                    button{
                        top: 10%;
                    }
                    .edit_time{
                        top: 32%;
                    }
                }
                }
            }
        }
</style>