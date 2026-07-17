export default function Footer() {
  return (
    <footer className="bg-black py-16 text-white">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="font-['Playfair'] text-3xl font-bold">BookStore</h2>
          <p className="mt-5 text-gray-400 leading-7">
            Discover thousands of books, explore new worlds, and find your
            next favorite story with our carefully selected collection.
          </p>
        </div>
        <div>
          <h3 className="font-['Playfair'] text-xl font-bold">Explore</h3>
          <ul className="mt-5 space-y-3 text-gray-400">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">Books</li>
            <li className="hover:text-white cursor-pointer">Categories</li>
            <li className="hover:text-white cursor-pointer">Best Sellers</li>
          </ul>
        </div>
        <div>
          <h3 className="font-['Playfair'] text-xl font-bold">Customer Service</h3>
          <ul className="mt-5 space-y-3 text-gray-400">
            <li className="hover:text-white cursor-pointer">Contact Us</li>
            <li className="hover:text-white cursor-pointer">Shipping Information</li>
            <li className="hover:text-white cursor-pointer">Returns</li>
            <li className="hover:text-white cursor-pointer">FAQ</li>
          </ul>
        </div>
        <div>
          <h3 className="font-['Playfair'] text-xl font-bold">Contact</h3>
          <div className="mt-5 space-y-3 text-gray-400">
            <p>123 Library Street</p>
            <p>New York, NY 10001</p>
            <p>info@bookstore.com</p>
            <p>+1 (555) 123-4567</p>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-[1400px] border-t border-gray-800 px-5 pt-6 text-center text-sm text-gray-500">
        © 2026 BookStore. All rights reserved.
      </div>
    </footer>
  );
}