<template>
  <div v-if="alertState" class="modal_container">
    <div class="alert_modal">
        <h1 class="alert_title">{{title}} {{name}} ?</h1>
        <button class="alert_accept" @click="alertAction()">TAIP</button>
        <button class="alert_deny" @click="alertState = false">NE</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import router from '../router/index'
export default {
  data() {
    return {
      title: "",
      name: "",
      alertState: false,
      mode: '',
      id: '',
      config: {
           headers: { Authorization: `Bearer ${localStorage.token}` }
      }
    }
  },
  mounted(){
    this.$root.$on('Alert', (mode, id, title, name) => {
            console.log('runs');
            this.alertState = true;
            this.mode = mode;
            this.id = id;
            this.title = title;
            this.name = name.toUpperCase();
        });
  },
  methods: {
    alertAction(){
      if(this.mode === 'delete'){
       axios.delete('http://127.0.0.1:8000/api/trainee/'+ this.id,this.config)
             .then(data => {
                 this.$root.$emit('Submited');
             })
             .catch(error => {
                if(error.response.data.message == "Route [login] not defined."){
                    localStorage.token = "";
                    router.push('/admin');
                }
            });
      this.alertState = false;
      } else if (this.mode === 'logout'){
        axios.post('http://127.0.0.1:8000/api/auth/logout',this.config)
            .then((resp) => {
                localStorage.token = "";
                router.push('/admin');
            })
            .catch(error => {
                if(error.response.data.message == "Route [login] not defined."){
                    localStorage.token = "";
                    router.push('/admin');
                }
            });
        this.alertState = false;
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

    .alert_modal{
      width: max-content;
      height: max-content;
      margin: auto;
      padding-bottom: 1rem;
      background: #ffffff;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.10);

      h1{
        padding: 8% 3rem 5% 3rem;
        font-family: 'Oswald';
        color: #5c5c5c;
      }
      
      button{
        font-family: "Oswald";
        color: #f2f2f2;
        background-color:#c4c4c4;
        font-size: 1.3rem;
        margin: 0.8rem auto 8% auto;
        padding: 0.6rem 0;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        width: 30%;
      }
      button:hover{
        background-color:#0054a6;
      }
      .alert_accept{
        margin-right: 1rem;
      }
    }
}
</style>