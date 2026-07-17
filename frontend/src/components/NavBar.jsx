import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';


function NavBar() {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { authUser, loginUserWindow, userLogOut, isSeller } = useAuthStore();
    const navigate = useNavigate();
    const { setSearchQueryData } = useProductStore();
    const { getCartCount, totalCount, cartItems } = useCartStore();


    useEffect(() => {
        if (searchQuery.length > 0) {
            setSearchQueryData(searchQuery);
            navigate("/all-products");
        }

        if (searchQuery.length == 0) {
            setSearchQueryData("");
        }

    }, [searchQuery]);

    useEffect(() => {
        getCartCount();
    }, [cartItems]);

    const handleLoginClick = () => {
        loginUserWindow(true);
    };

    const handleLogOut = () => {
        if (authUser) {
            userLogOut();
            navigate('/');
        }
    }

    const handleLogoClick = () => {
        if (authUser && isSeller) {
            navigate("/seller");
        } else if (authUser && isSeller == false) {
            navigate("/");
        }
    }
    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

            <NavLink to="/" onClick={() => {
                setOpen(false);
                handleLogoClick();
            }}>
                <img className="h-20 w-25 font-bold" src={assets.logo} alt="FreshDrop" />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/all-products">All Products</NavLink>
                <NavLink to="/contact">Contact</NavLink>

                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input onChange={(e) => setSearchQuery(e.target.value)} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" />
                    <img src={assets.search_icon} alt="search" className='w-4 h-4' />
                </div>

                <div onClick={() => { navigate('/cart'); }} className="relative cursor-pointer">
                    <img src={assets.nav_cart_icon} alt="cart" className='w-6 opacity-80' />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{totalCount}</button>
                </div>

                {!authUser ? (<button onClick={handleLoginClick} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full">
                    Login
                </button>) : (
                    <div className='relative group'>
                        <img src={assets.profile_icon} alt="profile image" className='w-10' />
                        <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40'>
                            <li onClick={() => { navigate('/my-orders'); }} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>My Orders</li>
                            <li onClick={handleLogOut} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>Log Out</li>
                        </ul>
                    </div>
                )}
            </div>
            <div className='flex items-center gap-6 sm:hidden'>
                <div onClick={() => { navigate('/cart'); }} className="relative cursor-pointer">
                    <img src={assets.nav_cart_icon} alt="cart" className='w-6 opacity-80' />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{totalCount}</button>
                </div>
                <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="">
                    {/* Menu Icon SVG */}
                    <img src={assets.menu_icon} alt="menu" />
                </button>
            </div>

            {/* Mobile Menu */}
            {
                open && (<div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] right-4 bg-white shadow-md py-4 flex flex-col items-start gap-2 px-5 text-sm rounded-md z-50 min-w-[150px]`}>
                    <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
                    <NavLink to="/allproducts" onClick={() => setOpen(false)}>All Products</NavLink>
                    {authUser &&
                        <NavLink to="/myorders" onClick={() => setOpen(false)}>My Orders</NavLink>
                    }
                    <NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>
                    {!authUser ? (
                        <button
                            onClick={() => {
                                setOpen(false);
                                handleLoginClick;
                            }
                            } className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
                            Login
                        </button>
                    ) : (
                        <button onClick={handleLogOut} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
                            LogOut
                        </button>
                    )}

                </div>)
            }

        </nav >
    )
}

export default NavBar