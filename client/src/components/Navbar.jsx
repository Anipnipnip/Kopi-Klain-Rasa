import React, { useEffect } from 'react'
import { assets } from '../assets/assets.js'
import { NavLink } from 'react-router-dom'
import { useAppContext } from '../context/AppContext.jsx'
import toast from 'react-hot-toast'

const Navbar = () => {
    const [open, setOpen] = React.useState(false)
    const {user, setUser, setShowUserLogin, navigate, searchQuery, setSearchQuery, getCartCount, axios} = useAppContext();

    const logout = async() => {
        try {
            const { data } = await axios.get('/api/user/logout');
            if(data.success){
                toast.success(data.message);
                setUser(null);
                navigate('/')
            }else{
                toast.success(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if(searchQuery.length > 0){
            navigate("/produk")
        }
    }, [searchQuery])

    // Fungsi scroll ke footer
    const scrollToFooter = () => {
        const footer = document.getElementById("footer");
        if(footer){
            footer.scrollIntoView({ behavior: "smooth" });
        }
        setOpen(false); // tutup mobile menu kalau terbuka
    }

    return (
        <>
        {/* Navbar Fixed */}
        <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-300 px-6 md:px-16 lg:px-24 xl:px-32 py-3 flex items-center justify-between shadow-md">
            {/* Logo */}
{/* Logo */}
<button 
    onClick={() => {
        // Samakan dengan tombol Home
        if (window.location.pathname !== "/") {
            navigate("/");
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }, 50);
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        setOpen(false); // tutup mobile menu kalau terbuka
    }}
    className="flex items-center"
>
    <img src={assets.logo} alt="Logo" className="h-12 md:h-15 w-auto" />
</button>



{/* Desktop Menu */}
<div className="hidden sm:flex items-center gap-8">
    <button 
        onClick={() => {
            if (window.location.pathname !== "/") {
                navigate("/");
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }, 50);
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
            setOpen(false);
        }}
        className="font-medium hover:text-yellow-600 transition"
    >
        Home
    </button>
    <NavLink to="/products" className="font-medium hover:text-yellow-600 transition">Semua Produk</NavLink>
    <button onClick={scrollToFooter} className="font-medium hover:text-yellow-600 transition">Kontak</button>

    <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
        <input 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" 
            type="text" 
            placeholder="Search products" 
        />
        <img src={assets.search_icon} alt="search" className='w-4 h-4' />
    </div>

    <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
        <img src={assets.nav_cart_icon} alt="cart" className='w-6 opacity-80' />
        <button className="absolute -top-2 -right-3 text-xs text-white bg-yellow-500 w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
    </div>

    {!user ? (
        <button onClick={() => setShowUserLogin(true)} className="cursor-pointer px-6 py-2 bg-yellow-500 hover:bg-yellow-600 transition text-black rounded-full">
            Login
        </button>
    ) : (
        <div className='relative group'>
            <img src={assets.profile_icon} className='w-10' alt="" />
            <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border-gray-200 py-2.5 w-30 rounded-md text-sm z-40'>
                <li onClick={() => navigate("/my-orders")} className='p-1.5 pl-3 hover:bg-yellow-100 cursor-pointer'>My Orders</li>
                <li onClick={logout} className='p-1.5 pl-3 hover:bg-yellow-100 cursor-pointer'>Logout</li>
            </ul>
        </div>
    )}
</div> 

{/* Mobile Menu Button */}
<div className='flex items-center gap-6 sm:hidden'>
    <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
        <img src={assets.nav_cart_icon} alt="cart" className='w-6 opacity-80' />
        <button className="absolute -top-2 -right-3 text-xs text-white bg-yellow-500 w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
    </div>
    <button onClick={() => setOpen(!open)} aria-label="Menu">
        <img src={assets.menu_icon} alt="menu" />
    </button>
</div>

{/* Mobile Menu */}
{open && (
    <div className="absolute top-full left-0 w-full bg-white shadow-lg py-5 px-6 flex flex-col gap-4 md:hidden rounded-b-xl border-t border-gray-200">
        <button 
            onClick={() => {
                if (window.location.pathname !== "/") {
                    navigate("/");
                    setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }, 50);
                } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
                setOpen(false);
            }}
            className="text-base font-medium hover:text-yellow-600 transition text-left"
        >
            Home
        </button>
        <NavLink to="/products" onClick={() => setOpen(false)} className="text-base font-medium hover:text-yellow-600 transition">All Products</NavLink>
        {user && <NavLink to="/my-orders" onClick={() => setOpen(false)} className="text-base font-medium hover:text-yellow-600 transition">My Orders</NavLink>}
        <button onClick={scrollToFooter} className="text-base font-medium hover:text-yellow-600 transition text-left">Kontak</button>

        {!user ? (
            <button onClick={() => { setOpen(false); setShowUserLogin(true); }} className="w-full mt-3 py-2 bg-yellow-500 hover:bg-yellow-600 transition text-black rounded-full font-medium">
                Login
            </button>
        ) : (
            <button onClick={logout} className="w-full mt-3 py-2 bg-yellow-500 hover:bg-yellow-600 transition text-black rounded-full font-medium">
                Logout
            </button>
        )}
    </div>
)}

        </nav>

        {/* Spacer supaya konten bawah navbar tidak ketutup */}
        <div className="h-20 sm:h-24 md:h-28"></div>
        </>
    )
}

export default Navbar
