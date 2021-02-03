<template>
    <div class="alert_modal">
        <div class="alert_container">
            <h1><slot></slot></h1>
            <button @click="closeModal">OK</button>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        closeModal(){
            if(this.push === '')
            this.$root.$emit('Close');
            else
            this.$router.push(this.push);
        }
    },
    props: ['push']
}
</script>

<style scoped>
.alert_modal{
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    background: rgba(255,255,255,0.95);
    z-index: 99;
}
.alert_container{
  margin: 0;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 500px;
  height: 200px;
  background-color: #ffffff;
  border-radius: 15px;
  top: 50%;
  left: 50%;
  box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.10);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.alert_container h1{
    font-family: 'Oswald';
    color: #828282;
    margin: auto;
    padding-top: 1rem;
}
.alert_container button{
    margin: auto;
    color: #0054A6;
    background-color: transparent;
    font-size: 1rem;
    font-weight: 600;
    padding: 0.8rem 2rem;
    border: solid  2px #0054A6;
    border-radius: 6px;
    outline: none;
    cursor: pointer;
}
.alert_container button:hover{
    color: #f2f2f2;
    background-color: #0054A6;
}
</style>