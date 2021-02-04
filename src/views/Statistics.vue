<template>
<body>
    <navi></navi>
    <statisticstable></statisticstable>
    <confirmdialog></confirmdialog>
</body>
</template>

<script>
import Navi from '../components/Navigation.vue'
import Statisticstable from '../components/StatisticsTable.vue'
import Confirmdialog from '../components/ConfirmDialog.vue'
export default {
  components: {Navi, Statisticstable,Confirmdialog},
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
</style>