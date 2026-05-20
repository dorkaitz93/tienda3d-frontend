import { computed, watch } from "vue";
import { useRoute } from "vue-router";


export const usePagination = () => {

    const route = useRoute();

    const page = computed(() => Number(route.query.page || 1));

     const search = computed(() => route.query.search?.toString() || '');

    const selectedCategory = computed(() => route.query.category_id?.toString() || '');


    watch(
    () => route.query.page,
    () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    return {
        page,
        search,
        selectedCategory
    }
}