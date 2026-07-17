import React, { useState } from 'react'
import { assets, categories } from '../../assets/assets';
import { useProductStore } from '../../store/useProductStore.js';
import { Loader2 } from 'lucide-react';

function AddProduct() {
    const [files, setFiles] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [inStock, setInStock] = useState(true);

    const { addToProduct, isProductAdding } = useProductStore();

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const productData = {
                Name: name,
                Description: description.split('\n'),
                Price: Number(price),
                OfferPrice: Number(offerPrice),
                Category: category,
                InStock: inStock
            }
            const formData = new FormData();
            formData.append('productData', JSON.stringify(productData));
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i])
            }

            const success = await addToProduct(formData);
            if (success) {
                setFiles([]);
                setName('');
                setDescription('');
                setCategory('');
                setPrice('');
                setOfferPrice('');
                setInStock(true);
            }
        } catch (error) {
            console.error("Product add error:", error.message);
        }
    };

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <form onSubmit={onSubmitHandler} className="md:p-10 p-4 space-y-5 max-w-lg">
                <div>
                    <p className="text-base font-medium">Product Image</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {Array(4).fill('').map((_, index) => (
                            <label key={index} htmlFor={`image${index}`}>
                                <input onChange={(e) => {
                                    const updatedFiles = [...files];
                                    updatedFiles[index] = e.target.files[0];
                                    setFiles(updatedFiles);
                                }} type="file" id={`image${index}`} hidden />
                                <img className="max-w-24 cursor-pointer" src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area} alt="uploadArea" width={100} height={100} />
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                    <input onChange={(e) => setName(e.target.value)} name={name} value={name} id="product-name" type="text" placeholder="Type here" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                    <textarea onChange={(e) => setDescription(e.target.value)} name={description} value={description} id="product-description" rows={4} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" placeholder="Type here"></textarea>
                </div>
                <div className="w-full flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="category">Category</label>
                    <select onChange={(e) => setCategory(e.target.value)} name={category} value={category} id="category" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40">
                        <option value="">Select Category</option>
                        {categories.map((item, index) => (
                            <option key={index} value={item.path}>{item.path}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
                        <input onChange={(e) => setPrice(e.target.value)} value={price} name={price} id="product-price" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
                        <input onChange={(e) => setOfferPrice(e.target.value)} value={offerPrice} name={offerPrice} id="offer-price" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                </div>
                <button className="cursor-pointer px-8 py-2.5 bg-primary text-white font-medium rounded" disabled={isProductAdding}>
                    {isProductAdding ? (
                        <span className="flex items-center gap-2 font-medium">
                            <Loader2 className="size-5 animate-spin" />
                            Adding...
                        </span>) : (
                        "ADD"
                    )}
                </button>
            </form>
        </div>
    );

}

export default AddProduct