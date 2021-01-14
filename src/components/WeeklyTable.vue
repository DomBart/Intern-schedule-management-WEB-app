<template>
  <div class="schedule_table_container">
              <table>
                  <tr class="label_row">
                      <th></th>
                      <th v-for="count in 5" v-bind:key="count" v-bind:class="{ selected:(array[count-1][0].getDate() == selectedDate.substring(0,2)) || (array[count-1][0].getDate() == selectedDate.substring(0,1))}">{{array[count-1][0].getMonth()+1}} / {{array[count-1][0].getDate()}}</th>
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
                      <th class="time_cell" rowspan="4">{{item}}</th>
                      <td v-for="count in 5" v-bind:key="count">
                          <div v-if="array[count-1]">
                          <div class="time_data_wrap" v-for="(time, ind) in array[count-1].slice(1)" v-bind:key="ind">
                              <span class="time_data_text"  v-if="(parseInt(item.replace(':','').substring(0, 4))) - parseInt(time.time_from.replace(':','').substring(0, 4)) < 15 && parseInt(time.time_from.replace(':','').substring(0, 4)) <= parseInt(item.replace(':',''))"
                              v-bind:class="{single: (parseInt(time.time_to.replace(':','').substring(0, 4)) - parseInt(time.time_from.replace(':','').substring(0, 4)) <= 30),
                              dark: time.type_of_time == 'break' || time.type_of_time == 'lecture'}">
                              {{time.time_from.substring(0, 5)}} - {{time.time_to.substring(0, 5)}}
                              </span>
                              <div class="time_data" v-if="parseInt(time.time_from.replace(':','').substring(0, 4)) <= parseInt(item.replace(':','')) && parseInt(time.time_to.replace(':','').substring(0, 4)) > parseInt(item.replace(':',''))"
                                 v-bind:class="{
                                 single: (parseInt(time.time_to.replace(':','').substring(0, 4)) - parseInt(time.time_from.replace(':','').substring(0, 4)) <= 30),
                                 first: (parseInt(item.replace(':','').substring(0, 4))) - parseInt(time.time_from.replace(':','').substring(0, 4)) < 15,
                                 last:  (parseInt(time.time_to.replace(':','').substring(0, 4)) - parseInt(item.replace(':',''))) <= 15,
                                    intern: time.type_of_time == 'intern', free: time.type_of_time == 'off-time', lecture: time.type_of_time == 'lecture', break: time.type_of_time == 'break'
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
                              <span class="time_data_text" v-if="(parseInt(halfTime[index].replace(':',''))-15) - parseInt(time.time_from.replace(':','').substring(0, 4)) < 15 && parseInt(time.time_from.replace(':','').substring(0, 4)) <= parseInt(halfTime[index].replace(':',''))-15"
                              v-bind:class="{single: (parseInt(time.time_to.replace(':','').substring(0, 4)) - parseInt(time.time_from.replace(':','').substring(0, 4)) <= 30),
                              dark: time.type_of_time == 'break' || time.type_of_time == 'lecture'}">
                              {{time.time_from.substring(0, 5)}} - {{time.time_to.substring(0, 5)}}
                              </span>
                              <div class="time_data" v-if="parseInt(time.time_from.replace(':','').substring(0, 4)) <= parseInt(halfTime[index].replace(':',''))-15 && parseInt(time.time_to.replace(':','').substring(0, 4)) > parseInt(halfTime[index].replace(':',''))-15"
                                v-bind:class="{
                                 single: (parseInt(time.time_to.replace(':','').substring(0, 4)) - parseInt(time.time_from.replace(':','').substring(0, 4)) <= 30), 
                                 first: (parseInt(halfTime[index].replace(':',''))-15) - parseInt(time.time_from.replace(':','').substring(0, 4)) < 15,
                                 last:  (parseInt(time.time_to.replace(':','').substring(0, 4)) - (parseInt(halfTime[index].replace(':',''))-15))  <= 15,
                                 intern: time.type_of_time == 'intern', free: time.type_of_time == 'off-time', lecture: time.type_of_time == 'lecture', break: time.type_of_time == 'break'
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
                              <span class="time_data_text" v-if="(parseInt(halfTime[index].replace(':','')) - parseInt(time.time_from.replace(':','').substring(0, 4))) < 15 && parseInt(time.time_from.replace(':','').substring(0, 4)) <= parseInt(halfTime[index].replace(':',''))"
                              v-bind:class="{single: (parseInt(time.time_to.replace(':','').substring(0, 4)) - parseInt(time.time_from.replace(':','').substring(0, 4)) <= 30),
                              dark: time.type_of_time == 'break' || time.type_of_time == 'lecture'}">
                              {{time.time_from.substring(0, 5)}} - {{time.time_to.substring(0, 5)}}
                              </span>
                              <div class="time_data" v-if="parseInt(time.time_from.replace(':','').substring(0, 4)) <= parseInt(halfTime[index].replace(':','')) && parseInt(time.time_to.replace(':','').substring(0, 4)) > parseInt(halfTime[index].replace(':',''))"
                                v-bind:class="{
                                 single: (parseInt(time.time_to.replace(':','').substring(0, 4)) - parseInt(time.time_from.replace(':','').substring(0, 4)) <= 30), 
                                 first: (parseInt(halfTime[index].replace(':','')) - parseInt(time.time_from.replace(':','').substring(0, 4))) < 15,
                                 last:  (parseInt(time.time_to.replace(':','').substring(0, 4)) - parseInt(halfTime[index].replace(':','')))  <= 15,
                                 intern: time.type_of_time == 'intern', free: time.type_of_time == 'off-time', lecture: time.type_of_time == 'lecture', break: time.type_of_time == 'break'
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
                              <span class="time_data_text" v-if="(parseInt(halfTime[index].replace(':',''))+15 - parseInt(time.time_from.replace(':','').substring(0, 4))) < 15 && parseInt(time.time_from.replace(':','').substring(0, 4)) <= parseInt(halfTime[index].replace(':',''))+15"
                              v-bind:class="{single: (parseInt(time.time_to.replace(':','').substring(0, 4)) - parseInt(time.time_from.replace(':','').substring(0, 4)) <= 30),
                              dark: time[0] == 'break' || time[0] == 'lecture'}">
                              {{time.time_from.substring(0, 5)}} - {{time.time_to.substring(0, 5)}}
                              </span>
                              <div class="time_data" v-if="parseInt(time.time_from.replace(':','').substring(0, 4)) <= parseInt(halfTime[index].replace(':',''))+15 && parseInt(time.time_to.replace(':','').substring(0, 4)) > parseInt(halfTime[index].replace(':',''))+15"
                                v-bind:class="{
                                 single: (parseInt(time.time_to.replace(':','').substring(0, 4)) - parseInt(time.time_from.replace(':','').substring(0, 4)) <= 30), 
                                 first: (parseInt(halfTime[index].replace(':',''))+15 - parseInt(time.time_from.replace(':','').substring(0, 4))) < 15,
                                 last:  (parseInt(time.time_to.replace(':','').substring(0, 4)) - parseInt(halfTime[index].replace(':',''))+15)  <= 85,
                                 intern: time.type_of_time == 'intern', free: time.type_of_time == 'off-time', lecture: time.type_of_time == 'lecture', break: time.type_of_time == 'break'
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
    
props: ['array','selectedDate'],
    data () {
      return {
          time: ['08:00','09:00','10:00','11:00','12:00',
                 '13:00','14:00','15:00','16:00','17:00'],
          halfTime: ['08:30','09:30','10:30','11:30','12:30',
                 '13:30','14:30','15:30','16:30','17:30'],
      }
    },
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
                 -ms-transform: translate(-50%, 20%);
                 transform: translate(-50%, 20%);
            }
            .last{
                 border-bottom-left-radius: 10px;
                 border-bottom-right-radius: 10px;
                 -ms-transform: translate(-50%, -15%);
                 transform: translate(-50%, -15%);
            }
            .quarter_cell{
                .first{
                    -ms-transform: translate(-50%, 20%);
                    transform: translate(-50%, 20%);
                }
                .last{
                    -ms-transform: translate(-50%, -25%);
                    transform: translate(-50%, -25%);
                }
            }
            .single{
                height: 1vh!important;
                min-height: 0.6rem!important;
            }
            .single.first{
                -ms-transform: translate(-50%, 20%);
                transform: translate(-50%, 20%);
            }
            .single.last{
                -ms-transform: translate(-50%, -20%);
                transform: translate(-50%, -20%);
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
                padding-top: 1%;
                left: 50%;
                top: 50%;
                -ms-transform: translate(-50%, 30%);
                transform: translate(-50%, 30%);
                z-index: 20;
            }
            .dark{
                color: #5f5f5f;
            }
            // .time_data_text.single{
            //     -ms-transform: translate(-50%, -5%);
            //     transform: translate(-50%,-5%);
            //     font-size: 0.6rem;
            // }
            .time_data_text.single{
                display: none;
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
                    height: 1.3vh;
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
                .quarter_cell{
                    .first{
                    transform: translate(-50%, 30%);
                    }
                    .last{
                    transform: translate(-50%, -25%);
                    }
                }
                .time_data_wrap{
                 .time_data{
                    height: 0.95rem;
                }
                .single.first{
                     transform: translate(-50%, 15%);
                     height: 0.7rem;
                }
                .single.last{
                     transform: translate(-50%, 5%);
                     height: 0.7rem;
                }
                .first.last{
                    height: 1.2rem;
                    transform: translate(-50%, 10%);
                }
                // .time_data_text.single{
                //     -ms-transform: translate(-50%, -40%);
                //     transform: translate(-50%, -40%);
                //     font-size: 0.6rem;
                // }
                }
            }
        }
</style>