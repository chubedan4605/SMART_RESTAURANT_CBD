import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = localStorage.getItem("accessToken");

  // console.log("Token in PublicRoute:", token); // Debug token

  if (token) {
    const user = JSON.parse(localStorage.getItem("user"));
    // console.log("User in PublicRoute:", user); // Debug user

    // Redirect based on role
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (user?.role === "waiter") {
      return <Navigate to="/waiter" replace />;
    } else if (user?.role === "kitchen") {
      return <Navigate to="/kitchen" replace />;
    }

    // Nếu là user bình thường (khách), cho render các trang public (Outlet)
    return <Outlet />;
  }

  return <Outlet />;
};

export default PublicRoute;
