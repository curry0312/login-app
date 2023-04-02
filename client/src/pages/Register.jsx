import { Link } from "react-router-dom";
import avator from "../assets/avator.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import convertToBase64 from "../utility/convert";
import Query from "../components/Query";

const schema = yup.object().shape({
  email: yup.string().email().required("Email Required!"),
  username: yup.string().required("Username Required!"),
  password: yup.string().min(4).required("Password Required!"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Two passwords must be the same"),
});

function Register() {
  const [selectedFile, setSelectedFile] = useState();

  useEffect(() => {
    console.log(selectedFile);
  }, [selectedFile]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  function onSubmit(data) {
    console.log(data);
    reset();
  }

  async function onUpload(e){
    const base64 = await convertToBase64(e.target.files[0])
    setSelectedFile(base64)
  }

  return (
    <div className="container mx-auto font-Ubuntu">
      <div className="flex justify-center items-center min-h-screen py-10">
        <div className="border-4 w-[400px] min-h-[75%] border-gray-300 shadow-xl backdrop-blur-md rounded-2xl px-5 py-3">
          <div className="title flex flex-col items-center">
            <h4 className="text-bold text-5xl">Register</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-400">
              Welcome to our home!
            </span>
          </div>

          <form className="py-1 space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col justify-center items-center py-4">
              <label htmlFor="avator" className="flex justify-center items-center bg-gray-200 w-[210px] h-[210px] rounded-full cursor-pointer hover:bg-red-600">
                <img
                  className="w-[200px] h-[200px] object-cover rounded-full"
                  src={selectedFile ? selectedFile : avator}
                  alt="avator"
                />
              </label>
              <input
                className="hidden"
                id="avator"
                type="file"
                {...register("file")}
                onChange={onUpload}
              />
            </div>
            <div className="textbox flex flex-col items-center gap-3">
              <input
                {...register("email")}
                className="px-4 py-3 rounded-md bg-gray-50 text-black w-full outline-none"
                type="text"
                placeholder="Email"
              />
              <p className="text-red-500">{errors.email?.message}</p>
              <input
                {...register("username")}
                className="px-4 py-3 rounded-md bg-gray-50 text-black w-full outline-none"
                type="text"
                placeholder="Username"
              />
              <p className="text-red-500">{errors.username?.message}</p>
              <input
                {...register("password")}
                className="px-4 py-3 rounded-md bg-gray-50 text-black w-full outline-none"
                type="text"
                placeholder="Password"
              />
              <p className="text-red-500">{errors.password?.message}</p>
              <input
                {...register("confirm_password")}
                className="px-4 py-3 rounded-md bg-gray-50 text-black w-full outline-none"
                type="text"
                placeholder="Repeat Password"
              />
              <p className="text-red-500">{errors.confirmPassword?.message}</p>
              <button
                className="px-4 py-3 rounded-md bg-indigo-500 text-white w-full hover:bg-purple-500"
                type="submit"
              >
                Register
              </button>
            </div>
            <Query query="Already have an account?" linkText="Login" link="/" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
