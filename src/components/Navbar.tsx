const Navbar = () => (
  <nav className="w-full bg-gray-800 text-white py-4 px-8 flex justify-between items-center shadow-md">
    <h1 className="text-xl font-bold text-gray-100">Analytics Dashboard</h1>
    <div className="flex items-center space-x-4">
      <span className="text-gray-300">Welcome, User</span>
      <div className="h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300">
        U
      </div>
    </div>
  </nav>
);

export default Navbar;
