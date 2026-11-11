// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag } from "react-icons/fi";
// import { useCart } from "@/context/CartContext";
// import { useAuth } from "@/context/AuthContext";
// import { useEffect } from "react";

// export default function CartPage() {
//   const {
//     cartItems,
//     removeFromCart,
//     increaseQty,
//     decreaseQty,
//     totalPrice,
//     clearCart,
//   } = useCart();
//   const { isLoggedIn, loading, openLoginModal } = useAuth();

//   useEffect(() => {
//     if (!loading && !isLoggedIn) {
//       openLoginModal();
//     }
//   }, [loading, isLoggedIn, openLoginModal]);

//   if (!loading && !isLoggedIn) {
//     return (
//       <section className="mx-auto max-w-lg px-4 py-16 text-center">
//         <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
//           <FiShoppingBag className="h-6 w-6 text-amber-600" />
//         </div>
//         <p className="text-lg font-semibold text-gray-800">Login required to view cart</p>
//         <button
//           type="button"
//           onClick={() => openLoginModal()}
//           className="mt-6 rounded-xl bg-amber-400 px-8 py-3 text-sm font-bold text-black shadow-sm hover:bg-amber-500"
//         >
//           Login with OTP
//         </button>
//       </section>
//     );
//   }

//   return (
//     <section className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
//       <div className="mb-6 flex items-center justify-between">
//         <Link
//           href="/"
//           className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
//         >
//           <FiArrowLeft className="h-4 w-4" />
//           Back to menu
//         </Link>
//         {cartItems.length > 0 && (
//           <button
//             type="button"
//             onClick={clearCart}
//             className="text-sm font-medium text-red-500 hover:underline"
//           >
//             Clear cart
//           </button>
//         )}
//       </div>

//       <h1 className="text-xl font-black text-gray-900 sm:text-2xl">Your Cart</h1>
//       {cartItems.length > 0 && (
//         <p className="mt-1 text-sm text-gray-500">
//           {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
//         </p>
//       )}

//       {cartItems.length === 0 ? (
//         <div className="mt-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
//           <FiShoppingBag className="mb-3 h-10 w-10 text-gray-300" />
//           <p className="text-lg font-semibold text-gray-700">Your cart is empty</p>
//           <p className="mt-1 text-sm text-gray-400">
//             Add some delicious items from the menu.
//           </p>
//           <Link
//             href="/"
//             className="mt-6 rounded-xl bg-amber-400 px-6 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-amber-500"
//           >
//             Browse menu
//           </Link>
//         </div>
//       ) : (
//         <>
//           <div className="mt-6 space-y-3">
//             {cartItems.map((item) => (
//               <div
//                 key={item.id}
//                 className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
//               >
//                 <div className="flex flex-1 items-center gap-3">
//                   <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-20 sm:w-20">
//                     <Image
//                       src={item.image as string}
//                       alt={item.name}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <h3 className="truncate text-sm font-bold text-gray-900 sm:text-base">
//                       {item.name}
//                     </h3>
//                     <span className="mt-0.5 block text-sm font-semibold text-gray-600">
//                       ₹{item.price} each
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between gap-3 sm:justify-end">
//                   <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-1.5 py-1">
//                     <button
//                       type="button"
//                       onClick={() => decreaseQty(item.id)}
//                       className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white"
//                     >
//                       <FiMinus className="h-3.5 w-3.5" />
//                     </button>
//                     <span className="w-6 text-center text-sm font-bold">
//                       {item.quantity}
//                     </span>
//                     <button
//                       type="button"
//                       onClick={() => increaseQty(item.id)}
//                       className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white"
//                     >
//                       <FiPlus className="h-3.5 w-3.5" />
//                     </button>
//                   </div>

//                   <span className="min-w-[4rem] text-right text-sm font-black text-gray-900">
//                     ₹{Number(item.price) * item.quantity}
//                   </span>

//                   <button
//                     type="button"
//                     onClick={() => removeFromCart(item.id)}
//                     className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-red-500 hover:bg-red-50"
//                     aria-label="Remove"
//                   >
//                     <FiTrash2 className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="sticky bottom-4 mt-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-lg">
//             <div className="flex items-center justify-between">
//               <span className="text-base font-semibold text-gray-700">Total</span>
//               <span className="text-2xl font-black text-gray-900">₹{totalPrice}</span>
//             </div>
//             <Link
//               href="/checkout"
//               className="mt-4 flex w-full items-center justify-center rounded-xl bg-amber-400 py-3.5 text-sm font-bold text-black shadow-sm transition hover:bg-amber-500"
//             >
//               Proceed to Checkout
//             </Link>
//           </div>
//         </>
//       )}
//     </section>
//   );
// }



"use client";

import Image from "next/image";
import Link from "next/link";
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    increaseQty,
    decreaseQty,
    totalPrice,
    clearCart,
  } = useCart();
  const { isLoggedIn, loading, openLoginModal } = useAuth();

  useEffect(() => {
    if (!loading && !isLoggedIn) openLoginModal();
  }, [loading, isLoggedIn, openLoginModal]);

  if (!loading && !isLoggedIn) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
          <FiShoppingBag className="h-7 w-7 text-amber-600" />
        </div>
        <p className="text-xl font-bold text-gray-900">Login required to view cart</p>
        <p className="mt-1 text-sm text-gray-500">Sign in with OTP to continue</p>
        <button
          type="button"
          onClick={() => openLoginModal()}
          className="mt-6 rounded-xl bg-amber-400 px-8 py-3 text-sm font-bold text-black shadow-sm hover:bg-amber-500"
        >
          Login with OTP
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          <FiArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>
        {cartItems.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-sm font-semibold text-red-500 hover:underline"
          >
            Clear cart
          </button>
        )}
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
          Your Cart
        </h1>
        {cartItems.length > 0 && (
          <p className="mt-1 text-sm text-gray-500">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your bag
          </p>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gradient-to-b from-gray-50 to-white py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
            <FiShoppingBag className="h-8 w-8 text-gray-300" />
          </div>
          <p className="text-lg font-bold text-gray-800">Your cart is empty</p>
          <p className="mt-1 text-sm text-gray-500">Add something delicious from the menu</p>
          <Link
            href="/"
            className="mt-6 rounded-xl bg-amber-400 px-8 py-3 text-sm font-bold text-black shadow-sm hover:bg-amber-500"
          >
            Browse menu
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Items */}
          <div className="space-y-3 lg:col-span-8">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:p-5"
              >
                <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-24 sm:w-24">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl">🍽️</div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-base font-bold text-gray-900">{item.name}</h2>
                  <p className="mt-0.5 text-sm text-gray-500">₹{item.price} each</p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
                    <button
                      type="button"
                      onClick={() => decreaseQty(item.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 hover:bg-white"
                    >
                      <FiMinus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => increaseQty(item.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 hover:bg-white"
                    >
                      <FiPlus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <span className="min-w-[4.5rem] text-right text-base font-black text-gray-900">
                    ₹{Number(item.price) * item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-red-500 hover:bg-red-50"
                    aria-label="Remove"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
              <h3 className="text-sm font-bold uppercase tracking-wide text-gray-400">
                Order summary
              </h3>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({cartItems.length})</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-black text-gray-900">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <p className="text-xs text-gray-400">
                  Taxes & charges calculated at checkout
                </p>
              </div>
              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-amber-400 py-3.5 text-sm font-bold text-black shadow-sm transition hover:bg-amber-500"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/"
                className="mt-3 block text-center text-sm font-medium text-gray-500 hover:text-gray-800"
              >
                Add more items
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}