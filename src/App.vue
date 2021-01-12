<template>
  <div id="app">

    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted(){
    if(localStorage.token === ""){
      this.$router.push('/admin');
    }
  }
}
</script>

<style>
* { margin:0; padding:0; box-sizing:border-box;}

</style>
