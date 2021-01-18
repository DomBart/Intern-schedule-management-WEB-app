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
    background: rgba(0, 0, 0, 0.8);
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
  border-radius: 4px;
  top: 50%;
  left: 50%;
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
    color: #f2f2f2;
    background-color: #0054A6;
    font-size: 0.9rem;
    padding: 0.8rem 2rem;
    border: solid black 1px;
    border-radius: 4px;
    cursor: pointer;
}
</style>