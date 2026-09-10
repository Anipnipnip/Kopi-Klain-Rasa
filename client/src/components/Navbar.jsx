import React, { useEffect, useRef, useState } from 'react'
import { assets } from '../assets/assets.js'
import { NavLink } from 'react-router-dom'
import { useAppContext } from '../context/AppContext.jsx'
import toast from 'react-hot-toast'

// ✅ SVG inline — 0 KiB, tidak ada network request, tidak ada layout shift
const CartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
)

const Navbar = () => {

    const [open, setOpen] = React.useState(false)
    const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const inputRef = useRef(null)

    const {user, setUser, setShowUserLogin, navigate, searchQuery, setSearchQuery, getCartCount, axios} = useAppContext();

    const logout = async() => {
        try {
            const { data } = await axios.get('/api/user/logout');
            if(data.success){
                toast.success(data.message);
                setUser(null);
                navigate('/')
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if(searchQuery.length > 0){
            navigate("/products")
        }
    }, [searchQuery])

    useEffect(() => {
        if(searchOpen && inputRef.current){
            inputRef.current.focus()
        }
    }, [searchOpen])

    const scrollToSection = (id) => {
        if (window.location.pathname !== "/") {
            navigate("/");
            setTimeout(() => {
                const el = document.getElementById(id);
                if(el) el.scrollIntoView({ behavior: "smooth" });
            }, 100);
        } else {
            const el = document.getElementById(id);
            if(el) el.scrollIntoView({ behavior: "smooth" });
        }
        setOpen(false);
    }

    return (
        <>
        <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-300 px-6 md:px-16 lg:px-24 xl:px-32 py-3 flex items-center justify-between shadow-md">
            
            {/* LOGO — ✅ width & height eksplisit mencegah layout shift */}
            <button 
                onClick={() => {
                    if (window.location.pathname !== "/") {
                        navigate("/");
                        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
                    } else {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                    setOpen(false);
                }}
                className="flex items-center"
            >
                <img
                    src={assets.logo}
                    alt="Klain Rasa"
                    width={176}
                    height={60}
                    className="h-12 md:h-[60px]"
                    style={{ aspectRatio: '176/60' }}
                />
            </button>

            {/* DESKTOP */}
            <div className="hidden sm:flex items-center gap-8">

                <button 
                    onClick={() => scrollToSection("home")}
                    className="font-medium hover:text-yellow-600 transition"
                >
                    Home
                </button>

                <NavLink 
                    to="/about"
                    className="font-medium hover:text-yellow-600 transition"
                    onClick={() => setOpen(false)}
                >
                    Tentang Kami
                </NavLink>

                <NavLink to="/products" className="font-medium hover:text-yellow-600 transition">
                    Semua Menu
                </NavLink>

                <button 
                    onClick={() => scrollToSection("footer")}
                    className="font-medium hover:text-yellow-600 transition"
                >
                    Kontak
                </button>

                {/* SEARCH DESKTOP */}
                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" 
                        type="text" 
                        placeholder="Cari Menu..." 
                    />
                    <img src={assets.search_icon} alt="search" className='w-4 h-4' />
                </div>

                {/* CART — ✅ pakai SVG inline, hapus img cart_icon */}
                <div onClick={() => navigate("/cart")} className="relative cursor-pointer text-gray-700 opacity-80 hover:opacity-100 transition">
                    <CartIcon />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-yellow-500 w-[18px] h-[18px] rounded-full">
                        {getCartCount()}
                    </button>
                </div>

                {/* LOGIN / PROFILE */}
                {!user ? (
                    <button 
                        onClick={() => setShowUserLogin(true)} 
                        className="cursor-pointer px-6 py-2 bg-yellow-500 hover:bg-yellow-600 transition text-black rounded-full"
                    >
                        Login
                    </button>
                ) : (
                    <div className='relative group'>
                        <img src={assets.profile_icon} className='w-10' alt="profil" width={40} height={40} />
                        <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border-gray-200 py-2.5 w-30 rounded-md text-sm z-40'>
                            <li 
                                onClick={() => navigate("/my-orders")} 
                                className='p-1.5 pl-3 hover:bg-yellow-100 cursor-pointer'
                            >
                                Pesanan Saya
                            </li>
                            <li 
                                onClick={() => setShowLogoutConfirm(true)} 
                                className='p-1.5 pl-3 hover:bg-yellow-100 cursor-pointer'
                            >
                                Keluar
                            </li>
                        </ul>
                    </div>
                )}
            </div> 

            {/* MOBILE */}
            <div className='flex items-center gap-6 sm:hidden'>
                <button 
                    onClick={() => setSearchOpen(!searchOpen)} 
                    className="p-2 rounded-full hover:bg-gray-100 transition" 
                    aria-label="Search"
                >
                    <img src={assets.search_icon} alt="search" className="w-6 h-6" />
                </button>

                {/* CART MOBILE — ✅ SVG inline juga */}
                <div onClick={() => navigate("/cart")} className="relative cursor-pointer text-gray-700 opacity-80">
                    <CartIcon />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-yellow-500 w-[18px] h-[18px] rounded-full">
                        {getCartCount()}
                    </button>
                </div>

                <button onClick={() => { setOpen(!open); setSearchOpen(false) }}>
                    <img src={assets.menu_icon} alt="menu" />
                </button>
            </div>

            {/* FLOATING SEARCH MOBILE */}
            {searchOpen && (
                <div 
                    className={`absolute top-14 left-1/2 transform -translate-x-1/2 w-1/2 max-w-sm bg-white rounded-md px-3 py-2 flex items-center gap-2 shadow-[0_8px_25px_rgba(0,0,0,0.3)] z-50
                                transition-all duration-300 ease-out
                                ${searchOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <input
                        ref={inputRef}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        type="text"
                        placeholder="Cari Menu..."
                        className="outline-none w-full text-gray-700 placeholder-gray-400"
                    />
                    <button onClick={() => setSearchOpen(false)} className="text-gray-500 hover:text-gray-800">
                        &#10005;
                    </button>
                </div>
            )}

            {/* MOBILE DROPDOWN */}
            {open && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg py-5 px-6 flex flex-col gap-4 md:hidden rounded-b-xl border-t border-gray-200">
                    
                    <button onClick={() => scrollToSection("home")} className="text-left">
                        Home
                    </button>

                    <NavLink to="/about" onClick={() => setOpen(false)}>
                        Tentang Kami
                    </NavLink>

                    <NavLink to="/products" onClick={() => setOpen(false)}>
                        Semua Menu
                    </NavLink>

                    {user && (
                        <NavLink to="/my-orders" onClick={() => setOpen(false)}>
                            Pesanan Saya
                        </NavLink>
                    )}

                    <button onClick={() => scrollToSection("footer")} className="text-left">
                        Kontak
                    </button>

                    {!user ? (
                        <button 
                            onClick={() => { setOpen(false); setShowUserLogin(true); }} 
                            className="w-full mt-3 py-2 bg-yellow-500 rounded-full"
                        >
                            Login
                        </button>
                    ) : (
                        <button 
                            onClick={() => setShowLogoutConfirm(true)} 
                            className="w-full mt-3 py-2 bg-yellow-500 rounded-full"
                        >
                            Keluar
                        </button>
                    )}
                </div>
            )}
        </nav>

        <div className="h-20 sm:h-24 md:h-28"></div>

        {/* MODAL LOGOUT */}
        {showLogoutConfirm && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
                <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
                    <h2 className="text-lg font-semibold mb-3">Konfirmasi Keluar</h2>
                    <p className="text-gray-600 mb-5">Apakah Anda yakin ingin keluar dari akun?</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => setShowLogoutConfirm(false)}
                            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                        >
                            Batal
                        </button>
                        <button
                            onClick={() => {
                                setShowLogoutConfirm(false);
                                logout();
                            }}
                            className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                        >
                            Ya, Keluar
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}

export default Navbar