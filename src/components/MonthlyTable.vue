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
                      <th class="time_cell" rowspan="4">{{item}}</th>
                      <td v-for="(day, dind) in days" v-bind:key="dind">
                          <div class="time_data_wrap" v-for="(time, ind) in day.slice(1)" v-bind:key="ind">
                              <div class="time_data" v-if="parseInt(time.time_from.replace(':','').substring(0, 4)) <= parseInt(item.replace(':','')) && parseInt(time.time_to.replace(':','').substring(0, 4)) > parseInt(item.replace(':',''))"
                                 v-bind:class="{
                                 single: (parseInt(time.time_to.replace(':','').substring(0, 4)) - parseInt(time.time_from.replace(':','').substring(0, 4)) <= 30),
                                 first: (parseInt(item.replace(':','').substring(0, 4))) - parseInt(time.time_from.replace(':','').substring(0, 4)) < 15,
                                 last:  (parseInt(time.time_to.replace(':','').substring(0, 4)) - parseInt(item.replace(':',''))) <= 15,
                                    intern: time.type_of_time == 'intern', free: time.type_of_time == 'off-time', lecture: time.type_of_time == 'lecture', break: time.type_of_time == 'break'
                                    }">
                              </div>
                          </div>
                      </td>
                  </tr>
                  <tr class="quarter_cell">
                        <td v-for="(day, dind) in days" v-bind:key="dind">
                          <div class="time_data_wrap" v-for="(time, indh) in day.slice(1)" v-bind:key="indh">
                              <div class="time_data" v-if="parseInt(time.time_from.replace(':','').substring(0, 4)) <= parseInt(halfTime[index].replace(':',''))-15 && parseInt(time.time_to.replace(':','').substring(0, 4)) > parseInt(halfTime[index].replace(':',''))-15"
                                v-bind:class="{
                                 single: (parseInt(time.time_to.replace(':','').substring(0, 4)) - parseInt(time.time_from.replace(':','').substring(0, 4)) <= 30), 
                                 first: (parseInt(halfTime[index].replace(':',''))-15) - parseInt(time.time_from.replace(':','').substring(0, 4)) < 15,
                                 last:  (parseInt(time.time_to.replace(':','').substring(0, 4)) - (parseInt(halfTime[index].replace(':',''))-15))  <= 15,
                                 intern: time.type_of_time == 'intern', free: time.type_of_time == 'off-time', lecture: time.type_of_time == 'lecture', break: time.type_of_time == 'break'
                                 }">
                                  
                              </div>
                          </div>
                      </td>
                  </tr>
                  <tr class="half_cell">
                        <td v-for="(day, dind) in days" v-bind:key="dind">
                           <div class="time_data_wrap" v-for="(time, indh) in day.slice(1)" v-bind:key="indh">
                              <div class="time_data" v-if="parseInt(time.time_from.replace(':','').substring(0, 4)) <= parseInt(halfTime[index].replace(':','')) && parseInt(time.time_to.replace(':','').substring(0, 4)) > parseInt(halfTime[index].replace(':',''))"
                                v-bind:class="{
                                 single: (parseInt(time.time_to.replace(':','').substring(0, 4)) - parseInt(time.time_from.replace(':','').substring(0, 4)) <= 30), 
                                 first: (parseInt(halfTime[index].replace(':','')) - parseInt(time.time_from.replace(':','').substring(0, 4))) < 15,
                                 last:  (parseInt(time.time_to.replace(':','').substring(0, 4)) - parseInt(halfTime[index].replace(':','')))  <= 15,
                                 intern: time.type_of_time == 'intern', free: time.type_of_time == 'off-time', lecture: time.type_of_time == 'lecture', break: time.type_of_time == 'break'
                                 }">
                                  
                              </div>
                          </div>
                      </td>
                  </tr>
                    <tr class="quarter_cell">
                        <td v-for="(day, dind) in days" v-bind:key="dind">
                          <div class="time_data_wrap" v-for="(time, indh) in day.slice(1)" v-bind:key="indh">
                              <div class="time_data" v-if="parseInt(time.time_from.replace(':','').substring(0, 4)) <= parseInt(halfTime[index].replace(':',''))+15 && parseInt(time.time_to.replace(':','').substring(0, 4)) > parseInt(halfTime[index].replace(':',''))+15"
                                v-bind:class="{
                                 single: (parseInt(time.time_to.replace(':','').substring(0, 4)) - parseInt(time.time_from.replace(':','').substring(0, 4)) <= 30), 
                                 first: (parseInt(halfTime[index].replace(':',''))+15 - parseInt(time.time_from.replace(':','').substring(0, 4))) < 15,
                                 last:  (parseInt(time.time_to.replace(':','').substring(0, 4)) - parseInt(halfTime[index].replace(':',''))+15)  <= 85,
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
            time: ['8:00','9:00','10:00','11:00','12:00',
                 '13:00','14:00','15:00','16:00','17:00'],
            halfTime: ['08:30','09:30','10:30','11:30','12:30',
                 '13:30','14:30','15:30','16:30','17:30'],
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
            .quarter_cell{
                .first{
                    transform: translate(-50%, 20%);
                }
                .last{
                    transform: translate(-50%, -25%);
                }
            }
            .single{
                height: 1.1vh!important;
                min-height: 0.6rem!important;
            }
            .single.first{
                     transform: translate(-50%, 25%);
            }
            .single.last{
                     transform: translate(-50%, -25%);
            }
            .first.last{
                transform: translate(-50%, 15%);
                height: 1.2vh;
                border-radius: 6px;
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