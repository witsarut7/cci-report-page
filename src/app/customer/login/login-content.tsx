"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { login } from "./action";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function LoginContent() {
  const schema = yup.object().shape({
    email: yup.string().required("*กรุณากรอก email"),
    password: yup.string().required("*กรุณากรอกรหัสผ่าน"),
  });
  type FormData = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "all",
  });
  const onSubmit = async (data: FormData) => {
    const { email, password } = data;
    const result = await login(email, password);
    if (result?.status === 401) {
      toast.error(`${result.message}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Flip,
      });
    }
    return false;
  };

  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <ToastContainer stacked />
      <div className="p-14 bg-white rounded-3xl shadow-md lg:max-w-xl flex items-center justify-center flex-col md:w-[400px] md:h-[536px]">
        <Image
          width={160}
          height={160}
          src={"/cci-logo.png"}
          alt="Picture of the author"
        />
        <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8">
            <label htmlFor="email" className="block md:text-base">
              อีเมล
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="กรอกอีเมล"
              className="md:text-base md:w-[288px] md:h-[40px] block px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {/* {errors.email && (
              <span className="text-red-700">{errors.email.message}</span>
            )} */}
          </div>

          <div className="mb-8">
            <label htmlFor="password" className="block md:text-base">
              รหัสผ่าน
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={passwordVisible ? "text" : "password"}
                placeholder="กรอกรหัสผ่าน"
                className="md:text-base md:w-[288px] md:h-[40px] block px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {/* {errors.password && (
              <span className="text-red-700">{errors.password.message}</span>
            )} */}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 px-3 py-2 bg-transparent"
              >
                {passwordVisible ? (
                  <AiOutlineEye className="md:w-[24px] md:h-[24px] text-[#A6A6A6]" />
                ) : (
                  <AiOutlineEyeInvisible className="md:w-[24px] md:h-[24px] text-[#A6A6A6]" />
                )}
              </button>
            </div>
          </div>

          <div className="mt-2">
            {isSubmitting ? (
              <button
                disabled={isSubmitting}
                className="md:text-base w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-600 rounded-md focus:outline-none focus:bg-blue-600"
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="#1C64F2"
                  ></path>
                </svg>
                Loading...
              </button>
            ) : (
              <button className="md:text-base w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-[#002DCD] rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                ยืนยัน
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
