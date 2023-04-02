import React from "react";

export default function InputBox({type="text",placeholder,register, errors}) {
  return (
    <div>
      <input
        {...register}
        className="px-4 py-3 rounded-md bg-gray-50 text-black w-full outline-none"
        type={type}
        placeholder={placeholder}
      />
      <p className="error-text">{errors?.message}</p>
    </div>
  );
}
