<template>
  <div class="schedule_table_container">
              <table>
                  <tr class="label_row">
                      <th></th>
                      <th class="label_wrap" v-for="(day, index) in days" :key="index">{{dayName[day[0].getDay()]}}</th>
                  </tr>
                  <tr class="title_row">
                      <th>Time</th>
                      <th class="label_wrap" v-for="(day, index) in days" :key="index">{{day[0].getDate()}}</th>
                  </tr>
                  <div class="row_wrap" v-for="(item, index) in time" v-bind:key="index">
                  <tr>
                      <th class="time_cell" rowspan="4">{{timeStr[index]}}</th>
                      <td v-for="(day, dind) in days" v-bind:key="dind">
                          <div class="time_data_wrap" v-for="(time, ind) in day.slice(1)" v-bind:key="ind">
                              <div class="time_data" v-if="time.time_from <= item && time.time_to > item"
                                 v-bind:class="{
                                 single: (time.time_to - time.time_from) <= 30,
                                 first: (item - time.time_from) < 15,
                                 last:  (time.time_to - item) <= 15,
                                    intern: time.type_of_time == 'intern', free: time.type_of_time == 'off-time', lecture: time.type_of_time == 'lecture', break: time.type_of_time == 'break'
                                    }">
                              </div>
                          </div>
                      </td>
                  </tr>
                  <tr class="quarter_cell">
                        <td v-for="(day, dind) in days" v-bind:key="dind">
                          <div class="time_data_wrap" v-for="(time, indh) in day.slice(1)" v-bind:key="indh">
                              <div class="time_data" v-if="time.time_from <= halfTime[index]-15 && time.time_to > halfTime[index]-15"
                                v-bind:class="{
                                 single: (time.time_to - time.time_from) <= 30, 
                                 first: ((halfTime[index]-15) - time.time_from) < 15,
                                 last:  (time.time_to - (halfTime[index]-15))  <= 15,
                                 intern: time.type_of_time == 'intern', free: time.type_of_time == 'off-time', lecture: time.type_of_time == 'lecture', break: time.type_of_time == 'break'
                                 }">
                                  
                              </div>
                          </div>
                      </td>
                  </tr>
                  <tr class="half_cell">
                        <td v-for="(day, dind) in days" v-bind:key="dind">
                           <div class="time_data_wrap" v-for="(time, indh) in day.slice(1)" v-bind:key="indh">
                              <div class="time_data" v-if="time.time_from <= halfTime[index] && time.time_to > halfTime[index]"
                                v-bind:class="{
                                 single: (time.time_to - time.time_from) <= 30, 
                                 first: (halfTime[index] - time.time_from) < 15,
                                 last:  (time.time_to - halfTime[index])  <= 15,
                                 intern: time.type_of_time == 'intern', free: time.type_of_time == 'off-time', lecture: time.type_of_time == 'lecture', break: time.type_of_time == 'break'
                                 }">
                                  
                              </div>
                          </div>
                      </td>
                  </tr>
                    <tr class="quarter_cell">
                        <td v-for="(day, dind) in days" v-bind:key="dind">
                          <div class="time_data_wrap" v-for="(time, indh) in day.slice(1)" v-bind:key="indh">
                              <div class="time_data" v-if="time.time_from <= halfTime[index]+15 && time.time_to > halfTime[index]+15"
                                v-bind:class="{
                                 single: (time.time_to - time.time_from) <= 30, 
                                 first: ((halfTime[index]+15) - time.time_from) < 15,
                                 last:  (time.time_to - (halfTime[index]+15))  <= 15,
                                 intern: time.type_of_time == 'intern', free: time.type_of_time == 'off-time', lecture: time.type_of_time == 'lecture', break: time.type_of_time == 'break'
                                 }">
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
    data () {
        return {
            dayName: ['Sk','Pr','An','Tr','Kt','Pn','Št'],
            time: [480,540,600,660,720,
                 780,840,900,960,1020],
          halfTime: [510,570,630,690,750,
                 810,870,930,990,1050],
          timeStr: ['8:00','9:00','10:00','11:00','12:00',
                 '13:00','14:00','15:00','16:00','17:00'],
            days: [],
        }
    },
props: ['array','month'],
mounted(){
   this.updateTable();
},
watch: {
    array: function() {
          this.updateTable();
        }
},
methods:{
    updateTable(){
        this.days = [].concat.apply([], this.array);
        for(let i = 0; i < this.days.length; i++){
            if(this.days[i][0].getMonth() != this.month)
            {
                this.days.splice(i,1);
                i--;
            }
        }
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
            .half_cell td{
                border-top: 2.5px dashed #efefef;
            }
            .quarter_cell td{
                border-top: none;
            }
            .time_cell{
                vertical-align: middle;
            }
            .label_row th{
                color: #efefef;
                border: none;
            }
            .title_row{
                vertical-align: middle;
                height: 3rem;
                th{
                  border-top: 3px solid #efefef;
                  border-bottom: 3px solid #efefef;
                  width: 3%;
                }
            }
            .time_data_wrap{
                position: relative;
            }
            .time_data{
                position: absolute;
                width: 90%;
                height: 1.6vh;
                min-height: 1rem;
                left: 50%;
                -ms-transform: translateX(-50%);
                transform: translateX(-50%);
                background-color: #c4c4c4;
                z-index: 10;
            }
            .row_wrap{
                display: table-row-group;
                td{
                    height: 1.4vh;
                }
            }
            th:first-child{
                width: 5%;
            }
            .first{
                 top: 50%;
                 border-top-left-radius: 10px;
                 border-top-right-radius: 10px;
                 transform: translate(-50%, 5%);
            }
            .last{
                 top: 50%;
                 border-bottom-left-radius: 10px;
                 border-bottom-right-radius: 10px; 
                 transform: translate(-50%, -25%);
            }
            .single{
                height: 1.1vh!important;
                min-height: 0.6rem!important;
            }
            .single.first{
                     transform: translate(-50%, 10%);
            }
            .single.last{
                     transform: translate(-50%, -30%);
            }
            .first.last{
                transform: translate(-50%, 15%);
                height: 1.2vh;
                border-radius: 6px;
            }
            .quarter_cell{
                .first{
                    transform: translate(-50%, 35%);
                }
                .last{
                    transform: translate(-50%, -5%);
                }
            }
            .half_cell{
                .first{
                    transform: translate(-50%, 20%);
                }
                .last{
                    transform: translate(-50%, -25%);
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
            td {
                border-right: 3px solid #efefef;
            }
            @media only screen and (max-height: 1000px) {
                .row_wrap{
                line-height: 3rem;
                }
            }
        }
</style>