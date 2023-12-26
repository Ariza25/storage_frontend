import { RxAvatar } from "react-icons/rx";
import { IoMdExit } from "react-icons/io";
import { Link } from "react-router-dom";

const Navbar = () => {

  return (
    <div className="w-full bg-gray-900 flex justify-between py-6 px-20 border-b">
      <Link to="/">
        <h1 className="text-white text-3xl">OwlStorage</h1>
      </Link>
      <ul className="flex gap-6 mt-2 ms-[-100px]">
        <Link to="/" className="text-white cursor-pointer hover:text-slate-400 px-2 py-1">
          Clients
        </Link>
        <Link to="/categories" className="text-white cursor-pointer hover:text-slate-400 px-2 py-1">
          Categories
        </Link>
        <Link to="/products" className="text-white cursor-pointer hover:text-slate-400 px-2 py-1">
          Products
        </Link>
      </ul>
      <div className="flex gap-3 text-white mt-2">
        <Link to="/dashboard">
          <RxAvatar
            className={`hover:scale-110 duration-200 cursor-pointer`}
            size={25}
          />
        </Link>
        <Link to="/login" onClick={() => localStorage.removeItem('token')}>
          <IoMdExit className={`hover:scale-110 duration-200 cursor-pointer`} size={25} />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
