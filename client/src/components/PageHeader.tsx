import { NavLink } from "react-router";
import "../index.css"
import logo from "../assets/music-journal-logo-cropped.png";

function PageHeader() {
  const linkStyles = "inline-block text-[15px] md:text-base px-4 py-4.5 md:px-5 lg:py-7 hover:text-[#E36414] active:text-[#CC5803]";

  // By default, the root and my-calendar routes should redirect user to the calendar for current month and year.
  const now = new Date();
  const currMonth = now.getMonth() + 1; // .getMonth() returns 0-based months.
  const currYear = now.getFullYear();
  
  return (
    <header className="flex items-center justify-between shadow h-14 px-4 md:px-6 lg:px-10"> 
      {/* Logo */}
      {/* NavLinks can be styled based on if they're active or not */}
      <NavLink className="" to={`/my-calendar/${currYear}/${currMonth}`}>
        {/* Logo is made by me! */}
        <img className="w-10 md:w-9 lg:w-8.5" src={logo} alt="music journal icon created by Wenfei Lin"></img>
      </NavLink>

      {/* Nav bar */}
      <nav>
        <ul className="flex text-center md:text-base lg:text-lg">
          <li>
            <NavLink className={({ isActive }) => `${linkStyles} ${isActive ? "text-[#4895EF]" : ""}`} to={`/my-calendar/`}>My Calendar</NavLink>
          </li>
          {/* <li>
            <NavLink className={({ isActive }) => `inline-block px-4 py-8 hover:text-[#E36414] active:text-[#CC5803] ${isActive ? "text-[#4895EF]" : ""}`} to="/my-journal">My Journal</NavLink>
          </li> */}
          <li>
            <NavLink className={({ isActive }) => `${linkStyles} ${isActive ? "text-[#4895EF]" : ""}`} to="/my-entries">My Entries</NavLink>
          </li>
          {/* <li>
            <NavLink className={({ isActive }) => `inline-block px-4 py-8 hover:text-[#E36414] active:text-[#CC5803] ${isActive ? "text-[#4895EF]" : ""}`} to="/decorations">Decorations</NavLink>
          </li> */}
          <li>
            <NavLink className={({ isActive }) => `${linkStyles} ${isActive ? "text-[#4895EF]" : ""}`} to="/spotify-login">Spotify Login</NavLink>
          </li> 
          {/* <li>
            <NavLink className={({ isActive }) => `${linkStyles} ${isActive ? "text-[#4895EF]" : ""}`} to="/settings">Settings</NavLink>
          </li>  */}
        </ul>
      </nav>
    </header>
  );
}

export default PageHeader;
