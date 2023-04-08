import avator from "../assets/avator.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputBox from "../components/InputBox";
import { useAuthStore } from "../store/store";
import useFetch from "../hooks/useFetch";
import { useState } from "react";
import convertToBase64 from "../utility/convert";
import { updateUser } from "../utility/axios";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  email: yup.string().email().required("Email Required!"),
  username: yup.string().required("Username Required!"),
  firstName: yup.string(),
  lastName: yup.string(),
  phoneNumber: yup.string(),
  address: yup.string(),
});

function Profile() {
  const [selectedFile, setSelectedFile] = useState("");
  const  username  = JSON.parse(localStorage.getItem("username")) || useAuthStore((state) => state.auth.username);
  const [{ isLoading, apiData, serverError, status }] = useFetch(
    `/user/${username}`
  );
  // console.log(
  //   "isLoading:",
  //   isLoading,
  //   "apiData:",
  //   apiData,
  //   "status:",
  //   status,
  //   "serverError:",
  //   serverError
  // );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  function onSubmit(formData) {
    const resPromise = updateUser({
      ...formData,
      profile: selectedFile === "" ? apiData.user.profile : selectedFile,
    });
    console.log(
      "🚀 ~ file: Profile.jsx:46 ~ onSubmit ~ resPromise:",
      resPromise
    );
    toast.promise(resPromise, {
      loading: "Updating...",
      success: "Update successfully!",
      error: "update failed...",
    });
    resPromise
      .then(({ data, status }) => {
        console.log({ data, status });
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
            <h4 className="text-bold text-5xl">Profile</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-400">
              You can edit your information here!
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
                  src={selectedFile || apiData?.user.profile || avator}
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
            <div className="textbox grid grid-cols-2 items-center gap-3">
              <InputBox
                type="text"
                placeholder="Email"
                register={register("email")}
                errors={errors.email}
                defaultValue={apiData?.user?.email}
              />
              <InputBox
                type="text"
                placeholder="Username"
                register={register("username")}
                errors={errors.username}
                defaultValue={apiData?.user?.username}
              />
              <InputBox
                type="text"
                placeholder="First Name"
                register={register("firstName")}
                errors={errors.firstname}
                defaultValue={apiData?.user?.firstName || ""}
              />
              <InputBox
                type="text"
                placeholder="Last Name"
                register={register("lastName")}
                errors={errors.lastname}
                defaultValue={apiData?.user?.lastName || ""}
              />
              <InputBox
                type="text"
                placeholder="Phone Number"
                register={register("phoneNumber")}
                errors={errors.phone_number}
                defaultValue={apiData?.user?.phoneNumber || ""}
              />
              <InputBox
                type="text"
                placeholder="Address"
                register={register("address")}
                errors={errors.address}
                defaultValue={apiData?.user?.address || ""}
              />
              <button
                className="col-span-2 px-4 py-3 rounded-md bg-indigo-500 text-white w-full hover:bg-purple-500"
                type="submit"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
