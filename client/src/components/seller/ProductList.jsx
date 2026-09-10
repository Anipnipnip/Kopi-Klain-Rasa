import React from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ProductList = () => {
  const { products, currency, axios, fetchProducts } = useAppContext()

  // 🔧 STATE EDIT
  const [editingId, setEditingId] = React.useState(null)
  const [newPrice, setNewPrice] = React.useState("")

  // ✅ TOGGLE STOCK (TETAP)
  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post('/api/product/stock', { id, inStock });
      if (data.success) {
        fetchProducts();
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // 🗑️ DELETE
  const handleDelete = async (id) => {
    const confirmDelete = confirm("Yakin mau hapus produk?")
    if (!confirmDelete) return

    try {
      const { data } = await axios.delete(`/api/product/delete/${id}`)
      if (data.success) {
        toast.success(data.message)
        fetchProducts()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // ✏️ START EDIT
  const handleEdit = (product) => {
    setEditingId(product._id)
    setNewPrice(product.price)
  }

  // 💾 SAVE
  const handleSave = async (id) => {
    if (!newPrice || newPrice <= 0) {
      return toast.error("Harga tidak valid")
    }

    try {
      const { data } = await axios.put(`/api/product/update/${id}`, {
        price: newPrice
      })

      if (data.success) {
        toast.success(data.message)
        fetchProducts()
        setEditingId(null)
        setNewPrice("")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // ❌ CANCEL
  const handleCancel = () => {
    setEditingId(null)
    setNewPrice("")
  }

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">Semua Menu</h2>

        <div className="flex flex-col items-center max-w-5xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full">

            {/* HEADER */}
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Menu</th>
                <th className="px-4 py-3 font-semibold">Kategori</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">Harga</th>
                <th className="px-4 py-3 font-semibold">Ketersediaan Stok</th>
                <th className="px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="text-sm text-gray-500">
              {[...products]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((product) => (
                  <tr key={product._id} className="border-t border-gray-500/20 align-middle">

                    {/* PRODUCT */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="border border-gray-300 rounded overflow-hidden">
                          <img src={product.image[0]} alt="Product" className="w-16" />
                        </div>
                        <span className="hidden sm:block truncate max-w-[150px]">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-4 py-3">
                      {product.category}
                    </td>

                    {/* PRICE (INLINE EDIT) */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      {editingId === product._id ? (
                        <input
                          type="number"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          className="border px-2 py-1 w-24 rounded"
                        />
                      ) : (
                        `${currency}${product.price}`
                      )}
                    </td>

                    {/* STOCK */}
                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          onClick={() => toggleStock(product._id, !product.inStock)}
                          checked={product.inStock}
                          type="checkbox"
                          className="sr-only peer"
                        />
                        <div className="w-12 h-7 bg-slate-300 rounded-full peer-checked:bg-[#3F171C] transition"></div>
                        <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition peer-checked:translate-x-5"></span>
                      </label>
                    </td>

                    {/* ACTION */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">

                        {editingId === product._id ? (
                          <>
                            <button
                              onClick={() => handleSave(product._id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                            >
                              Simpan
                            </button>

                            <button
                              onClick={handleCancel}
                              className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-xs"
                            >
                              Batal
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEdit(product)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                          >
                            Ubah Harga
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(product._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Hapus Menu
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  )
}

export default ProductList