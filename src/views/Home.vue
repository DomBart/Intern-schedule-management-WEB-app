<template>
<body>
  <navi></navi>
  <!-- <div class="generaldata_container">
    <generaldata class="data_text">MĖNESIO VALANDŲ:</generaldata>
    <generaldata class="data_text">SAVAITĖS VALANDŲ:</generaldata>
    <generaldata class="data_text">VISO PRAKTIKANTŲ:</generaldata>
  </div> -->
  <studentlist></studentlist>
  <usermodal></usermodal>
  <confirmdialog></confirmdialog>
</body>
</template>

<script>
import Navi from '../components/Navigation.vue'
import Studentlist from '../components/StudentList.vue'
import Usermodal from '../components/UserCreateModal.vue'
import Confirmdialog from '../components/ConfirmDialog.vue'
export default {
  name: 'Pagrindinis',
  components: {Navi, Studentlist,  Usermodal, Confirmdialog},
  data () {
    return {
      
    }
  }
}
</script>

<style scoped lang='scss'>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Oswald&display=swap');
$base-color:#efefefef;
$main-color:#0054A6;
html, body{
      background-color:$base-color;
}
</style>
