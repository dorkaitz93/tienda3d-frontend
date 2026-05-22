import { useFieldArray, useForm } from 'vee-validate';

import { createUpdateProductAction, getProductById } from "@/modules/products/actions";
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
    dimensions: yup.string().nullable().when('sizes',{
        is: (sizes: string[]) => !sizes || sizes.length === 0,
        then: (schema) => schema.required('Las dimensiones son obligatorias para las figuras.'),
        otherwise: (schema) => schema.nullable(),
    }),
    sizes: yup.array(),
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

        const { values, defineField, errors, handleSubmit, resetForm, meta} = useForm({
            validationSchema,
        });


        
        const [name, nameAttrs] = defineField('name');
        const [slug, slugAttrs] = defineField('slug');
        const [description, descriptionAttrs] = defineField('description');
        const [price, priceAttrs] = defineField('price');
        const [stock, stockAttrs] = defineField('stock');
        const [gender, genderAttrs] = defineField('gender');
        const [dimensions, dimensionsAttrs] = defineField('dimensions');


        const {fields: sizes, remove: removeSize, push:pushSize} = useFieldArray<string>('sizes');
        const {fields: images} = useFieldArray<string>('images');


        const onSubmit = handleSubmit(async(value) => {
            const product = await createUpdateProductAction(value);
            console.log({product});
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

            if( !product.value ) return;
            const p = product.value;

            const {size, ...rest} = p

            resetForm({
                values: {
                    sizes: size ? (Array.isArray(size) ? size : [size]) : [],

                    ...rest
                }
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
            meta,


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
            dimensions,
            dimensionsAttrs,

            sizes,
            images,
            //getters
            allSizes:['XS', 'S', 'M', 'L', 'XL', 'XXL'],


            //actions

            onSubmit,
            toggleSize,


            hasSize: (size: string) => {
                const currentSizes = sizes.value.map(s=>s.value);
                return currentSizes.includes(size)
            }
        };
    },
})