<template>
<div>
<div class="modal_container">
        <div class="modal">
            <h1 v-if="mode == 'login'">PRISIJUNGIMAS</h1>
            <h1 v-if="mode == 'register'">REGISTRACIJA</h1>
            <form @submit.prevent="formSubmit()">
            <div class="form_inputs">
                <label for="fn" v-if="mode == 'register'">Vardas</label>
                <input id="fn" v-if="mode == 'register'" type="text" v-model="firstname" required>
                <label for="ln" v-if="mode == 'register'">Pavardė</label>
                <input id="ln" type="text" v-if="mode == 'register'" v-model="lastname" required>
                <label for="us">Vartotojo vardas</label>
                <input id="us" type="text" v-model="username" required>
                <label for="em" v-if="mode == 'register'">El. pašto adresas</label>
                <input id="em" type="email" v-if="mode == 'register'" v-model="email" required>
                <label for="pos" v-if="mode == 'register'">Pozicija</label>
                <input id="pos" type="text" v-if="mode == 'register'" v-model="position" required>
                <label for="ps">Slaptažodis</label>
                <input id="ps" type="password" v-model="pass" minlength="6" required>
                <label for="psr" v-if="mode == 'register'">Pakartokite slaptažodį</label>
                <input id="psr" v-if="mode == 'register'" type="password" v-model="passrep" minlength="6" required>
            </div>
            <span class="failed_text" v-if="failed && mode == 'login'">Prisijungimas nesėkmingas</span>
            <span class="failed_text" v-if="failed && mode == 'register'">Registracija nesėkminga</span>
            <span class="failed_text" v-if="missmatch && mode == 'register'">Slaptažodžiai nesutampa</span>
            <input class="form_submit" v-if="mode == 'login'" type="submit" value="PRISIJUNGTI">
            <input class="form_submit" v-if="mode == 'register'" type="submit" value="REGISTRUOTIS">
            </form>
            <a class="mode unselectable" v-if="mode == 'login'" @click="mode='register'">REGISTRUOTIS</a>
            <a class="mode unselectable" v-if="mode == 'register'" @click="mode='login'">PRISIJUNGTI</a>
        </div>
    </div>
    <alert v-if="passed && mode == 'login'" v-bind:push="'/'">PRISIJUNGIMAS SĖKMINGAS!</alert>
    <alert v-if="passed && mode == 'register'" v-bind:push="'/'">REGISTRACIJA SĖKMINGA!</alert>
</div>
</template>

<script>
import Alert from '../components/AlertDialog.vue'
import axios from 'axios'
export default {
    data(){
        return {
            firstname: "",
            lastname: "",
            email: "",
            username: "",
            pass: "",
            passrep: "",
            position: "",
            failed: false,
            missmatch: false,
            passed: false,
            mode: "login"
        }
    },
    methods:{
        formSubmit(){
            if(this.mode == 'login'){
                this.login();
            }else if (this.mode == 'register'){
                this.register();
            }
    },
    register(){
                let info = {
                    firstname : this.firstname,
                    lastname : this.lastname,
                    username : this.username,
                    email : this.email,
                    position: this.position,
                    password : this.pass
                }
            if(this.pass == this.passrep){
                axios.post('http://127.0.0.1:8000/api/auth/register', info)
                .then(response => {
                    console.log(response.data)
                    this.login();
                    })
                    .catch((error) => {
                        this.failed = true;
                    })
                } else{
                this.missmatch = true;
            }
    },
    login(){
                let info = {
                    username : this.username,
                    password : this.pass
                }
            axios.post('http://127.0.0.1:8000/api/auth/login', info)
            .then(response => {
                localStorage.token = response.data.access_token;
                this.failed = false;
                this.passed = true;
                })
                .catch((error) => {
                    this.failed = true;
                })
    }
    },
    components: { Alert }
}
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Oswald&display=swap');
.modal_container{
    background: #efefef;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
}
.modal{
    position: relative;
    font-family: 'Open Sans';
    height: max-content;
    width: max-content;
    margin: auto;
    padding-bottom: 1rem;
    background: #ffffff;
    border-radius: 15px;
    padding: 70px;
    padding-top: 80px;

    h1{
        color: #5C5C5C;
        text-align: center;
        font-family: 'Oswald';
        font-weight: 400;
        margin-bottom: 2rem;
    }

    .mode{
        position: absolute;
        font-size: 0.9rem;
        color:#c4c4c4;
        font-family: 'Oswald';
        top: 20px;
        right: 30px;
        text-decoration: none;
        cursor: pointer;
    }
    .mode:hover{
        color:#0054a6;
    }

    .form_inputs{
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;

        input{
            color: #5C5C5C;
            font-size: 1rem;
            border: 2px solid #c4c4c4;
            border-radius: 7px;
            padding: 0.5rem;
            margin-bottom: 1rem;
            width: 18rem;
            outline: none;
        }
        label{
            color: #c4c4c4;
            margin-left: 0.5rem;
            margin-bottom: 0.25rem;
        }
    }

    .form_submit{
        display: block;
        font-family: "Oswald";
        background-color:transparent;
        color: #c4c4c4;
        font-size: 1rem;
        margin: auto;
        padding: 0.5rem 2rem;
        border: 2px solid #c4c4c4;
        border-radius: 5px;
        cursor: pointer;
    }
    .form_submit:hover{
        background-color:#0054a6;
        color: #f2f2f2;
        border-color: transparent;
    }

    .failed_text{
    display: block;
    text-align: center;
    color: red;
    margin: 0.8rem auto;
    font-weight: 700;
}
}
</style>