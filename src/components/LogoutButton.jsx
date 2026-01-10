export default function LogoutButton() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <button onClick={handleLogout} className="bg-gray-300 p-2">
      Logout
    </button>
  );
}