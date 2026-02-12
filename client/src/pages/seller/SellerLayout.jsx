import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerLayout = () => {
  const { axios, navigate } = useAppContext();

  const sidebarLinks = [
    { name: "Add Product", path: "/seller", icon: assets.add_icon },
    { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
    { name: "Transactions", path: "/seller/transactions", icon: assets.transactions_icon },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/seller/logout");
      if (data.success) {
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">

      {/* HEADER (Tetap di atas) */}
      <div className="flex items-center justify-between px-4 md:px-6 border-b border-gray-300 py-3 bg-white sticky top-0 z-50 h-[64px]">
        <Link to="/">
          <img src={assets.logo} alt="logo" className="cursor-pointer w-32 md:w-40" />
        </Link>
        <div className="flex items-center gap-3 md:gap-5 text-gray-600">
          <p className="text-sm md:text-base">Hi! Admin</p>
          <button
            onClick={logout}
            className="border rounded-full text-xs md:text-sm px-3 md:px-4 py-1 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR (Kasih margin-top biar gak ketutup navbar) */}
        <div className="min-w-[180px] w-[200px] md:w-60 border-r border-gray-300 bg-gray-50 flex flex-col fixed left-0 top-[64px] h-[calc(100vh-64px)]
">
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/seller"}
              className={({ isActive }) =>
                `flex items-center py-3 px-3 md:px-4 gap-3 transition-all text-sm md:text-base ${
                  isActive
                    ? "border-r-4 border-[#3F171C] bg-[#3F171C]/10 text-[#3F171C]"
                    : "hover:bg-gray-100 text-gray-700"
                }`
              }
            >
              <img src={item.icon} alt="" className="w-5 h-5 md:w-6 md:h-6" />
              <p>{item.name}</p>
            </NavLink>
          ))}
        </div>

        {/* MAIN CONTENT */}
<div className="flex-1 overflow-y-auto bg-white p-3 md:p-6 ml-[200px] md:ml-60">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default SellerLayout;
