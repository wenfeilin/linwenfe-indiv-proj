function LoginButton({isLoggedIn, checkLoginStatus}: {isLoggedIn: boolean, checkLoginStatus: () => void}) {
  return(
    <button className="bg-amber-300 cursor-pointer" disabled={isLoggedIn} onClick={() => {
      checkLoginStatus();

      if (!isLoggedIn) {

        // You can just do this??: href="/auth/login"

        // window.location.href for redirecting
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/login`;
      }
    }}>Login!</button>
  )
}

export default LoginButton;