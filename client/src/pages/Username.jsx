import Query from "../components/Query";
import avator from "../assets/avator.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getUser } from "../utility/axios";
import { useAuthStore } from "../store/store";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const schema = yup.object().shape({
  username: yup.string().required("Username Required!"),
});

function Username() {
  const [isUserValid, setIsUserValid] = useState("");
  const navigate = useNavigate();
  const setUsername = useAuthStore((state) => state.setUsername);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });



  async function onSubmit(formData) {
    setUsername(formData.username);
    localStorage.setItem('username',JSON.stringify(formData.username))
    const resPromise = getUser(formData.username);
    console.log(resPromise);
    resPromise
      .then(({ data, status }) => {
        console.log({data, status});
        if (status === 201) {
          setIsUserValid(true);
          navigate("/password");
        }
      })
      .catch((error) => {
        console.log(error)
        setIsUserValid(false);
      });
  }

  return (
    <div className="container mx-auto font-Ubuntu">
      <div className="flex justify-center items-center h-screen">
        <div className="border-4 w-[400px] h-[75%] border-gray-300 shadow-xl backdrop-blur-md rounded-2xl px-5 py-3">
          <div className="title flex flex-col items-center">
            <h4 className="text-bold text-5xl">Hello!</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-400">
              Explore more by connecting us
            </span>
          </div>

          <form className="py-1 space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="profile flex justify-center py-4">
              <img
                className="w-[200px] h-[200px] object-cover rounded-full"
                src={avator}
                alt="avator"
              />
            </div>
            <div className="textbox flex flex-col items-center gap-3">
              <input
                {...register("username")}
                className="px-4 py-3 rounded-md bg-gray-50 text-black w-full outline-none"
                type="text"
                placeholder="Username"
              />
              <p className="text-red-500">
                {errors.username?.message}
                {isUserValid === false && "User not Found"}
              </p>
              <button
                className="px-4 py-3 rounded-md bg-indigo-500 text-white w-full hover:bg-purple-500"
                type="submit"
              >
                Let's go
              </button>
            </div>
            <Query
              query="Not a member yet?"
              linkText="register"
              link="/register"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Username;
