import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";

const ProductDetails = () => {
  const { products, navigate, currency, addToCart } = useAppContext();
  const { id } = useParams();

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const product = products.find((item) => item._id === id);

  useEffect(() => {
    if (products.length > 0 && product) {
      const productsCopy = products.filter(
        (item) => product.category === item.category
      );
      setRelatedProducts(productsCopy.slice(0, 5));
    }
  }, [products, product]);

  useEffect(() => {
    if (product?.image?.length > 0) {
      setThumbnail(product.image[0]);
    }
  }, [product]);

  if (!product) return null;

  // Optimasi gambar utama
  const optimizedThumbnail = thumbnail?.replace(
    "/upload/",
    "/upload/f_auto,q_auto,w_600/"
  );

  return (
    <div className="mt-6 mb-16 px-4 sm:px-6">
      {/* Breadcrumb */}
      <p className="text-xs sm:text-sm text-gray-500">
        <Link to="/">Home</Link> /
        <Link to="/products"> Semua Produk</Link> /
        <Link to={`/products/${product.category.toLowerCase()}`}>
          {" "}
          {product.category}
        </Link>{" "}
        /
        <span className="text-[#3F171C]"> {product.name}</span>
      </p>

      {/* Main */}
      <div className="flex flex-col md:flex-row gap-6 mt-4">

        {/* IMAGE */}
        <div className="w-full md:w-1/2 flex flex-col items-center">

          {/* Main Image */}
          <div className="border border-gray-300 rounded-lg overflow-hidden w-full max-w-[280px] sm:max-w-[320px] md:max-w-full">
            <img
              src={optimizedThumbnail}
              alt={product.name}
              width={600}
              height={600}
              fetchPriority="high"
              decoding="async"
              className="w-full h-[220px] sm:h-[280px] md:h-[400px] object-cover"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 mt-3 overflow-x-auto w-full justify-start md:justify-center">
            {product.image.map((image, index) => {
              const optimizedImage = image.replace(
                "/upload/",
                "/upload/f_auto,q_auto,w_120/"
              );

              return (
                <img
                  key={index}
                  src={optimizedImage}
                  alt={`${product.name} ${index + 1}`}
                  width={64}
                  height={64}
                  loading="lazy"
                  decoding="async"
                  onClick={() => setThumbnail(image)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 object-cover rounded border cursor-pointer flex-shrink-0 ${
                    thumbnail === image
                      ? "border-yellow-500"
                      : "border-gray-300"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* INFO */}
        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-medium">
            {product.name}
          </h1>

          <p className="text-lg sm:text-xl font-semibold mt-3">
            {currency}. {product.price}
          </p>

          <p className="text-sm sm:text-base font-medium mt-5">
            Deskripsi
          </p>

          <ul className="list-disc ml-4 text-gray-500/80 text-xs sm:text-sm mt-2 space-y-1">
            {product.description.map((desc, index) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>

          {/* BUTTON */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={() => addToCart(product._id)}
              className="w-full py-3 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
            >
              Tambahkan ke keranjang
            </button>

            <button
              onClick={() => {
                addToCart(product._id, {
                  showPopup: false,
                  showToast: false,
                });
                navigate("/cart");
              }}
              className="w-full py-3 rounded font-medium bg-yellow-500 text-black hover:bg-yellow-600 active:bg-yellow-700 active:scale-95 transition"
            >
              Bayar
            </button>
          </div>
        </div>
      </div>

      {/* RELATED */}
      <div className="flex flex-col items-center mt-14">
        <p className="font-medium text-sm sm:text-base">
          Menu yang serupa
        </p>

        <div className="w-16 h-0.5 bg-yellow-500 mt-2 rounded-full"></div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mt-6 w-full">
          {relatedProducts
            .filter((p) => p.inStock)
            .map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
        </div>

        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="mt-10 px-8 py-2 rounded text-[#3F171C] hover:bg-gray-200 transition"
        >
          Lihat menu lainnya
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;