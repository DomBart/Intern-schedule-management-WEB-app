<template>
  <div class="schedule_table_container">
              <table>
                  <tr class="label_row">
                      <th></th>
                      <th>{{array[0][0].getMonth()+1}} / {{array[0][0].getDate()}}</th>
                      <th>{{array[1][0].getMonth()+1}} / {{array[1][0].getDate()}}</th>
                      <th>{{array[2][0].getMonth()+1}} / {{array[2][0].getDate()}}</th>
                      <th>{{array[3][0].getMonth()+1}} / {{array[3][0].getDate()}}</th>
                      <th>{{array[4][0].getMonth()+1}} / {{array[4][0].getDate()}}</th>
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
                      <th class="time_cell" rowspan="2">{{item}}</th>
                      <td v-for="count in 5" v-bind:key="count">
                          <div v-if="array[count-1]">
                          <div class="time_data_wrap" v-for="(time, ind) in array[count-1].slice(1)" v-bind:key="ind">
                              <span class="time_data_text"  v-if="parseInt(time[1].replace(':','')) == parseInt(item.replace(':',''))"
                              v-bind:class="{single: parseInt(time[1].replace(':','')) == parseInt(item.replace(':','')) && parseInt(time[2].replace(':','')) === parseInt(item.replace(':','')),
                              dark: time[0] == 'break' || time[0] == 'lecture'}">
                              {{time[1]}} - {{time[2]}}
                              </span>
                              <div class="time_data" v-if="parseInt(time[1].replace(':','')) <= parseInt(item.replace(':','')) && parseInt(time[2].replace(':','')) > parseInt(item.replace(':',''))"
                                 v-bind:class="{
                                    first: parseInt(time[1].replace(':','')) == parseInt(item.replace(':','')),
                                    last: parseInt(time[2].replace(':',''))-30 === parseInt(item.replace(':','')),
                                    intern: time[0] == 'internship', free: time[0] == 'off-time', lecture: time[0] == 'lecture', break: time[0] == 'break'
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
                              <span class="time_data_text" v-if="parseInt(time[1].replace(':','')) == parseInt(halfTime[index].replace(':',''))"
                              v-bind:class="{single: parseInt(time[1].replace(':','')) == parseInt(halfTime[index].replace(':','')) && parseInt(time[2].replace(':','')) === parseInt(halfTime[index].replace(':','')),
                              dark: time[0] == 'break' || time[0] == 'lecture'}">
                              {{time[1]}} - {{time[2]}}
                              </span>
                              <div class="time_data" v-if="parseInt(time[1].replace(':','')) <= parseInt(halfTime[index].replace(':','')) && parseInt(time[2].replace(':','')) > parseInt(halfTime[index].replace(':',''))"
                                v-bind:class="{ 
                                 first: parseInt(time[1].replace(':','')) == parseInt(halfTime[index].replace(':','')) ,
                                 last: parseInt(time[2].replace(':',''))-70 == parseInt(halfTime[index].replace(':','')),
                                 intern: time[0] == 'internship', free: time[0] == 'off-time', lecture: time[0] == 'lecture', break: time[0] == 'break'
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
    
props: ['array'],
    data () {
      return {
          time: ['08:00','09:00','10:00','11:00','12:00',
                 '13:00','14:00','15:00','16:00','17:00'],
          halfTime: ['08:30','09:30','10:30','11:30','12:30',
                 '13:30','14:30','15:30','16:30','17:30'],
      }
    },
    mounted(){
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
            .time_data_wrap{
                position: relative;
            }
            .time_data{
                position: absolute;
                width: 95%;
                height: 2.9vh;
                left: 50%;
                -ms-transform: translateX(-50%);
                transform: translateX(-50%);
                background-color: #c4c4c4;
                z-index: 10;
            }
            .first{
                 top: 50%;
                 border-top-left-radius: 10px;
                 border-top-right-radius: 10px;
                 transform: translate(-50%, 15%);
            }
            .last{
                 top: 50%;
                 border-bottom-left-radius: 10px;
                 border-bottom-right-radius: 10px; 
                 transform: translate(-50%, -30%);
            }
            .first.last{
                transform: translate(-50%, 15%);
                height: 1.9vh;
                border-radius: 6px;
            }
            .time_data_text{
                color: #ffffff;
                font-family: 'Oswald';
                position: absolute;
                left: 50%;
                top: 50%;
                -ms-transform: translate(-50%, 50%);
                transform: translate(-50%, 30%);
                z-index: 20;
            }
            .dark{
                color: #5f5f5f;
            }
            .single{
                -ms-transform: translate(-50%, 6%);
                transform: translate(-50%, 6%);
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
            .label_wrap{
                display: table-cell;
            }
            .title_row{
                vertical-align: middle;
            }
            .row_wrap{
                display: table-row-group;
                // line-height: 5vh;
                td{
                    height: 2.7vh;
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
                     height:1.5rem;
                 }
                }
                .title_row{
                    height: 3.5rem;
                }
                .time_data_wrap{
                 .time_data{
                    height: 1.6rem;
                }
                .first.last{
                    height: 1.2rem;
                    transform: translate(-50%, 10%);
                }
                .single{
                    -ms-transform: translate(-50%, 0);
                    transform: translate(-50%, 0); 
                }
                }
            }
        }
</style>