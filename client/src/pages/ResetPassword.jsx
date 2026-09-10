import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const { axios, navigate, setShowUserLogin } = useAppContext();

  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `/api/user/reset-password/${token}`,
        { password }
      );

      if (data.success) {
        toast.success(data.message);

        navigate("/");              // balik ke home
        setShowUserLogin(true);     // munculin popup login
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
        <input
          type="password"
          placeholder="New Password"
          className="border w-full p-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="bg-black text-white w-full py-2">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;