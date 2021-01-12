<template>
<div>
<div class="modal_container">
        <div class="login_modal">
            <h1>PRISIJUNGIMAS</h1>
            <form @submit.prevent="login()">
            <div class="login_inputs">
                <label for="em">Vartotojo vardas</label>
                <input id="em" type="text" v-model="username" required>
                <label for="ps">Slaptažodis</label>
                <input id="ps" type="password" v-model="pass" required>
            </div>
            <span class="failed_text" v-if="failed">Login failed</span>
            <input class="login_submit" type="submit" value="PRISIJUNGTI">
            </form>
        </div>
    </div>
    <alert v-if="passed" v-bind:push="'/'">PRISIJUNGIMAS SĖKMINGAS!</alert>
</div>
</template>

<script>
import Alert from '../components/AlertDialog.vue'
import axios from 'axios'
export default {
    data(){
        return {
            username: "",
            pass: "",
            failed: false,
            passed: false
        }
    },
    methods:{
        login(){
            let info = {
                username : this.username,
                password : this.pass
            }
        axios.post('http://127.0.0.1:8000/api/auth/login', info)
        .then(response => {
             localStorage.token = response.data.access_token;
             console.log(response.data.access_token)
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
.login_modal{
    font-family: 'Open Sans';
    height: max-content;
    margin: auto;
    padding-bottom: 1rem;
    background: #ffffff;
    border-radius: 15px;
    padding: 3%;

    h1{
        color: #5C5C5C;
        text-align: center;
        font-family: 'Oswald';
        font-weight: 400;
        margin-bottom: 2rem;
    }

    .login_inputs{
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

    .login_submit{
        display: block;
        font-family: "Oswald";
        background-color:#0054a6;
        color: #f2f2f2;
        font-size: 1rem;
        margin: auto;
        padding: 0.5rem 2rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .failed_text{
    display: block;
    text-align: center;
    color: red;
    margin: 0.5rem auto;
    font-weight: 700;
}
}
</style>