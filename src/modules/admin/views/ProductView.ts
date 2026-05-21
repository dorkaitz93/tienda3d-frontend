import { useFieldArray, useForm } from 'vee-validate';

import { getProductById } from "@/modules/products/actions";
import { useQuery } from "@tanstack/vue-query";
import { defineComponent,  watch,  watchEffect } from "vue";
import { useRouter } from "vue-router";
import * as yup from 'yup';
import CustomInput from '@/modules/common/components/CustomInput.vue';
import CustomTextArea from '@/modules/common/components/CustomTextArea.vue';




const validationSchema = yup.object({
    name: yup.string().required().min(2),
    slug: yup.string().required(),
    description: yup.string().required(),
    price: yup.number().required().min(1),
    stock: yup.number().required().min(1),
    gender: yup.string().required(),
    size: yup.string().nullable(),
    dimensions: yup.string().nullable(),
});

export default defineComponent({

    components:{
        CustomInput,
        CustomTextArea,
    },
    props: {
        productId: {
            type: String,
            required: true
        }
    },

    setup(props){

        const router = useRouter();
        
        const {data: product, isError,isLoading} = useQuery({
            queryKey: ['product', props.productId],
            queryFn: () => getProductById(props.productId),
            retry: false,
        })

        const { values, defineField, errors, handleSubmit, resetForm} = useForm({
            validationSchema,
        });


        
        const [name, nameAttrs] = defineField('name');
        const [slug, slugAttrs] = defineField('slug');
        const [description, descriptionAttrs] = defineField('description');
        const [price, priceAttrs] = defineField('price');
        const [stock, stockAttrs] = defineField('stock');
        const [gender, genderAttrs] = defineField('gender');
        const [size, sizeAttrs] = defineField('size');
        const [dimensions, dimensionsAttrs] = defineField('dimensions');


        const {fields: sizes, remove: removeSize, push:pushSize} = useFieldArray<string>('sizes');
        const {fields: images} = useFieldArray<string>('images');


        const onSubmit = handleSubmit((value) => {

            console.log({value});
        })


        const toggleSize = (size: string) => {

            const currentSizes = sizes.value.map(s=>s.value);
            const hasSize = currentSizes.includes(size);

            if(hasSize){
                removeSize(currentSizes.indexOf(size));
            }else{
                pushSize(size);
            }

        }


        watchEffect(() => {
            if( isError.value && !isLoading.value){
                router.replace('/admin/products');
                return;
            }
        });
        
        watch(product, () => {

            if( !product ) return;

            resetForm({
                values: product.value
            });
        },
        {
                deep: true,
                immediate: true,
        });


        return{
            //properties
            values,
            errors,


            name,
            nameAttrs,
            slug,
            slugAttrs,
            description,
            descriptionAttrs,
            price,
            priceAttrs,
            stock,
            stockAttrs,
            gender,
            genderAttrs,
            size,
            sizeAttrs,
            dimensions,
            dimensionsAttrs,

            sizes,
            images,
            //getters
            allSizes:['XS', 'S', 'M', 'L', 'XL', 'XXL'],


            //actions

            onSubmit,
            toggleSize,
        };
    },
})