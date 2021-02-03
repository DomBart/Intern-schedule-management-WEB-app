<template>
<body>
  <navi></navi>
  <studentlist></studentlist>
  <TraineeModal></TraineeModal>
  <confirmdialog></confirmdialog>
</body>
</template>

<script>
import Navi from '../components/Navigation.vue'
import Studentlist from '../components/StudentList.vue'
import TraineeModal from '../components/TraineeCreateModal.vue'
import Confirmdialog from '../components/ConfirmDialog.vue'
export default {
  name: 'Pagrindinis',
  components: {Navi, Studentlist,  TraineeModal, Confirmdialog},
}
</script>

<style scoped lang='scss'>

</style>
