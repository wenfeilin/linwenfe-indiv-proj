import { isValidElement } from "react";
import { NavLink } from "react-router";

function PageHeader() {
  return (
    <header className="flex items-center justify-between shadow pl-8 pr-4"> 
      {/* Logo */}
      {/* NavLinks can be styled based on if they're active or not */}
      <NavLink className="" to="/">
        {/* Credit for temporary icon: "https://www.flaticon.com/free-icons/smile" created by 
        Illosalz */}
        <img className="w-14" src="/happy.png" alt="https://www.flaticon.com/free-icons/smile created by 
        Illosalz"></img>
      </NavLink>

      {/* Nav bar */}
      <nav>
        <ul className="flex text-lg">
          {/* Should def create these w/ map later. */}
          <li>
            <NavLink className={({ isActive }) => `inline-block px-4 py-8 hover:text-[#E36414] active:text-[#CC5803] ${isActive ? "text-[#4895EF]" : ""}`} to="/my-calendar">My Calendar</NavLink>
          </li>
          <li>
            <NavLink className={({ isActive }) => `inline-block px-4 py-8 hover:text-[#E36414] active:text-[#CC5803] ${isActive ? "text-[#4895EF]" : ""}`} to="/my-journal">My Journal</NavLink>
          </li>
          <li>
            <NavLink className={({ isActive }) => `inline-block px-4 py-8 hover:text-[#E36414] active:text-[#CC5803] ${isActive ? "text-[#4895EF]" : ""}`} to="/my-entries">My Entries</NavLink>
          </li>
          <li>
            <NavLink className={({ isActive }) => `inline-block px-4 py-8 hover:text-[#E36414] active:text-[#CC5803] ${isActive ? "text-[#4895EF]" : ""}`} to="/decorations">Decorations</NavLink>
          </li>
          <li>
            <NavLink className={({ isActive }) => `inline-block px-4 py-8 hover:text-[#E36414] active:text-[#CC5803] ${isActive ? "text-[#4895EF]" : ""}`} to="/settings">Settings</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default PageHeader;
