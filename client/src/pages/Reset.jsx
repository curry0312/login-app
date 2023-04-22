import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { resetPassword } from "../utility/axios";
import { useAuthStore } from "../store/store";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  password: yup
    .string()
    .min(4, "passwords must at least 4 characters")
    .required("Please enter your password."),
  confirm_password: yup
    .string()
    .required("Please enter your password again.")
    .oneOf([yup.ref("password")], "Two passwords must be the same"),
});

function Reset() {

  const navigate = useNavigate()
  const username = JSON.parse(localStorage.getItem('username')) || useAuthStore((state) => state.auth.username);

  useEffect(()=>{
    console.log('Reset')
  },[])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  function onSubmit({password}) {
    console.log(password);
    const resPromise = resetPassword({username, password})
    toast.promise(resPromise,{
      loading: "Processing....",
      success: "Reset password successfully!",
      error: "Failed to Reset password..."
    })
    resPromise.then(()=>{
      setTimeout(()=>{
        navigate("/")
      },2000)
    }).catch((error)=>{
      console.log(error)
    })
  }
  return (
    <div className="container mx-auto font-Ubuntu">
      <div className="flex justify-center items-center h-screen">
        <div className="border-4 w-[400px] h-[75%] border-gray-300 shadow-xl backdrop-blur-md rounded-2xl px-5 py-3">
          <div className="title flex flex-col items-center py-20">
            <h4 className="text-bold text-5xl">Reset</h4>
          </div>

          <form className="py-20 space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="textbox flex flex-col items-center gap-3">
              <input
                {...register("password")}
                className="px-4 py-3 rounded-md bg-gray-50 text-black w-full outline-none"
                type="text"
                placeholder="New Password"
              />
              <p className="text-red-500">{errors.password?.message}</p>
              <input
                {...register("confirm_password")}
                className="px-4 py-3 rounded-md bg-gray-50 text-black w-full outline-none"
                type="text"
                placeholder="Repeat Password"
              />
              <p className="text-red-500">{errors.confirm_password?.message}</p>
              <button
                className="px-4 py-3 rounded-md bg-indigo-500 text-white w-full hover:bg-purple-500"
                type="submit"
              >
                Login In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Reset;
