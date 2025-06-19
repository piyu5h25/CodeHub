import React from 'react'
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext() // hamne ek global context(box) bana liya jiske sath ham user ko store karege

export const useAuth = () => {
  const context = useContext(AuthContext)  // isse ham stored user ko access karege box se
  if(!context){
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

const AuthProvider = ({children}) => {
  // everything inside this provider is accessible to all the components inside the app
  const [user, setUser] = useState(null) // user ko store karege aur starting me koi user login nhi rhega
  const [loading, setLoading] = useState(true) // loading ko store karege aur starting me load hoga

  useEffect(() => {
    // token aur user ko data se fetch karege
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if(token && userData){
      setUser(JSON.parse(userData))
    }
    setLoading(false) // agar token aur userData hai to loading rok denge
  }, [])

  const login = (userData, token) => {
    setUser(userData) // user ko change krege
    localStorage.setItem("token", token) // token ko store karege
    localStorage.setItem("user", JSON.stringify(userData)) // user ko store karege in json format
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  const value = {
    user, 
    login, 
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider