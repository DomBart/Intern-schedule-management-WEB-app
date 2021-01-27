<template>
  <div class="modal_container" v-if="modalState">
    <div class="download_modal">
      <img src="../assets/close_inactive.svg" alt="Close" class="close_modal_icon"
        @click="modalClose()">
      <h1 class="modal_title">{{title}}</h1>
      <form @submit.prevent="onSubmit">
      <div class="input_row_1">
        <div class="input_name_column">
          <label for="input_name">Praktikanto vardas</label>
          <input class="input_name" type="text" v-model='first_name' required>
          <label for="input_surname">Praktikanto pavardė</label>
          <input class="input_surname" type="text" v-model='last_name' required>
        </div>
      </div>
      <input class="add_user_submit" type="submit" value="ATSIŲSTI">
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
      first_name: "",
      last_name: "",
      id: 0,
      scheduleID: 0,
      modalState: false,
    }
  },
  mounted() { 
    this.$root.$on('DownloadModal', (fname, lname, id, scheduleID) => {
    this.title = "ATSIŲSTI TVARKARAŠTĮ";
    this.first_name = fname;
    this.last_name = lname;
    this.id = id;
    this.scheduleID = scheduleID;
    this.modalState = true;
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
            params: {
            firstname: this.first_name,
            lastname: this.last_name
            },
            headers: { Authorization: `Bearer ${localStorage.token}` },
            responseType: 'blob'
        };
        axios.get('http://127.0.0.1:8000/api/document/'+ this.id + '/' + this.scheduleID,config)
        .then((response) => {
            var fileURL = window.URL.createObjectURL(new Blob([response.data]));
            var fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', this.first_name + ' ' +  this.last_name + ' tvarkaraštis.docx');
            document.body.appendChild(fileLink);
            fileLink.click();
            this.modalClose();
        })
        .catch(error => {
            console.log(error.response.data.message);
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

<style scoped lang="scss">
.modal_container{
    top: 0;
    position: fixed;
    display: flex;
    background: rgba(255,255,255,0.95);
    width: calc(100vw - 17rem);
    right:0;
    height: 100vh;
    z-index: 99;

    .modal_title{
      text-align: center;
      font-family: 'Oswald';
      color: #5c5c5c;
      margin: auto;
      margin-top: 3rem;
      text-transform: uppercase;
      width: max-content;
    }
    .download_modal{
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
            margin:L auto;
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
            margin: 0 auto 1rem auto;
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
        font-size: 1rem;
        margin: 0.8rem auto;
        padding: 0.6rem 0;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        width: 20%;
      }
    }
}
</style>