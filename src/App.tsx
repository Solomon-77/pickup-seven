import React, { useState } from 'react';
import icon from "./assets/icon.png";
import butterscotch from "./assets/butterscotch.png";
import americano from "./assets/americano.png"
import cappucino from "./assets/cappucino.png"
import espresso from "./assets/espresso.png"
import machiatto from './assets/machiatto.png'
import mocha from "./assets/mocha.png"
import { FaCartShopping } from "react-icons/fa6";

interface Product {
   name: string;
   image: string;
   category: 'Coffee' | 'Milk Tea' | 'Frappe';
   prices: {
      S: number;
      M: number;
      L: number;
   };
}

interface ProductCardProps {
   product: Product;
   onAddToCart: () => void;
}

interface Addon {
   id: string;
   name: string;
   price: number;
}

interface CartItem {
   product: Product;
   quantity: number;
   size: 'S' | 'M' | 'L';
   addons: string[];
}

interface OrderDetails {
   name: string;
   phoneNumber: string;
   paymentMode: string;
   pickupTime: string;
}

interface OrderStatus {
   orderId: string;
   status: 'Preparing' | 'Ready for Pickup' | 'Completed';
   estimatedTime: number;
}

const App: React.FC = () => {
   const productSize = "h-10 w-10 border border-neutral-400 grid place-items-center rounded-md cursor-pointer";

   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isCartModalOpen, setIsCartModalOpen] = useState(false);
   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
   const [quantity, setQuantity] = useState(1);
   const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L'>('M');
   const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
   const [selectedCategory, setSelectedCategory] = useState<'Coffee' | 'Milk Tea' | 'Frappe'>('Coffee'); // Update default category
   const [cart, setCart] = useState<CartItem[]>([]);
   const [orderDetails, setOrderDetails] = useState<OrderDetails>({
      name: '',
      phoneNumber: '',
      paymentMode: 'Cash',
      pickupTime: '15',
   });

   const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
   const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);

   // Array of product data
   const products: Product[] = [
      { name: "Americano", image: americano, category: 'Coffee', prices: { S: 28, M: 38, L: 48 } },
      { name: "Butterscotch", image: butterscotch, category: 'Coffee', prices: { S: 28, M: 38, L: 48 } },
      { name: "Cappuccino", image: cappucino, category: 'Coffee', prices: { S: 28, M: 38, L: 48 } },
      { name: "Espresso", image: espresso, category: 'Coffee', prices: { S: 28, M: 38, L: 48 } },
      { name: "Macchiato", image: machiatto, category: 'Coffee', prices: { S: 28, M: 38, L: 48 } },
      { name: "Mocha", image: mocha, category: 'Coffee', prices: { S: 28, M: 38, L: 48 } },
      { name: "Classic", image: butterscotch, category: 'Milk Tea', prices: { S: 28, M: 38, L: 48 } },
      { name: "Taro", image: butterscotch, category: 'Milk Tea', prices: { S: 28, M: 38, L: 48 } },
      { name: "Brown Sugar", image: butterscotch, category: 'Milk Tea', prices: { S: 28, M: 38, L: 48 } },
      { name: "Matcha", image: butterscotch, category: 'Milk Tea', prices: { S: 28, M: 38, L: 48 } },
      { name: "Chocolate", image: butterscotch, category: 'Frappe', prices: { S: 40, M: 50, L: 60 } }, // New Frappe products
      { name: "Caramel", image: butterscotch, category: 'Frappe', prices: { S: 40, M: 50, L: 60 } },
      { name: "Vanilla", image: butterscotch, category: 'Frappe', prices: { S: 40, M: 50, L: 60 } },
      { name: "Mocha", image: butterscotch, category: 'Frappe', prices: { S: 40, M: 50, L: 60 } },
   ];

   const addons: Addon[] = [
      { id: 'pearls', name: 'Pearls', price: 5 },
      { id: 'whipped_cream', name: 'Whipped Cream', price: 5 },
      { id: 'cream_cheese', name: 'Cream Cheese', price: 5 },
      { id: 'nata_jelly', name: 'Nata Jelly', price: 5 },
   ];

   // Product component
   const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => (
      <div className="bg-gray-100 rounded-lg shadow-md">
         <img src={product.image} className="h-48 object-cover mx-auto" alt={product.name} />
         <div className="rounded-b-lg p-7 space-y-4">
            <div className='flex items-center justify-between'>
               <h1 className="text-center font-semibold">{product.name}</h1>
               <h1 className=''>P{product.prices.S} | P{product.prices.M} | P{product.prices.L}</h1>
            </div>
            <button onClick={onAddToCart} className='bg-neutral-700 w-full py-2 rounded-md text-white'>Add to Cart</button>
         </div>
      </div>
   );

   const handleAddToCart = (product: Product) => {
      setSelectedProduct(product);
      setIsModalOpen(true);
   };

   const handleConfirmAddToCart = () => {
      if (selectedProduct) {
         const newItem: CartItem = {
            product: selectedProduct,
            quantity,
            size: selectedSize,
            addons: selectedAddons,
         };
         setCart([...cart, newItem]);
      }
      setIsModalOpen(false);
      resetSelections();
   };

   const resetSelections = () => {
      setQuantity(1);
      setSelectedSize('M');
      setSelectedAddons([]);
   };

   const calculateItemTotal = (item: CartItem) => {
      const basePrice = item.product.prices[item.size];
      const addonPrice = item.addons.reduce((total, addonId) => {
         const addon = addons.find(a => a.id === addonId);
         return total + (addon ? addon.price : 0);
      }, 0);
      return (basePrice + addonPrice) * item.quantity;
   };

   const calculateCartTotal = () => {
      return cart.reduce((total, item) => total + calculateItemTotal(item), 0);
   };

   const StatusModal: React.FC = () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
         <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Order Status</h2>
            {orderStatus ? (
               <>
                  <p>Order ID: {orderStatus.orderId}</p>
                  <p>Status: {orderStatus.status}</p>
                  <p>Estimated Time: {orderStatus.estimatedTime} minutes</p>
               </>
            ) : (
               <p>No active order found.</p>
            )}
            <div className="flex justify-end mt-4">
               <button onClick={() => setIsStatusModalOpen(false)} className="px-4 py-2 bg-neutral-800 text-white rounded">Close</button>
            </div>
         </div>
      </div>
   );

   const Modal: React.FC = () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
         <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">{selectedProduct?.name}</h2>
            <div className="mb-4">
               <label className="block mb-2">Quantity:</label>
               <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                  className="w-full border rounded p-2"
                  min="1"
               />
            </div>
            <div className="mb-4">
               <label className="block mb-2">Size:</label>
               <div className="flex gap-2">
                  {['S', 'M', 'L'].map((size) => (
                     <button
                        key={size}
                        onClick={() => setSelectedSize(size as 'S' | 'M' | 'L')}
                        className={`${productSize} ${selectedSize === size ? 'bg-neutral-800 text-white' : ''}`}
                     >
                        {size}
                     </button>
                  ))}
               </div>
            </div>
            <div className="mb-4">
               <label className="block mb-2">Add-ons:</label>
               {addons.map((addon) => (
                  <div key={addon.id} className="flex items-center">
                     <input
                        type="checkbox"
                        id={addon.id}
                        checked={selectedAddons.includes(addon.id)}
                        onChange={() => {
                           setSelectedAddons(prev =>
                              prev.includes(addon.id)
                                 ? prev.filter(id => id !== addon.id)
                                 : [...prev, addon.id]
                           );
                        }}
                        className="mr-2"
                     />
                     <label htmlFor={addon.id}>{addon.name} (+P{addon.price.toFixed(2)})</label>
                  </div>
               ))}
            </div>
            <div className="flex justify-end gap-2">
               <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
               <button onClick={handleConfirmAddToCart} className="px-4 py-2 bg-neutral-800 text-white rounded">Add to Cart</button>
            </div>
         </div>
      </div>
   );

   const CartModal: React.FC = () => {
      const [localDetails, setLocalDetails] = useState(orderDetails); // Create a local state to handle form inputs.

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
         const { name, value } = e.target;
         setLocalDetails(prevState => ({
            ...prevState,
            [name]: value,
         }));
      };

      const handleRemoveFromCart = (index: number) => {
         const confirmRemove = window.confirm("Are you sure you want to remove this item from the cart?");
         if (confirmRemove) {
            setCart(prevCart => prevCart.filter((_, i) => i !== index));
         }
      };

      const handlePlaceOrder = () => {
         setOrderDetails(localDetails);  // Only update the main state when placing the order.
         console.log('Order placed:', { cart, orderDetails: localDetails, total: calculateCartTotal() });
         const newOrderStatus: OrderStatus = {
            orderId: Math.random().toString(36).substr(2, 9),
            status: 'Preparing',
            estimatedTime: parseInt(localDetails.pickupTime),
         };
         setOrderStatus(newOrderStatus);
         setCart([]);
         setIsCartModalOpen(false);
         resetSelections();
      };

      return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
               <h2 className="text-xl font-bold mb-4">Your Cart</h2>
               {cart.map((item, index) => (
                  <div key={index} className="mb-4 border-b pb-2">
                     <h3 className="font-semibold">{item.product.name}</h3>
                     <p>Quantity: {item.quantity}</p>
                     <p>Size: {item.size}</p>
                     <p>Add-ons: {item.addons.join(', ') || 'None'}</p>
                     <p>Item Total: P{calculateItemTotal(item).toFixed(2)}</p>
                     <button onClick={() => handleRemoveFromCart(index)} className="text-red-600 underline">Remove</button>
                  </div>
               ))}
               <div className="font-bold mb-4">
                  Total: P{calculateCartTotal().toFixed(2)}
               </div>
               <div className="mb-4">
                  <label className="block mb-2">Name:</label>
                  <input
                     type="text"
                     name="name"
                     value={localDetails.name}
                     onChange={handleInputChange}
                     className="w-full border rounded p-2"
                  />
               </div>
               <div className="mb-4">
                  <label className="block mb-2">Phone Number:</label>
                  <input
                     type="tel"
                     name="phoneNumber"
                     value={localDetails.phoneNumber}
                     onChange={handleInputChange}
                     className="w-full border rounded p-2"
                  />
               </div>
               <div className="mb-4">
                  <label className="block mb-2">Payment Mode:</label>
                  <select
                     name="paymentMode"
                     value={localDetails.paymentMode}
                     onChange={handleInputChange}
                     className="w-full border rounded p-2"
                  >
                     <option value="Cash">Cash</option>
                     <option value="Card">Card</option>
                  </select>
               </div>
               <div className="mb-4">
                  <label className="block mb-2">Pickup Time:</label>
                  <select
                     name="pickupTime"
                     value={localDetails.pickupTime}
                     onChange={handleInputChange}
                     className="w-full border rounded p-2"
                  >
                     <option value="5">5 minutes</option>
                     <option value="10">10 minutes</option>
                     <option value="15">15 minutes</option>
                     <option value="20">20 minutes</option>
                     <option value="25">25 minutes</option>
                     <option value="30">30 minutes</option>
                  </select>
               </div>
               <div className="flex justify-end gap-2">
                  <button onClick={() => setIsCartModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                  <button onClick={handlePlaceOrder} className="px-4 py-2 bg-neutral-800 text-white rounded">Place Order</button>
               </div>
            </div>
         </div>
      );
   };

   return (
      <div className="font-inter">
         <nav className="bg-neutral-800">
            <div className="h-[60px] max-w-[1270px] mx-auto flex items-center justify-between px-5 text-white">
               <div className="flex items-center space-x-4">
                  <img className="h-10 rounded-md" src={icon} alt="Icon" />
                  <h1 className="font-medium">The Home of Original</h1>
               </div>
               <ul>
                  <li>
                     <button onClick={() => setIsStatusModalOpen(true)} className="hover:underline cursor-pointer">
                        Status
                     </button>
                  </li>
               </ul>
            </div>
         </nav>
         <main className="bg-neutral-200 h-[calc(100vh-60px)] overflow-auto">
            <div className="max-w-[1270px] mx-auto p-5 space-y-4">
               <div className="flex items-center justify-between">
                  <div className='flex items-center'>
                     <h1 className="mr-4 font-semibold">Category</h1>
                     <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as 'Coffee' | 'Milk Tea' | 'Frappe')} // Update category selection
                        className="border cursor-pointer bg-white border-neutral-300 py-2 px-3 rounded-md font-medium"
                     >
                        <option value="Coffee">Coffee</option>
                        <option value="Milk Tea">Milk Tea</option>
                        <option value="Frappe">Frappe</option> {/* Add Frappe option */}
                     </select>
                  </div>
                  <div className='bg-white rounded-full p-[10px] cursor-pointer' onClick={() => setIsCartModalOpen(true)}>
                     <FaCartShopping className='text-2xl' />
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                  {products
                     .filter(product => product.category === selectedCategory)
                     .map((product, index) => (
                        <ProductCard key={index} product={product} onAddToCart={() => handleAddToCart(product)} />
                     ))
                  }
               </div>
            </div>
         </main>
         {isModalOpen && <Modal />}
         {isCartModalOpen && <CartModal />}
         {isStatusModalOpen && <StatusModal />}
      </div>
   );
};

export default App;