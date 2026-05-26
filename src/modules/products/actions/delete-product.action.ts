export const deleteProductAction = async (productId: string | number) => {
    try {
        const apiUrl = import.meta.env.VITE_SHOP_API_URL;
        const token = localStorage.getItem('token');

        const response = await fetch(`${apiUrl}/products/${productId}`, {
            method: 'DELETE', 
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al intentar eliminar el producto');
        }
        
        return true; 
    } catch (error) {
        console.log(error);
        throw error;
    }
}