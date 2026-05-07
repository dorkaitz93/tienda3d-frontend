<template>
    <div class="flex justify-center py-10 bg-gray-100 space-x-3">

        <button 
            :disabled="isFirtsPage"
            @click="onPageChange(page - 1)"
            class="flex items-center space-x-1.5 rounded-lg px-4 py-1.5 text-white bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-all"
        >
            <ArrowLeftIcon />
            <span>Anteriores</span>
        </button>

        <button 
            :disabled="!hasMoreData"
            @click="onPageChange(page + 1)"
            class="flex items-center space-x-1.5 rounded-lg px-4 py-1.5 text-white bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-all"
        >
            <span>Siguientes</span>
            <ArrowRightIcon />
        </button>
    </div>
</template>

<script lang="ts" setup>
import ArrowLeftIcon from '@/icons/ArrowLeftIcon.vue';
import ArrowRightIcon from '@/icons/ArrowRightIcon.vue';
import { useRouter } from 'vue-router';

interface Props{
    page: number;
    isFirtsPage:boolean;
    hasMoreData: boolean;
}

const props = defineProps<Props>();
const router = useRouter();

const onPageChange = (newPage: number) => {
    if (newPage <= 0) return;
    
   
    router.push({
        query: { page: newPage }
    });
};
</script>