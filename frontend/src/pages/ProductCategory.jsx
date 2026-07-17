import React, { useEffect } from 'react'
import { useProductStore } from '../store/useProductStore'
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets';
import ProductCard from '../components/ProductCard';

function ProductCategory() {

    const { products,getProducts } = useProductStore();
    const { category } = useParams();

    const searchCategory = categories.find((item) => item.path.toLowerCase() === category);

    const filteredProducts = products.filter((product) => product.category.toLowerCase() === category);
    console.log(filteredProducts);
    
    return (
        <div className='mt-16'>
            {searchCategory && (
                <div className='flex flex-col items-end w-max'>
                    <p className='text-2xl font-medium'>{searchCategory.text}</p>
                    <div className='w-16 h-0.5 bg-primary rounded-full'></div>
                </div>
            )}
            {filteredProducts.length > 0 ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-6 lg:grid-cols-5 mt-6'>
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className='flex items-center justify-center h-[60hv]'>
                    <p className='text-2xl font-medium text-primary'>No Products found in this category.</p>
                </div>
            )}
        </div>
    )
}

export default ProductCategory