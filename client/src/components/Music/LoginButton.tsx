import { useLocation } from "react-router";

function LoginButton({isLoggedIn, checkLoginStatus}: {isLoggedIn: boolean, checkLoginStatus: () => Promise<void>}) {
  const location = useLocation();

  return(
    <>
      <button className="bg-amber-300 cursor-pointer p-2 px-3 rounded-lg hover:bg-amber-400" /*disabled={isLoggedIn}*/ onClick={async () => {

        // I don't think this is right. check params of checkLoginStatus() in parent components
        
        
        // await checkLoginStatus(); 
        
        // if (!isLoggedIn) {
        // Get rid of condition to allow user to deny access at any time.
        // Save the URL of this page so it is redirected to after login
        const prevPageUrl = encodeURIComponent(location.pathname);
        // window.location.href for redirecting
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/login?prevPage=${prevPageUrl}`;
        // }
      }}>Log in to Spotify!</button>
    </>
  )
}

export default LoginButton;