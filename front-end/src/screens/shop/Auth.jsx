import { useState } from "react"

import RegisterForm from "../../components/shop/RegisterForm"
import LoginForm from "../../components/shop/LoginForm"
const Auth = () => {
  const [showForm, setShowForm] = useState(false) 
  const isMobile = window.innerWidth < 480
  
  return (
    <section className="auth">
      <div className={`container-auth ${showForm? "right-panel-active" : ""}`} id="container">
        {isMobile ? 
        // ---------------- MOBILE form ----------------
          showForm ? <RegisterForm setShowForm={setShowForm}/> : <LoginForm setShowForm={setShowForm}/> 
        : (
          // ------------------- PC form --------------- 
          <>
            <LoginForm/>
            <RegisterForm/>
            <div className="overlay-container">
              <div className="overlay">
                <div className="overlay-panel overlay-left">
                  <h1>Welcome Back!</h1>
                  <p>To keep connected with us please login with your personal info</p>
                  <button className="ghost" onClick={() => setShowForm(false)}>Sign In</button>
                </div>
                <div className="overlay-panel overlay-right">
                  <h1>Hello, Friend!</h1>
                  <p>Enter your personal details and start journey with us</p>
                  <button className="ghost" onClick={() => setShowForm(true)}>Sign Up</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Auth