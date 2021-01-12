<template>
  <div class="data_container">
      <h1><slot></slot></h1>
      <div class="data_count_wrap">
        <span class="data_count">{{data}}</span>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      data: 12,
    }
  }
}
</script>

<style scoped lang='scss'>
.data_container{
    display: table;
    font-family: 'Oswald';
    flex: 1;
    height: 100%;
    background: #ffffff;
    text-align: center;
    border-radius: 15px;
    margin-right: 6%;
    h1{
        position: relative;
        font-size: 2rem;
        color: #5c5c5c;
        font-weight: 400;
        vertical-align: middle;
        display: table-cell;
        padding: 1rem 1rem 1rem 3rem;
    }
    .data_count_wrap{
        display: flex;
        height: 100%;
        flex-direction: column;
        justify-content: center;
    }
    .data_count{
        color: #5c5c5c;
        line-height: 1;
        padding: 0 3rem 0rem 1rem;
        font-size: 6rem;
    }
}
.data_container:last-child{
    margin-right: 0;
}
</style>