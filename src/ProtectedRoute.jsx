// import { useEffect } from 'react'
// import { useAuth } from './AuthContext'
// import { useNavigate } from 'react-router-dom'

// const ProtectedRoute = ({ children }) => {
//   const { user, loading, refreshAuth } = useAuth()
//   const navigate = useNavigate()

//   useEffect(() => {
//     const verifyAuth = async () => {
//       await refreshAuth()
//       if (!user && !loading) {
//         navigate('/login', { replace: true })
//       }
//     }
    
//     verifyAuth()
//   }, [user, loading, navigate, refreshAuth])

//   if (loading || !user) return <div className="fullscreen-loading">Vérification de l'authentification...</div>

//   return children
// }

// export default ProtectedRoute