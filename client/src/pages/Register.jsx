import avator from "../assets/avator.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import convertToBase64 from "../utility/convert";
import Query from "../components/Query";
import { registerUser } from "../utility/axios";
import InputBox from "../components/InputBox";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  email: yup.string().email().required("Email Required!"),
  username: yup.string().required("Username Required!"),
  password: yup.string().min(4).required("Password Required!"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Two passwords must be the same"),
});

function Register() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function onSubmit(formData) {
    console.log("formData:", formData);
    const newFormData = Object.assign(formData, { profile: selectedFile });
    let resPromise = registerUser(newFormData);
    console.log(resPromise);
    toast.promise(resPromise, {
      loading: "Creating...",
      success: "You are ours member now!",
      error: "You are already ours member!",
    });
    resPromise
      .then(({ data, status }) => {
        console.log({ data, status });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function onUpload(e) {
    const base64 = await convertToBase64(e.target.files[0]);
    setSelectedFile(base64);
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
              <label
                htmlFor="avator"
                className="flex justify-center items-center bg-gray-200 w-[210px] h-[210px] rounded-full cursor-pointer hover:bg-red-600"
              >
                <img
                  className="w-[200px] h-[200px] object-cover rounded-full"
                  src={selectedFile ? selectedFile : avator}
                  alt="avator"
                />
              </label>
              <input
                className="w-0"
                id="avator"
                type="file"
                onChange={onUpload}
              />
            </div>
            <div className="textbox flex flex-col items-center gap-3">
              <InputBox
                type="text"
                placeholder="Email"
                register={register("email")}
                errors={errors.email}
              />

              <InputBox
                type="text"
                placeholder="Username"
                register={register("username")}
                errors={errors.username}
              />
              <InputBox
                type="text"
                placeholder="Password"
                register={register("password")}
                errors={errors.password}
              />
              <InputBox
                type="text"
                placeholder="Repeat Password"
                register={register("confirmPassword")}
                errors={errors.confirmPassword}
              />
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
