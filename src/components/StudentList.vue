<template>
  <div class="main_container">
      <div class="list_control">
        <button class="student_add" @click="triggerModal('')"
        @mouseover="addIcon = require('../assets/add_active.svg')"
        @mouseout="addIcon = require('../assets/add.svg')">
        <img class="unselectable" :src="addIcon" alt="Add button"></button>
        <input type="text" v-model="search" @keyup.enter="searchFilter()" class="student_searchbar">
        <div class="filter_wrap">
            <div class="student_filter" v-bind:class="{ filter_active: filterActive }" @click="triggerFilter()">
                <h1 class="unselectable">FILTRUOTI</h1>
                <img class="filter_trigger unselectable" src="../assets/tick.svg" v-bind:class="{ active: filterState }" alt="">
            </div>
                <div class="filter_input_wrap" v-if="filterState" v-bind:class="{ filter_active: filterActive }">
                    <label for="StartDate">Pradžios data:</label>
                    <input id="StartDate" type="date" v-model="startDate" @change="enableFilter()">
                    <label for="EndDate">Pabaigos data:</label>
                    <input id="EndDate" type="date" v-model="endDate" @change="enableFilter()">
                    <button class="date_clear" v-bind:class="{ enabled: filterActive }" @click="clearFilter()">Išvalyti</button>
                </div>
        </div>
      </div>
      <div class="table_container">

          <table class="student_table">
              <tr class="student_table_header">
                  <th class="icon_column" ></th>
                  <th class="name_column unselectable" @click="sort('name')" v-bind:class="{ sort_active: currentSort==='name' }">
                      <img class="sort_trigger" src="../assets/sort.svg" 
                      v-bind:class="{ sort_dsc: currentSortDir==='dsc' && currentSort==='name', sort_asc: currentSortDir==='asc' && currentSort==='name'}" alt=""> 
                      VARDAS PAVARDĖ</th>
                  <th class="position_column unselectable" @click="sort('position')" v-bind:class="{ sort_active: currentSort==='position' }">
                      <img class="sort_trigger" src="../assets/sort.svg" 
                      v-bind:class="{ sort_dsc: currentSortDir==='dsc' && currentSort==='position', sort_asc: currentSortDir==='asc' && currentSort==='position'}" alt=""> 
                      POZICIJA</th>
                  <th class="hour_column unselectable" @click="sort('hours')" v-bind:class="{ sort_active: currentSort==='hours' }">
                      <img class="sort_trigger" src="../assets/sort.svg"
                      v-bind:class="{ sort_dsc: currentSortDir==='dsc' && currentSort==='hours', sort_asc: currentSortDir==='asc' && currentSort==='hours'}" alt=""> 
                      VALANDOS</th>
                  <th class="begin_column unselectable" @click="sort('startDate')" v-bind:class="{ sort_active: currentSort==='startDate' }">
                      <img class="sort_trigger" src="../assets/sort.svg"
                      v-bind:class="{ sort_dsc: currentSortDir==='dsc' && currentSort==='startDate', sort_asc: currentSortDir==='asc' && currentSort==='startDate'}" alt=""> 
                      PRADŽIA</th>
                  <th class="end_column unselectable" @click="sort('endDate')" v-bind:class="{ sort_active: currentSort==='endDate' }">
                      <img class="sort_trigger" src="../assets/sort.svg"
                      v-bind:class="{ sort_dsc: currentSortDir==='dsc' && currentSort==='endDate', sort_asc: currentSortDir==='asc' && currentSort==='endDate'}" alt=""> 
                      PABAIGA</th>
                  <th class="tool_column unselectable" >ĮRANKIAI</th>
              </tr>
              <tr class="student_table_row" v-bind="studentList.id" v-for="item in studentList.slice(offset, pageItems)" :key="item.id">
                  <td>
                      <div class="student_popup" :class="{popup_active:item.id == selected}">
                          <span class="pupup_label unselectable">TELEFONO NUMERIS</span>
                          <span class="pupup_text">{{item.phone_number}}</span>
                          <span class="pupup_label unselectable">EL. PAŠTO ADRESAS</span>
                          <span class="pupup_text">{{item.email}}</span>
                      </div>
                      <img class="student_icon unselectable" src="../assets/student.svg" :class="{top:item.id == selected}" @click="togglePopup(item.id)" alt="Student icon">
                  </td>
                  <td class="student_name" @click="routeSchedule(item.firstname,item.lastname,item.id)">{{item.firstname}} {{item.lastname}}</td>
                  <td>{{item.position}}</td>
                  <td>120/320 val.</td>
                  <td>2020/01/01</td>
                  <td>2020/04/31</td>
                  <td>
                      <img class="edit_icon unselectable" src="../assets/edit.svg" alt="Edit" @click="triggerModal(item)">
                      <img class="delete_icon unselectable" src="../assets/delete.svg" alt="Delete" @click="deleteStudent(item.id, item.firstname)">
                  </td>
              </tr>
          </table>
      </div>
      <div class="pagination_container">
        <paginate
          v-model="page"
          :page-count="pageCount"
          :click-handler="clickCallback"
          :prev-text="'Prev'"
          :next-text="'Next'"
          :next-class="'next_item'"
          :prev-class="'prev_item'"
          :container-class="'pagination'"
          :page-class="'page_item'">
        </paginate>
      </div>
  </div>
</template>

<script>
 import Vue from 'vue'
 import axios from 'axios'
 import Paginate from 'vuejs-paginate'
 import router from '../router/index'
 Vue.component('paginate', Paginate)
export default {
    data () {
      return {
        page: 0,
        filterState: false,
        studentList: [],
        pageCount: 0,
        offset: 0,
        pageItems: 6,
        startDate: "",
        endDate: "",
        filterActive: false,
        currentSort: "",
        currentSortDir: "",
        config: {
                headers: { Authorization: `Bearer ${localStorage.token}` }
        },
        addIcon: require("../assets/add.svg"),
        search: "",
        selected: undefined,
      }
    },
    mounted(){
        this.getStudents();
        this.$root.$on('Submited', () => {
            this.getStudents();
        });
    },
    methods: {
        clickCallback(pageNum){
            this.pageItems = pageNum * 6;
            this.offset = (pageNum * 6) - 6;
        },
        triggerModal(item){
            this.selected = undefined;
            this.$root.$emit('OpenModal', item);
        },
        triggerFilter(){
            if(this.filterState)
            this.filterState = false;
            else this.filterState = true;
        },
        togglePopup(id){
            if(this.selected === id){
                this.selected = undefined;
            } else {
                this.selected = id;
            }
        },
        enableFilter(){
            if(this.startDate != "" || this.endDate != ""){
                console.log(parseInt(this.startDate));
                this.filterActive = true;
            }
        },
        clearFilter(){
            if(this.filterActive)
            {
            this.startDate = "";
            this.endDate = "";
            this.filterActive = false;
            this.getStudents();
            }
        },
        searchFilter(){
            this.getStudents();
            this.page = 1;
            this.clickCallback(this.page);
        },
        routeSchedule(name,lastname,id){
            router.push({name: 'Tvarkarastis', params: {name: name,lastname: lastname, id: id}});
        },
        getStudents(){
            axios.get('http://127.0.0.1:8000/api/trainee',this.config)
            .then((resp) => {
                console.log(resp.data.trainees);
                 if(this.search != ""){
                    for(let i = 0; i < resp.data.trainees.length; i++)
                    {
                        let name = (resp.data.trainees[i].firstname).toLowerCase();
                        let last_name = (resp.data.trainees[i].lastname).toLowerCase();
                        if(name.includes(this.search.toLowerCase()) || last_name.includes(this.search.toLowerCase()))
                        { }
                        else {
                            resp.data.trainees.splice(i,1);
                            i--;
                        }
                    }
                 }
                  this.studentList = resp.data.trainees;
                 if(resp.data.trainees.length % 6 == 0)
                 {
                     this.pageCount = Math.floor(resp.data.trainees.length / 6);
                 }
                 else
                 {
                     this.pageCount = Math.floor(resp.data.trainees.length / 6) + 1;
                 }
            })
            .catch(error => {
                if(error.response.data.message == "Route [login] not defined."){
                    localStorage.token = "";
                    router.push('/admin');
                }
            });
        },
        deleteStudent(id,name){
            this.$root.$emit('Alert', 'delete', id, 'AR TIKRAI NORITE PAŠALINTI', name);
        },
        sort(type){
            let modifier = 1;
            if(this.currentSort != type){
                this.currentSort = type;
                this.currentSortDir = "dsc";
                modifier = 1;
            } else if (this.currentSort === type && this.currentSortDir === "dsc"){
                this.currentSortDir = "asc";
                modifier = -1;
            } else if (this.currentSort === type && this.currentSortDir === "asc"){
                this.currentSortDir = "";
                this.currentSort = "";
                this.getStudents();
            }
            if(this.currentSort === "name"){
                this.studentList.sort((a,b) => (a.firstname > b.firstname) ? modifier : -1);
            } else if (this.currentSort === "position"){
                this.studentList.sort((a,b) => (a.position > b.position) ? modifier : -1);
            }
        }
 }
}
</script>
<style scoped lang="scss">
  $color-text1: #5c5c5c;
 .main_container{
     background-color: #ffffff;
     margin: 0 4rem 0 22rem;
     height: 77%;
     border-radius: 15px;
    //  min-width: 800px;
     .list_control{
         display: flex;
         justify-content: space-between;
         width: 100%;
         height: max-content;
         padding: 3rem 8rem;
         font-family: 'Open Sans';
        .student_add{
            height: 5rem;
            width: 5rem;
            border-radius: 50%;
            background-color: #ffffff;
            border: 0;
            outline: none;
            box-shadow: 0px 0px 4px 4px rgba(0, 0, 0, 0.10);
            cursor:pointer;
        }
        .student_add:hover{
            box-shadow: 0px 0px 4px 4px rgba(0,84,166, 0.3);
        }
        .student_searchbar{
            font-size: 1.3rem;
            color: $color-text1;
            padding: 0.7rem;
            width: 50%;
            height: max-content;
            border: none;
            outline: none;
            margin-top: auto;
            margin-bottom: auto;
            background: url(../assets/search.svg) no-repeat 96% 52%;
            border-radius: 8px;
            box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.10);
        }
        .student_searchbar:focus{
            box-shadow: 0px 0px 4px 4px rgba(0,84,166, 0.3);
        }
        .filter_wrap{
            display: flex;
            flex-direction: column;
        }
        .student_filter{
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 0.8rem 2.5rem;
            height: 3rem;
            width: 16rem;
            background-color: #ffffff;
            border-radius: 8px;
            margin-top: auto;
            margin-bottom: auto;
            box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.10);
            cursor: pointer;
            h1{
                font-size: 1.25rem;
                line-height: 1.1;
                color: $color-text1;
            }      
        }
        .filter_trigger{
            display: inline-block;
            width: 0.8rem;
        }
        .active{
            -ms-transform: scaleY(-1);
            transform: scaleY(-1);
        }
        .filter_state{
            height: 1.1rem;
            width: 1.1rem;
            cursor: pointer;
        }
        .filter_state::after{
            outline: none;
        }
        .filter_input_wrap{
            position: absolute;
            display: flex;
            width: 16rem;
            flex-direction: column;
            margin-top: 5rem;
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
            .date_clear{
                display: block;
                font-family: "Oswald";
                background-color:#c4c4c4;
                color: #f2f2f2;
                font-size: 1rem;
                margin: 0.6rem auto 0rem auto;
                padding: 0.2rem 0;
                border: none;
                outline: none;
                border-radius: 5px;
                width: 30%;
            }
            .enabled{
                background-color:#0054a6;
                cursor: pointer;
            }
        }
        .filter_active{
            box-shadow: 0px 0px 4px 4px rgba(0,84,166, 0.3);
        }
     }
     .table_container{
         width: 85%;
         height: 65%;
         margin: auto;
         overflow: auto;

     }
     .student_table{
         display: flex;
         flex-direction: column;
         justify-content: space-evenly;
         font-family: 'Open Sans';

         tr th:nth-child(1) { width: 10%; padding-left: 3.5%; }
         tr th:nth-child(2) { width: 20%; }
         tr th:nth-child(3) { width: 15%; }
         tr th:nth-child(4) { width: 15%; }
         tr th:nth-child(5) { width: 15%; }
         tr th:nth-child(6) { width: 15%;}
         tr th:nth-child(7) { width: 10%; padding-right: 2.5%; }

         tr{
                border-bottom: 2px solid #c4c4c4;
                overflow: auto;
         }

        .student_table_header{
         display: flex;
         justify-content: space-around;
         color:#c4c4c4;
         padding-bottom: 0.8rem;
         font-size: 1rem;
         text-align: center;

         th{
            flex-basis: auto;
            white-space: nowrap;
            text-align: left;
            padding: 0 0.3rem;
            cursor: pointer;
         }
         th:last-child{
             cursor:default;
         }

         .sort_active{
             color: #0054A6;
         }

         .sort_dsc{
             content:url('../assets/sort_dsc.svg');
         }

         .sort_asc{
             content:url('../assets/sort_asc.svg');
         }

         .sort_trigger{
             width: 0.7rem;
             -ms-transform: translateY(-35%);
             transform: translateY(-35%);
         }

         }

         .student_table_row{
         display: flex;
         justify-content: space-evenly;

            td{
                 margin: auto 0;
                 font-size: 1rem;
                 color: #5c5c5c;
                 padding: 0 0.3rem;
                 white-space: nowrap;
            }

            td:nth-child(1) { width: 10%; padding-left: 3.5%; }
            td:nth-child(2) { width: 20%; }
            td:nth-child(3) { width: 15%; }
            td:nth-child(4) { width: 15%; }
            td:nth-child(5) { width: 15%; }
            td:nth-child(6) { width: 15%;}
            td:nth-child(7) { width: 10%; padding-right: 2.5%; }

            .student_icon{
                 width: 43px;
                 margin-top: 0.8rem;
                 margin-bottom: 0.5rem;
                 cursor: pointer;
                 z-index: 99;
            }

            .student_name{
                cursor: pointer;
            }
            .student_name:hover{
                color:#0054A6;
            }

            .top{
            position: relative;
            }

            .student_popup{
                position: absolute;
                display: none;
                flex-direction: column;
                justify-content: space-between;
                text-align: center;
                width: max-content;
                height: 180px;
                background-color: #ffffff;
                border-radius: 15px;
                margin: 4.5px 0;
                padding: 1rem;
                padding-top: 65px;
                transform: translateX(-37.5%);
                box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.10);
                z-index: 1;

                img{
                    margin: 0 auto 0.5rem auto;
                    width: 45px;
                }

                .pupup_label{
                    color: #c4c4c4;
                    font-size: 0.8rem;
                    font-weight: 600;
                }
                .pupup_text{
                    color: #5c5c5c;
                    font-size: 1rem;
                    font-weight: 600;
                }
            }
            .popup_active{
                display: flex;
            }

            .edit_icon{
                padding-right: 0.5rem;
                cursor: pointer;
            }
            .edit_icon:hover{
                content:url("../assets/edit_active.svg");
            }

            .delete_icon{
                cursor: pointer;
            }
            .delete_icon:hover{
                content:url("../assets/delete_active.svg");
            }
         }
     }

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
            user-drag: none;
    }
 }
</style>
<style lang="scss">
    .pagination_container{
        width: 100%;
        height: max-content;
        .pagination{
            display: flex;
            left: 50%;
            bottom: 3.5%;
            flex-direction: row;
            list-style-type: none;
            justify-content: center;
            padding: 1.2rem 0;
            color: #4F4F4F;
            font-size: 1.2rem;
            font-family: 'Open Sans';
            .next_item a, .prev_item a, .page_item a{
                padding: 5px;
                margin: 3px;
                outline-color: #0054A6;
                -moz-user-select: -moz-none;
                -khtml-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            .active a{
                color:#0054A6;
                font-weight: 700;
            }
        }
    }
</style>