<template>
<body>
  <navi></navi>
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
}
</script>

<style scoped lang='scss'>

</style>
