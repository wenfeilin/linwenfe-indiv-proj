function LoginButton() {
  return(
    <button className="bg-amber-300" onClick={() => {
      window.location.href = "http://127.0.0.1:5000/auth/login";
    }}>Login!</button>
  )
}

export default LoginButton;