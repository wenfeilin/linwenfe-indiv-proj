import { useLocation } from "react-router";

function LoginButton({isLoggedIn, checkLoginStatus}: {isLoggedIn: boolean, checkLoginStatus: () => void}) {
  
  
  
  const location = useLocation();

  return(
    <button className="bg-amber-300 cursor-pointer" disabled={isLoggedIn} onClick={() => {
      checkLoginStatus();

      if (!isLoggedIn) {
        // Save the URL of this page so it is redirected to after login
        const prevPageUrl = encodeURIComponent(location.pathname);

        // window.location.href for redirecting
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/login?prevPage=${prevPageUrl}`;
      }
    }}>Login!</button>
  )
}

export default LoginButton;