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
export default {
  data() {
    return {
      title: "",
      name: "",
      alertState: false,
      mode: '',
      id: '',
      itemid: '',
    }
  },
  mounted(){
    this.$root.$on('Alert', (mode, id, itemid, title, name) => {
            this.alertState = true;
            this.mode = mode;
            this.id = id;
            this.itemid = itemid;
            this.title = title;
            this.name = name.toUpperCase();
        });
  },
  methods: {
    alertAction(){
      let config= {
                headers: { Authorization: `Bearer ${localStorage.token}` }
      };
      if(this.mode == 'delete'){
       axios.delete('http://127.0.0.1:8000/api/trainee/'+ this.id,config)
             .then(data => {
                 this.$root.$emit('Submited');
             })
             .catch(error => {
                if(error.response.data.message == "Route [login] not defined."){
                    if(this.$route.name != 'Prisijungimas'){
                            this.$router.push({name: 'Prisijungimas'});
                    }
                }
            });
      this.alertState = false;
      } else if(this.mode == 'scheduleDelete'){
          axios.delete('http://127.0.0.1:8000/api/schedule/'+this.id+'/'+this.itemid,config)
            .then(resp => {
              this.$root.$emit('ScheduleDeleted');
              this.alertState = false;
            })
            .catch(error => {
              if(error.response.data.message == "Route [login] not defined."){
                if(this.$route.name != 'Prisijungimas'){
                            this.$router.push({name: 'Prisijungimas'});
                }
              }
            });  
      } else if(this.mode == 'timeDelete'){
        axios.delete('http://127.0.0.1:8000/api/time/'+this.id+'/'+this.itemid[0]+'/'+this.itemid[1],config)
            .then(resp => {
              this.$root.$emit('TimeDeleted');
              this.alertState = false;
            })
            .catch(error => {
              if(error.response.data.message == "Route [login] not defined."){
                if(this.$route.name != 'Prisijungimas'){
                    this.$router.push({name: 'Prisijungimas'});
                }
              }
            });  
      }else if (this.mode == 'logout'){
        axios.post('http://127.0.0.1:8000/api/auth/logout','',config)
            .then((resp) => {
                if(this.$route.name != 'Prisijungimas'){
                            this.$router.push({name: 'Prisijungimas'});
                }
            })
            .catch(error => {
                if(error.response.data.message == "Route [login] not defined."){
                  if(this.$route.name != 'Prisijungimas'){
                      this.$router.push({name: 'Prisijungimas'});
                  }
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
    right: 0;
    position: fixed;
    display: flex;
    background: rgba(255,255,255,0.95);
    width: calc(100vw - 17rem);
    height: 100vh;
    padding: 0 1.5rem;
    z-index: 99;

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
        color: #0054a6;
        background-color:transparent;
        border: 3px solid #0054a6;
        font-size: 1.3rem;
        margin: 0.8rem auto 8% auto;
        padding: 0.6rem 0;
        border-radius: 5px;
        cursor: pointer;
        width: 30%;
      }
      button:hover{
        background-color:#0054a6;
        color: #f2f2f2;
      }
      .alert_accept{
        margin-right: 1rem;
      }
    }
}
</style>