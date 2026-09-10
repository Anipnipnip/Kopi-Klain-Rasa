import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const { token } = useParams();
  const { axios, navigate } = useAppContext();

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axios.get(`/api/user/verify/${token}`);
        if (data.success) {
          toast.success(data.message);
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    verify();
  }, []);

  return <div className="text-center mt-20">Verifying...</div>;
};

export default VerifyEmail;
