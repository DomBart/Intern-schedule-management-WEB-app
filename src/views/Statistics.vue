<template>
<body>
    <navi></navi>
    <div class="generaldata_container">
        <generaldata class="data_text">PRAKTIKANTŲ</generaldata>
        <generaldata class="data_text">SUPLANUOTŲ PRAKTIKOS VALANDŲ</generaldata>
        <generaldata class="data_text">ATLIKTŲ PRAKTIKOS VALANDŲ</generaldata>
        <generaldata class="data_text">LAISVŲ VALANDŲ</generaldata>
    </div>
    <statisticstable></statisticstable>
    <confirmdialog></confirmdialog>
</body>
</template>

<script>
import Navi from '../components/Navigation.vue'
import Generaldata from '../components/StatisticsDataBlock.vue'
import Statisticstable from '../components/StatisticsTable.vue'
import Confirmdialog from '../components/ConfirmDialog.vue'
export default {
  components: {Navi, Generaldata, Statisticstable,Confirmdialog},
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
.generaldata_container{
  display: flex;
  padding: 1.5rem 0;
  min-width: 1300px;
  height: 9rem;
  margin: 0 1% 0 22rem;
  justify-content: space-between;
}
</style>