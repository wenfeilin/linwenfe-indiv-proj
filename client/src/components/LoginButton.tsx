function LoginButton({isLoggedIn, setLogInStatus}: {isLoggedIn: boolean, setLogInStatus: () => void}) {
  return(
    <button className="bg-amber-300" disabled={isLoggedIn} onClick={() => {
      setLogInStatus();

      if (!isLoggedIn) {
        // window.location.href for redirecting
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/login`;
      }
    }}>Login!</button>
  )
}

export default LoginButton;