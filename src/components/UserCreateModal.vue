<template>
  <div class="modal_container" v-if="modalState">
    <div class="adduser_modal">
      <img src="../assets/close_inactive.svg" alt="Close" class="close_modal_icon"
        @click="modalClose()">
      <h1 class="modal_title">{{title}}</h1>
      <form @submit.prevent="onSubmit">
      <div class="input_row_1">
        <img class="add_user_photo" src="../assets/add_photo_inactive.svg" alt="Add user photo">
        <div class="input_name_column">
          <label for="input_name">Vardas</label>
          <input class="input_name" type="text" v-model='first_name' required>
          <label for="input_surname">Pavardė</label>
          <input class="input_surname" type="text" v-model='last_name' required>
        </div>
      </div>
      <div class="input_column_2">
        <label for="input_email">El. paštas</label>
        <input class="input_email" type="email" v-model='email' required>
        <label for="input_telephone">Telefono numeris</label>
        <input class="input_telephone" type="tel" v-model='tel' required>
        <label for="input_position">Pozicija</label>
        <input class="input_position" type="text" v-model='position' required>
      </div>
      <input class="add_user_submit" type="submit" value="ĮRAŠYTI">
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      title: "",
      mode: "",
      first_name: "",
      last_name: "",
      email: "",
      tel: "",
      position: "",
      id: '',
      modalState: false,
    }
  },
  mounted() { 
    this.$root.$on('OpenModal', (item) => {
     if(item === '')
     {
     this.mode = 'add';
     this.title = "PRIDĖTI PRAKTIKANTĄ";
     this.modalState = true;
     }
     else {
       this.mode = 'edit';
       this.title = "REDAGUOTI " + item.firstname + " DUOMENIS";
       this.id = item.id;
       this.first_name = item.firstname;
       this.last_name = item.lastname;
       this.email = item.email;
       this.tel = item.phone_number;
       this.position = item.position;

       this.modalState = true;
     }
    })
  },
  methods: {
    clear(){

      this.first_name = '';
      this.last_name = '';
      this.email = '';
      this.tel = '';
      this.position = '';

    },
    modalClose(){
      this.modalState = false;
      this.clear();
    },
    onSubmit(){
      let config= {
          headers: { Authorization: `Bearer ${localStorage.token}` }
      };

      let student = {
        firstname : this.first_name,
        lastname : this.last_name,
        email : this.email,
        phone_number : this.tel,
        position : this.position
      }

      if(this.mode === "add"){
        axios.post('http://127.0.0.1:8000/api/trainee', student, config)
        .then(data => {
          this.modalState = false;
          this.clear();
          this.$root.$emit('Submited');
        })
        .catch(error => {
              console.log(error.response.data);
                if(error.response.data.message == "Route [login] not defined."){
                    if(this.$route.name != 'Prisijungimas'){
                        this.$router.push({name: 'Prisijungimas'});
                    }
                }
        });
      } else if (this.mode === "edit"){
        axios.put('http://127.0.0.1:8000/api/trainee/'+this.id, student, config)
        .then(data => {
          this.modalState = false;
          this.clear();
          this.$root.$emit('Submited');
        })
        .catch(error => {
                console.log(error.response.data);
                if(error.response.data.message == "Route [login] not defined."){
                    if(this.$route.name != 'Prisijungimas'){
                        this.$router.push({name: 'Prisijungimas'});
                    }
                }
        });
      }

    }
  }
}
</script>

<style scoped lang="scss">
.modal_container{
    top: 0;
    position: fixed;
    display: flex;
    background: rgba(255,255,255,0.95);
    width: 100vw;
    height: 100vh;

    .modal_title{
      text-align: center;
      font-family: 'Oswald';
      color: #5c5c5c;
      margin: auto;
      margin-top: 3rem;
      text-transform: uppercase;
      width: max-content;
    }
    .adduser_modal{
      width: 600px;
      height: max-content;
      margin: auto;
      padding-bottom: 1rem;
      background: #ffffff;
      border-radius: 15px;
      box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.10);

        input{
            width: 100%;
            color: #5c5c5c;
            font-size: 1.2rem;
            padding: 0.5rem;
            outline: none;
            border: solid 2px #c4c4c4;
            border-radius: 10px;
        }

        label{
          position: relative;
          background-color: #ffffff;
          font-family: "Open Sans", sans-serif;
          font-size: 0.9rem;
          color: #969696;
          bottom: -0.6rem;
          margin-left: 1.5rem;
          margin-right: auto;
          padding: 0 5px 0 5px;
        }

        .close_modal_icon{
          position: relative;
          float: right;
          margin: 1.1rem 1.2rem;
          width: 1.2rem;
          cursor: pointer;
        }

        .close_modal_icon:hover{
            content:url('../assets/close_active.svg')
          }

        .input_row_1{
          display: flex;
          flex-direction: row;
          margin: 2rem 0 1.5rem 0;

          .add_user_photo{
            margin-left: 10%;
            display: inline-block;
            width: 20%;
            cursor: pointer;
          }

          .add_user_photo:hover{
            content:url('../assets/add_photo_active.svg')
          }

          .input_name_column{
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 0 10% 0 8%;
            width: 75%;
            .input_name{
              margin-bottom: 1.5rem;
            }
          }
        }

      .input_column_2{
        display: flex;
        flex-direction: column;
        padding: 0 10%;

        input{
          margin-bottom: 1.5rem;
        }
      }
      .add_user_submit{
        display: block;
        font-family: "Oswald";
        background-color:#0054a6;
        color: #f2f2f2;
        font-size: 1.3rem;
        margin: 0.8rem auto;
        padding: 0.6rem 0;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        width: 30%;
      }
    }
}
</style>