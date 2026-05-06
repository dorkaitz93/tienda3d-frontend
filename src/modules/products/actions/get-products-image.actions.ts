

export const getProductImageAction = (imagenName: string) =>{

  if (imagenName.includes('http')) return imagenName;

  const baseUrl = import.meta.env.VITE_SHOP_API_URL.replace('/api', '');

  return `${baseUrl}/storage/${imagenName}`;
}