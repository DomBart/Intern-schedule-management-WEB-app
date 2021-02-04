<template>
  <div class="navi_container">
    <div class="navi_wrap">
        <img class="navi_img" src="../assets/logo.svg" alt="Teltonika">
        <div class="navi_links">
            <a class="unselectable" @click="push('Pagrindinis')" v-bind:class="{ text_active: $route.name == 'Pagrindinis'}">PAGRINDINIS</a>
            <a class="unselectable" @click="push('Tvarkarastis')" v-bind:class="{ text_active: $route.name == 'Tvarkarastis'}">GRAFIKAS</a>
            <a class="unselectable" @click="push('Statistika')" v-bind:class="{ text_active: $route.name == 'Statistika'}">STATISTIKA</a>
            <a class="unselectable" v-if="!empty" @click="toggleActive()" :class="{'text_active': listActive && currentIntern.length>0,}" >ŠIUO METU DIRBA : {{currentIntern.length}} 
            <img class="navi_trigger" v-show="currentIntern.length > 0" src="../assets/tick.svg" alt="" :class="{'active': listActive,}"></a>
            <div class="navi_students" :class="{'list_active': listActive}">
                <ul v-for="(item, index) in currentIntern" :key="index">
                  <li @click="routeSchedule(item.id)"><span class="list_name">{{item.name}}</span><span class="separator"> | </span>{{item.time}}</li>
                  <hr v-if="index + 1 != currentIntern.length">
                </ul>
            </div>
            <a class="unselectable" @click="push('Profilis')" v-bind:class="{ text_active: $route.name == 'Profilis'}">PROFILIS</a>
            <a class="unselectable" @click="logout()">ATSIJUNGTI</a>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return{
            listActive: false,
            config: {
                headers: { Authorization: `Bearer ${localStorage.token}` }
            },
            traineeData: [],
            empty: false,
            currentIntern: [],
        }
    },
    mounted(){
      this.getTrainees();
    },
    methods: {
        getTrainees(){
            axios.get('http://127.0.0.1:8000/api/trainee',this.config)
                .then((resp) => {
                    if(resp.data.trainees.length == 0){
                        this.empty = true;
                    } else {
                        this.empty = false;
                    }
                    this.traineeData = resp.data.trainees;
                    this.countCurrent();
                })
                .catch(error => {
                    if(error.response.data.message == "Route [login] not defined."){
                        if(this.$route.name != 'Prisijungimas'){
                        this.$router.push({name: 'Prisijungimas'});
                        }
                    }
                });
        },
        countCurrent(){
            var currentDate = new Date();
            for(let i = 0; i < this.traineeData.length; i++){
                for(let j= 0; j < this.traineeData[i].schedules.length; j++){
                    for(let k= 0; k < this.traineeData[i].schedules[j].months.length; k++){
                        if(this.traineeData[i].schedules[j].months[k].year == currentDate.getFullYear() &&  (this.traineeData[i].schedules[j].months[k].index-1) == currentDate.getMonth()){
                            for(let m= 0; m < this.traineeData[i].schedules[j].months[k].days.length; m++){
                                if(this.traineeData[i].schedules[j].months[k].days[m].index == currentDate.getDate()){
                                    let currentTime = currentDate.getMinutes() + (currentDate.getHours()*60);
                                    for(let n= 0; n < this.traineeData[i].schedules[j].months[k].days[m].times.length; n++){
                                        if(this.traineeData[i].schedules[j].months[k].days[m].times[n].time_from <= currentTime &&
                                         this.traineeData[i].schedules[j].months[k].days[m].times[n].time_to >= currentTime && 
                                         this.traineeData[i].schedules[j].months[k].days[m].times[n].type == "intern"){
                                            let time_from = this.traineeData[i].schedules[j].months[k].days[m].times[n].time_from;
                                            let time_to = this.traineeData[i].schedules[j].months[k].days[m].times[n].time_to;
                                            let data = { id: this.traineeData[i].id,
                                                         name: this.traineeData[i].firstname.charAt(0) + '. ' + this.traineeData[i].lastname,
                                                         time: ('0'+Math.floor(time_from/60)).slice(-2)+':'+('0'+(time_from%60).toString()).slice(-2) +
                                                                ' - ' + ('0'+Math.floor(time_to/60)).slice(-2)+':'+('0'+(time_to%60).toString()).slice(-2)
                                            };
                                            this.currentIntern.push(data);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            }
        },
        routeSchedule(id){
            this.$router.push({name: 'Tvarkarastis', params: {id: id}});
        },
        toggleActive(){
            if(this.listActive)
            this.listActive = false;
            else this.listActive = true;
        },
        logout(){
            this.$root.$emit('Alert', 'logout', 0, '', 'AR TIKRAI NORITE ATSIJUNGTI', '');
        },
        push(route){
            if(this.$route.name !== route){
            this.$router.push({name: route});
            }
        }
    }
}
</script>

<style scoped lang="scss">
.navi_wrap {
    background-color: #ffffff;
    width: 18rem;
    height: 100%;
    min-height: 800px;
    position: fixed;
    left: 0;
    border-radius: 0px 15px 15px 0px;
    z-index: 100;
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
    .navi_img {
        margin: auto;
        display: block;
        padding-top: 3rem;
        width: 12rem;
    }
    .navi_links{
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 12rem;
        margin: auto;
        margin-top: 8rem;
        a{
            font-family: 'Oswald';
            font-size: 1.2rem;
            color: #5c5c5c;
            text-decoration: none;
            margin-top: 1.5rem;
            cursor: pointer;
        }
        a:hover{
            color: #0054A6;
        }
        .text_active{
            color: #0054A6;
        }
        .navi_trigger{
            display: inline-block;
            width: 0.7rem;
            margin-left: 3px;
            -ms-transform: translateY(-35%);
            transform: translateY(-35%);
        }
        .active{
            content: url('../assets/tick_active.svg')
        }
        .navi_students{
            display: none;
            color: #5c5c5c;
            ul{
            font-size: 0.72rem;
            font-family: 'Open Sans';
            list-style-type: none;
            width: auto;
            }
            li{
            display: flex;
            justify-content: space-between;
            width: 95%;
            padding: 0.5rem 0 0.5rem 0;
            cursor: pointer;
            }
            .list_name{
                width: 55%;
            }
            li:hover{
                color:#0054A6;
            }
            .separator{
                color: #c4c4c4;
            }
            hr{
                border-top: 1px solid #c4c4c4;
                width: 100%;
                margin-left: -2.5%;
            }
        }
        .list_active{
            display: block;
        }
    }
}
</style>