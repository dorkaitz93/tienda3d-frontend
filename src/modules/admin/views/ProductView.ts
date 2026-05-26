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
    gender: yup.string().when('category_id',{
        is:2,
        then:(schema) => schema.required('el genero es obligatorio'),
        otherwise: (schema) => schema.nullable().notRequired(),
    }),
    dimensions: yup.string().nullable().when('category_id',{
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
        const imageFiles = ref<File[]>([]);

        const onSubmit = handleSubmit(async(values) => {

            const productToSave = {
                ...values,
                image: imageFiles.value[0] || null
            }
            mutate(productToSave as any); 
            
        });


        const toggleSize = (size: string) => {

            const currentSizes = sizes.value.map(s=>s.value);
            const hasSize = currentSizes.includes(size);

            if(hasSize){
                removeSize(currentSizes.indexOf(size));
            }else{
                pushSize(size);
            }

        };

        const onFileChanged = (event: Event) =>{
            const fileInput = event.target as HTMLInputElement;
            const filesList = fileInput.files;

            if(!filesList) return;
            if(filesList.length === 0) return;

            for (const imageFile of filesList){

                imageFiles.value.push(imageFile)
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

            const {size,category,images, ...rest} = p

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
            const productData = updatedProduct.value?.data;

            if (productData) {

                router.replace(`/admin/products/${productData.id}`);

                resetForm({
                    values: productData,
                });
            }

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
            imageFiles,
            onFileChanged,

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
            },

            temporalImageUrl: (imageFile: File) =>{
                return URL.createObjectURL(imageFile);
            }
        };
    },
})