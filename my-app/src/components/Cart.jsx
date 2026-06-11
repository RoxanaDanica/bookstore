import { useCart } from "react-use-cart";
import { useNavigate } from "react-router-dom";
import SidebarFilters from "./SidebarFilters";
import LockIcon from '@mui/icons-material/Lock';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";

export default function Cart() {
  const {
    isEmpty,
    items,
    totalUniqueItems,
    totalItems,
    cartTotal,
    removeItem,
    updateItemQuantity,
    emptyCart,
  } = useCart();

  const navigate = useNavigate();
    const [filters,setFilters] = useState({
    genre: [],
    author: [],
    price:[0,100]
  });


  const books = items;

  if (isEmpty) return <h2>Cart is empty</h2>;

  return (
    <div className="flex flex-row w-[1400px] mx-auto" >
      <SidebarFilters 
        className="w-[18%]"  
        books={books}
        filters={filters}
        setFilters={setFilters}
      />
      <div className="w-[82%] flex flex-row gap-[30px]">
        <div className="w-[67%] p-[10px]">
          <h2 className="text-2xl font-semibold mb-5">
            Shopping Cart
          </h2>

          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border border-[#e5e5e5] bg-white p-5 mb-4"
            >
              <div className="flex gap-4 items-center w-[60%]">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-[80px] h-[94px] object-cover"
                />

                <div>
                  <h4 className="font-semibold text-lg">
                    {item.title}
                  </h4>

                  <p className="text-[#e52334] font-medium">
                    {item.price} $
                  </p>

                  <p className="text-[#000000] font-light font-['Jost',serif]">
                    {item.authors}
                  </p>
                  <p className="text-[#000000] font-light font-['Jost',serif]">
                    {item.categories}
                  </p>

                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center border border-[#e5e5e5]">
                  <button
                    className="px-3 py-2"
                    onClick={() =>
                      updateItemQuantity(item.id, item.quantity - 1)
                    }
                  >
                    -
                  </button>

                  <span className="px-4">
                    {item.quantity}
                  </span>

                  <button
                    className="px-3 py-2"
                    onClick={() =>
                      updateItemQuantity(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <p className="font-semibold min-w-[80px] text-right">
                  {(item.price * item.quantity).toFixed(2)} $
                </p>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <DeleteIcon sx={{ color: '#878787' }} />
                </button>
              </div>
            </div>
          ))}
        </div>

          <div className="w-[33%]">
            <div className="w-full p-[10px] relative block mb-5 bg-white border border-[#e5e5e5] h-fit">
              <div className="p-[20px]">
                <div className="flex flex-row justify-between mb-[15px]">
                  <p className="font-semibold">{totalItems} items</p>
                  <p className="font-semibold text-[#e52334]">{cartTotal.toFixed(2)} $</p>
                </div>
                <div className="flex flex-row justify-between mb-[15px]">
                  <p className="font-semibold">Shipping:</p>
                  <p className="font-semibold text-[#e52334]">0.00 $</p>
                </div>
              </div>
              <div className="p-[20px]"> 
                <div className="flex flex-row justify-between mb-[15px]">
                  <p className="font-semibold">Total (tax excl.) </p>
                  <p className="font-semibold text-[#e52334]">{cartTotal.toFixed(2)} $</p>
                </div>
                <div className="flex flex-row justify-between mb-[15px]">
                  <p className="font-semibold">Taxes: </p>
                  <p className="font-semibold text-[#e52334]">$0.00</p>
                </div>
              </div>

              <div className="p-[20px]">
                  <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-[#e52334] text-white py-[15px] uppercase font-medium hover:cursor-pointer"
                >
                  Go to Checkout
                </button>
              </div>

            </div>

            <div className="mt-[5px] w-full border-[3px] border-dashed border-[#efefef] py-[11px] px-[30px] mb-[15px]">
              <div className="flex flex-row gap-[10px] mb-[15px]">
                <LockIcon sx={{ color: '#e52334', fontSize: '25px' }} />
                <p className="text-gray-600 font-['Jost',serif] text-[#000000] font-semibold font-[15px]">Security policy</p>
              </div>
              <div className="flex flex-row gap-[10px] mb-[15px]">
                <LocalShippingIcon sx={{ color: '#e52334', fontSize: '25px' }} />
                <p className=" text-gray-600 font-['Jost',serif] text-[#000000] font-semibold font-[15px]">Delivery policy</p>
              </div>
              <div className="flex flex-row gap-[10px] mb-[15px]">
                <ThumbUpIcon sx={{ color: '#e52334', fontSize: '25px' }} />
                <p className="text-gray-600 font-['Jost',serif] text-[#000000] font-semibold font-[15px]">Return policy</p>
              </div>
            </div>

          </div>
      </div>
    </div>
  );
}