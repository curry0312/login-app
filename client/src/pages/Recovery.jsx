import { useState } from "react";
import { verifyOTP } from "../utility/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/store";

function Recovery() {
  const [OTP, setOTP] = useState("");
  const navigate = useNavigate();

  const username = JSON.parse(localStorage.getItem('username')) || useAuthStore((state) => state.auth.username);

  function onSubmit(e) {
    e.preventDefault()
    const resPromise = verifyOTP({username, OTP});
    toast.promise(resPromise, {
      loading: "Verifing...",
      success: "Verify completely!",
      error: "Invalid OTP...",
    });
    resPromise
      .then(() => {
        navigate("/reset");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <div className="container mx-auto font-Ubuntu">
      <div className="flex justify-center items-center h-screen">
        <div className="border-4 w-[400px] h-[75%] border-gray-300 shadow-xl backdrop-blur-md rounded-2xl px-5 py-3">
          <div className="title flex flex-col items-center py-20">
            <h4 className="text-bold text-5xl">Recovery</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-400">
              Please Enter OTP to reset password
            </span>
          </div>

          <form onSubmit={onSubmit}>
            <div className="textbox flex flex-col items-center">
              <div className="w-full text-center">
                <span className="text-sm text-gray-500">
                  Enter 6 digits OTP
                </span>
                <input
                  className="px-4 py-3 rounded-md bg-gray-50 text-black w-full outline-none"
                  type="text"
                  placeholder="OTP"
                  value={OTP}
                  onChange={(e) => setOTP(e.target.value)}
                />
              </div>
              <button
                className="px-4 py-3 rounded-md bg-indigo-500 text-white w-full hover:bg-purple-500"
                type="submit"
              >
                Recover
              </button>
            </div>
            <div className="flex justify-center gap-5">
              <span className="text-gray-500">Can't get OTP?</span>
              <button className="text-red-500 underline">Resend</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Recovery;
