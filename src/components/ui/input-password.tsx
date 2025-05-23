import { useState } from "react";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export const PasswordInput = ({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="relative">
        <input
          type={isPasswordVisible ? "text" : "password"}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div
          className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          {/* {isPasswordVisible ? (
            <AiOutlineEyeInvisible className="w-5 h-5 text-gray-500" />
          ) : (
            <AiOutlineEye className="w-5 h-5 text-gray-500" />
          )} */}
        </div>
      </div>
    </div>
  );
};
