import React from "react";

export default function InputBox({type="text",placeholder,register, errors, defaultValue}) {
  return (
    <div className="w-full">
      <input
        {...register}
        className="px-4 py-3 rounded-md bg-gray-50 text-black w-full outline-none"
        type={type}
        defaultValue={defaultValue || ""}
        placeholder={placeholder}
      />
      <p className="error-text">{errors?.message}</p>
    </div>
  );
}
