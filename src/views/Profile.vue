<template>
<div class="main_wrapper">
<div class="main_container">
  <navi></navi>
  <div class="select_trainee_container">
    <h1>VARTOTOJO PROFILIS</h1>
    <ul v-if="!edit" class="user_data">
        <label for="Name">Vardas Pavardė</label>
        <li id="Name">{{userData.firstname}} {{userData.lastname}}</li>
        <label for="Username">Vartotojo vardas</label>
        <li id="Username">{{userData.username}}</li>
        <label for="Email">El. pašto adresas</label>
        <li id="Email">{{userData.email}}</li>
        <label for="Position">Pozicija</label>
        <li id="Position">{{userData.position}}</li>
    </ul>
    <button v-if="!edit" @click="edit = true">REDAGUOTI</button>
    <form v-if="edit" @submit.prevent="userEdit()">
        <label for="Name">Vardas</label>
        <input type="text" v-model="editName" id="Name" required>
        <label for="Surname">Pavardė</label>
        <input type="text" v-model="editSurname" id="Surname" required>
        <label for="Email">El. pašto adresas</label>
        <input type="email" v-model="editEmail" id="Email" required>
        <label for="Position">Pozicija</label>
        <input type="text" v-model="editPosition" id="Position" required>
        <div class="button_wrap">
            <input class="edit_submit" v-if="edit" type="submit" value="IŠSAUGOTI">
            <button v-if="edit" @click="edit = false">ATŠAUKTI</button>
        </div>
    </form>
  </div>
</div>
<alert v-if="passed" v-bind:push="''">REDAGAVIMAS SĖKMINGAS!</alert>
<confirmdialog></confirmdialog>
</div>
</template>

<script>
import axios from 'axios'
import Alert from '../components/AlertDialog.vue'
import Navi from '../components/Navigation.vue'
import Confirmdialog from '../components/ConfirmDialog.vue'
export default {
name: 'Profilis',
components: {Navi, Alert,Confirmdialog},
data () {
    return {
        userData: {},
        editName: '',
        editSurname: '',
        editEmail: '',
        editPosition: '',
        edit: false,
        passed: false
    }
},
created() {
        this.interval = setInterval(() => this.refreshToken(), 300000);
},
mounted(){
    this.getUserData();
    this.$root.$on('Close', () => {
        this.getUserData();
        this.edit = false;
        this.passed = false;
    });
},
beforeDestroy(){
    clearInterval(this.interval);
},
methods:{
    getUserData(){
        let config= {
            headers: { Authorization: `Bearer ${localStorage.token}` }
        };
        axios.get('http://127.0.0.1:8000/api/auth',config)
            .then((resp) => {
                this.userData = resp.data;
                this.editName = resp.data.firstname;
                this.editSurname = resp.data.lastname;
                this.editEmail = resp.data.email;
                this.editPosition = resp.data.position;
                this.refreshToken();
            })
            .catch(error => {
                if(error.response.data.message == "Route [login] not defined."){
                    if(this.$route.name != 'Prisijungimas'){
                        this.$router.push({name: 'Prisijungimas'});
                    }
                }
            });
    },
    userEdit(){
        let config= {
            headers: { Authorization: `Bearer ${localStorage.token}` }
        };
        let editData= {
            firstname: this.editName,
            lastname: this.editSurname,
            position: this.editPosition,
            email: this.editEmail
        };
        axios.put('http://127.0.0.1:8000/api/auth',editData,config)
        .then((resp) => {
            this.passed = true;
        })
        .catch(error => {
            console.log(error.response.data);
            if(error.response.data.message == "Route [login] not defined."){
                if(this.$route.name != 'Prisijungimas'){
                    this.$router.push({name: 'Prisijungimas'});
                }
            }
        });
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
                    if(this.$route.name != 'Prisijungimas'){
                        this.$router.push({name: 'Prisijungimas'});
                    }
                }
            });
    }
}
}
</script>

<style scoped lang='scss'>
.main_wrapper{
    min-width: 730px;
}
.alert_modal{
    width: calc(100vw - 17rem)!important;
    margin-left: 17rem!important;
}
.main_container{
  display: flex;
  justify-content: center;
  height: 100vh;
  width: calc(100vw - 18rem);
  float: right;
  h1{
      font-family: 'Oswald';
      font-weight: 400;
      color: #5c5c5c;
      margin: 2rem 0;
  }
  .select_trainee_container{
    display: flex;
    flex-direction: column;
    margin: auto 0;
    text-align: center;
    width: 40%;
    min-width: 400px;
    height: max-content;
    background-color: #ffffff;
    border-radius: 15px;
    
    .user_data{
        display: flex;
        flex-direction: column;
        font-family: 'Open Sans';
        text-align: center;
        margin: 1rem auto;
        width: 60%;
        list-style-type:none;
    }
    form{
        font-family: 'Open Sans';
        display: flex;
        flex-direction: column;
    }
    label{
        color: #c4c4c4;
        font-weight: 600;
        text-transform: uppercase;
        margin-top: 0.5rem;
    }
    li{
        color: #5c5c5c;
        margin-left: 0.5rem;
        font-size: 1.5rem;
    }
    input{
            color: #5C5C5C;
            font-size: 1rem;
            border: 2px solid #c4c4c4;
            border-radius: 7px;
            padding: 0.5rem;
            margin: 0.2rem auto 1rem auto;
            width: 18rem;
            outline: none;
    }
    button,.edit_submit{
        display: block;
        font-family: "Oswald";
        background-color:#0054a6;
        color: #f2f2f2;
        font-size: 1rem;
        padding: 0.6rem 0;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin: 7rem auto 3rem auto;
        width: 7rem;
    }
    .button_wrap{
        display: flex;
        justify-content: space-between;
        width: 18rem;
        margin: 3rem auto;
        button, .edit_submit{
            margin: 0 0.5rem;
        }
    }
  }
}
</style>