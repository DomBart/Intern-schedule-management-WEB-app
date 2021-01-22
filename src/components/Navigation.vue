<template>
  <div class="navi_container">
    <div class="navi_wrap">
        <img class="navi_img" src="../assets/logo.svg" alt="Teltonika">
        <div class="navi_links">
            <a class="unselectable" @click="push('Pagrindinis')" v-bind:class="{ text_active: $route.name == 'Pagrindinis'}">PAGRINDINIS</a>
            <a class="unselectable" @click="push('Tvarkarastis')" v-bind:class="{ text_active: $route.name == 'Tvarkarastis'}">GRAFIKAS</a>
            <a class="unselectable" @click="push('Statistika')" v-bind:class="{ text_active: $route.name == 'Statistika'}">STATISTIKA</a>
            <a class="unselectable" @click="toggleActive()" :class="{'text_active': listActive,}" >ŠIUO METU DIRBA : 5 
            <img class="navi_trigger" src="../assets/tick.svg" alt="" :class="{'active': listActive,}"></a>
            <div class="navi_students" :class="{'list_active': listActive}">
                <ul>
                  <li>Vardenis Pavardenis <span class="separator">|</span> 08:00 - 15:00</li>
                  <hr>
                  <li>Vardenis Pavardenis <span class="separator">|</span> 08:00 - 15:00</li>
                  <hr>
                  <li>Vardenis Pavardenis <span class="separator">|</span> 08:00 - 15:00</li>
                  <hr> 
                  <li>Vardenis Pavardenis <span class="separator">|</span> 08:00 - 15:00</li>
                  <hr> 
                  <li>Vardenis Pavardenis <span class="separator">|</span> 08:00 - 15:00</li> 
                </ul>
            </div>
            <a class="unselectable" @click="push('Profilis')" v-bind:class="{ text_active: $route.name == 'Profilis'}">PROFILIS</a>
            <a class="unselectable" @click="logout()">ATSIJUNGTI</a>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return{
            listActive: false,
            config: {
                headers: { Authorization: `Bearer ${localStorage.token}` }
            }
        }
    },
    methods: {
        toggleActive(){
            if(this.listActive)
            this.listActive = false;
            else this.listActive = true;
        },
        logout(){
            this.$root.$emit('Alert', 'logout', 0, '', 'AR TIKRAI NORITE ATSIJUNGTI', '');
        },
        push(route){
            if(this.$route.name !== route){
            this.$router.push({name: route});
            }
        }
    }
}
</script>

<style scoped lang="scss">
.navi_wrap {
    background-color: #ffffff;
    width: 18rem;
    height: 100%;
    min-height: 800px;
    position: fixed;
    left: 0;
    border-radius: 0px 15px 15px 0px;
    z-index: 100;
    .unselectable{
            -moz-user-select: -moz-none;
            -khtml-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
    }
    .navi_img {
        margin: auto;
        display: block;
        padding-top: 3rem;
        width: 12rem;
    }
    .navi_links{
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 12rem;
        margin: auto;
        margin-top: 8rem;
        a{
            font-family: 'Oswald';
            font-size: 1.2rem;
            color: #5c5c5c;
            text-decoration: none;
            margin-top: 1.5rem;
            cursor: pointer;
        }
        a:hover{
            color: #0054A6;
        }
        .text_active{
            color: #0054A6;
        }
        .navi_trigger{
            display: inline-block;
            width: 0.7rem;
            margin-left: 3px;
            -ms-transform: translateY(-35%);
            transform: translateY(-35%);
        }
        .active{
            content: url('../assets/tick_active.svg')
        }
        .navi_students{
            display: none;
            color: #5c5c5c;
            ul{
            font-size: 0.72rem;
            font-family: 'Open Sans';
            list-style-type: none;
            width: auto;
            padding-bottom: 0.5rem;
            }
            li{
            padding: 0.5rem 0 0.5rem 0;
            }
            .separator{
                color: #c4c4c4;
            }
            hr{
                border-top: 1px solid #c4c4c4;
                width: 105%;
                margin-left: -2.5%;
            }
        }
        .list_active{
            display: block;
        }
    }
}
</style>