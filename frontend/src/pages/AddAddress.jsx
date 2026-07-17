import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useAuthStore } from '../store/useAuthStore'
import { useAddressStore } from '../store/useAddressStore'
import { useNavigate } from 'react-router-dom'


// input field component
const InputField = ({ type, placeholder, name, handleChange, address }) => (
    <input
        className='w-full px-2 py-2.5 border border-gray-500/10 rounded outline-none text-gray-500 focus:border-primary transition'
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        name={name}
        value={address[name]}
        required
    />
)


function AddAddress() {

    const navigate = useNavigate();
    const [address, setAddress] = useState({
        FirstName: '',
        LastName: '',
        Email: '',
        Street: '',
        City: '',
        State: '',
        ZipCode: '',
        Country: '',
        Phone: '',
    })

    const { authUser } = useAuthStore();
    const { addAddress } = useAddressStore();




    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value
        }));
    }
    const onSubmitHandler = (e) => {
        e.preventDefault();
        if (authUser) {
            console.log("USER ID IN ADDRESS", authUser.id)
            addAddress({ address, UserId: authUser.id });
            navigate('/cart');
        }
    }


    return (
        <div className='mt-16 pb-16'>
            <p className='text-2xl md:text-3xl text-gray-500'>Add Shipping <span className='font-semibold text-primary'>Address</span></p>
            <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
                <div className='flex-1 max-w-md'>
                    <form action="" onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm'>
                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name='FirstName' type='text' placeholder='Firt Name' />
                            <InputField handleChange={handleChange} address={address} name='LastName' type='text' placeholder='Last Name' />
                        </div>
                        <InputField handleChange={handleChange} address={address} name='Email' type='text' placeholder='Email Address' />
                        <InputField handleChange={handleChange} address={address} name='Street' type='text' placeholder='Street' />

                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name='City' type='text' placeholder='City' />
                            <InputField handleChange={handleChange} address={address} name='State' type='text' placeholder='State' />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name='ZipCode' type='number' placeholder='Zip Code' />
                            <InputField handleChange={handleChange} address={address} name='Country' type='text' placeholder='Country' />
                        </div>
                        <InputField handleChange={handleChange} address={address} name='Phone' type='text' placeholder='Phone Number' />
                        <button className='w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase'>
                            Save Address
                        </button>
                    </form>
                </div>
                <img src={assets.add_address_iamge} alt="address image" />
            </div>
        </div>
    )
}

export default AddAddress