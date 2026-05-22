import { useFieldArray, useForm } from 'vee-validate';

import { createUpdateProductAction, getProductById } from "@/modules/products/actions";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { defineComponent,  watch,  watchEffect , ref} from "vue";
import { useRouter } from "vue-router";
import * as yup from 'yup';
import CustomInput from '@/modules/common/components/CustomInput.vue';
import CustomTextArea from '@/modules/common/components/CustomTextArea.vue';
import { useToast } from 'vue-toastification';





const validationSchema = yup.object({
    category_id: yup.number().required().min(1, 'Debes seleccionar una categoría'),
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
    material: yup.string().nullable(),
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
        const toast = useToast();
        
        const {data: product, isError,isLoading, refetch} = useQuery({
            queryKey: ['product', props.productId],
            queryFn: () => getProductById(props.productId),
            retry: false,
        });


        const {mutate, isPending, isSuccess:isUpdateSuccess, data: updatedProduct} = useMutation({
            mutationFn: createUpdateProductAction
        });

        const { values, defineField, errors, handleSubmit, resetForm, meta} = useForm({
            validationSchema,
        });

        const productType = ref('shirt');
        watch(() => values.dimensions, (newVal) => {
            if (newVal) {
                productType.value = 'figure';
            }
        }, { immediate: true });
        
        const [categoryId, categoryIdAttrs] = defineField('category_id');
        const [name, nameAttrs] = defineField('name');
        const [slug, slugAttrs] = defineField('slug');
        const [description, descriptionAttrs] = defineField('description');
        const [price, priceAttrs] = defineField('price');
        const [stock, stockAttrs] = defineField('stock');
        const [gender, genderAttrs] = defineField('gender');
        const [dimensions, dimensionsAttrs] = defineField('dimensions');
        const [material, materialAttrs] = defineField('material');


        const {fields: sizes, remove: removeSize, push:pushSize} = useFieldArray<string>('sizes');
        const {fields: images} = useFieldArray<string>('images');


        const onSubmit = handleSubmit(async(values) => {
           mutate(values); 
            
        });


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


        watch(isUpdateSuccess, (value) =>{
            
            if(!value) return

            toast.success('Producto Actualizado Correctamente');


            //TODO: redireccion cuando se crea
            resetForm({
                values: updatedProduct.value,
            })

        });

        watch( () => props.productId, () =>{
            refetch();
        })

        return{
            //properties
            values,
            errors,
            meta,

            categoryId,
            categoryIdAttrs,
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
            material,
            materialAttrs,


            sizes,
            images,

            isPending,

            //getters
            allSizes:['XS', 'S', 'M', 'L', 'XL', 'XXL'],

            productType,
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