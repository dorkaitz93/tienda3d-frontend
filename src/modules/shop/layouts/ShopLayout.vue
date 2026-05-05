<script setup lang="ts">
import CustomFooter from '../components/CustomFooter.vue';
import TopMenu from '../components/TopMenu.vue';

</script>

<template>
    <!-- header - navbar-->
    <TopMenu />


    <!-- RouterView -->
    
        <RouterView  />
    

    <!-- footer -->
    <CustomFooter />


</template>