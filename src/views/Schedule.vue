<template>
  <body>
  <div class="main_container">
  <navi></navi>
  <div class="generaldata_container">
    <generaldata class="data_text">VALANDŲ ŠIĄ SAVAITĘ:</generaldata>
    <generaldata class="data_text">VALANDŲ ŠĮ MĖNESĮ:</generaldata>
    <generaldata class="data_text">BENDRA VALANDŲ SUMA:</generaldata>
  </div>
  <scheduleblock v-bind:name="name" v-bind:lastname="lastname" v-bind:id="id"></scheduleblock>
  </div>
  </body>
</template>

<script>
import Navi from '../components/Navigation.vue'
import Generaldata from '../components/DataBlock.vue'
import Scheduleblock from '../components/ScheduleBlock.vue'
export default {
    props: ['name','lastname','id'],
    components: {Navi, Generaldata, Scheduleblock},
}
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Oswald&display=swap');
$base-color:#efefefef;
$main-color:#0054A6;
html, body{
      background-color:$base-color;
      height: 100vh;
      width: 100%;
}
.main_container{
  display: block;
  height: 100%;
  width: 100%;
  overflow: auto;
  .generaldata_container{
    display: flex;
    padding: 1% 0;
    height: max-content;
    min-width: 1300px;
    margin: 0 4rem 0.5rem 22rem;
    justify-content: space-between;
    .data_text{
      margin-right: 1rem;
      padding: 1rem 0;
    }
    .data_text:last-child{
      margin:0;
    }
  }
}
</style>