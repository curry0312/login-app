import { Link } from "react-router-dom";
import avator from "../assets/avator.png";
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Query from "../components/Query";

const schema = yup.object().shape({
  password: yup.string().min(4)
})

function Password() {
  const {register, handleSubmit, reset, formState:{errors}} = useForm({
    resolver: yupResolver(schema)
  })
  function onSubmit(data){
    console.log(data)
    reset()
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
                {...register('password')}
                className="px-4 py-3 rounded-md bg-gray-50 text-black w-full outline-none"
                type="text"
                placeholder="Password"
              />
              <p className="text-red-500">{errors.password?.message}</p>
              <button
                className="px-4 py-3 rounded-md bg-indigo-500 text-white w-full hover:bg-purple-500"
                type="submit"
              >
                Login In
              </button>
            </div>
            <Query query="Forget Password?" linkText="Recover" link="/recovery" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Password;

