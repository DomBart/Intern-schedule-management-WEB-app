<template>
  <body>
  <div class="main_container">
  <navi></navi>
  <div class="select_trainee_container" v-if="selectTrainee">
    <h1>PASIRINKITE PRAKTIKANTĄ</h1>
    <img class="scroll_up" src="../assets/tick.svg" @click="scrollList(-1)" alt="">
    <table ref="studentTable">
      <tr class="student_table_row" v-for="item in studentList" :key="item.id">
          <td><img class="student_icon unselectable" src="../assets/student.svg" @click="studentSelect(item.id)" alt="Student icon"></td>
          <td class="student_name" @click="studentSelect(item.id)">{{item.firstname}} {{item.lastname}}</td>
      </tr>
    </table>
    <img class="scroll_down" src="../assets/tick.svg" @click="scrollList(1)" alt="">
  </div>
  <scheduleblock v-if="!selectTrainee && traineeID" v-bind:id="traineeID"></scheduleblock>
  <confirmdialog></confirmdialog>
  </div>
  </body>
</template>

<script>
import axios from 'axios';
import router from '../router/index'
import Navi from '../components/Navigation.vue'
import Scheduleblock from '../components/ScheduleBlock.vue'
import Confirmdialog from '../components/ConfirmDialog.vue'
export default {
    props: ['id'],
    components: {Navi, Scheduleblock, Confirmdialog},
    data () {
      return {
        selectTrainee: false,
        studentList: [],
        traineeID: undefined,
        config: {headers: { Authorization: `Bearer ${localStorage.token}` }}
      }
    },
    created() {
        this.interval = setInterval(() => this.refreshToken(), 300000);
    },
    mounted(){
      if(!this.id){
        this.selectTrainee = true;
        this.getStudents();
      }else{
        this.traineeID = this.id;
      }
    },
    beforeDestroy(){
      clearInterval(this.interval);
    },
    methods: {
      getStudents(){
            axios.get('http://127.0.0.1:8000/api/trainee',this.config)
            .then((resp) => {
              this.studentList = resp.data.trainees;
            })
            .catch(error => {
                if(error.response.data.message == "Route [login] not defined."){
                    router.push({name: 'Prisijungimas'});
                }
            });
      },
      studentSelect(id){
        this.traineeID = id;
        this.selectTrainee = false;
      },
      scrollList(dir){
        if(dir > 0){
          this.$refs.studentTable.scrollTop = this.$refs.studentTable.scrollTop+35;
        }
        else if(dir < 0){
          this.$refs.studentTable.scrollTop = this.$refs.studentTable.scrollTop-35;
        }
      }
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
                    router.push({name: 'Prisijungimas'});
                }
            });
    }
}
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Oswald&display=swap');
$base-color:#efefefef;
$main-color:#0054A6;
html, body{
      background-color:$base-color;
      height: 100vh;
      width: 100%;
}
.main_container{
  position: relative;
  display: block;
  height: 100%;
  width: 100%;
  overflow: auto;
  .select_trainee_container{
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 30%;
    min-width: 400px;
    height: 90%;
    background-color: #ffffff;
    border-radius: 15px;
    top: 50%;
    left: 50%;
    transform: translate(-40%, -50%);
    h1{
      color: #5C5C5C;
      text-align: center;
      font-family: 'Oswald';
      font-weight: 400;
      margin: 3rem 0;
      text-transform: uppercase;
    }
    table{
      display: block;
      font-family: 'Open Sans';
      height: 70%;
      width: max-content;
      margin: 0 auto;
      padding: 0 10%;
      overflow-y: scroll;
      scroll-behavior: smooth;
    }
    table::-webkit-scrollbar
    {
	  	display: none;
    }
    .scroll_up{
      width: 1rem;
      margin: 0 auto;
      margin-bottom: 1rem;
      transform: scaleY(-1);
      cursor: pointer;
    }
    .scroll_up:hover{
      content: url('../assets/tick_active.svg');
      transform: scaleY(1);
    }
    .scroll_down{
      width: 1rem;
      margin: 0 auto;
      margin-top: 1rem;
      cursor: pointer;
    }
    .scroll_down:hover{
      content: url('../assets/tick_active.svg');
      transform: scaleY(-1);
    }
    .student_table_row{
         display: flex;
         justify-content:start;
         height: max-content;
         text-align: center;
            td{
                 margin: auto 0;
                 font-size: 1rem;
                 color: #5c5c5c;
                 padding: 0 0.3rem;
                 white-space: nowrap;
            }

            .student_icon{
                 width: 43px;
                 cursor: pointer;
                 margin: 0.5rem 0;
                 z-index: 99;
            }

            .student_name{
                cursor: pointer;
                padding-left: 15%;
            }
            .student_name:hover{
                color:#0054A6;
            }
    }
  }
}
</style>