"use server";

import { SignJWT, importJWK } from "jose";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import axios from "axios";

export async function login(email: string, password: string) {
  try {
    const response = await axios
      .get(`${process.env.DEALER_SERVICE_URL}`, {
        data: {
          email: email,
          password: password,
        },
      })
      .then((res) => {
        return { status: res.status, message: res.data.message };
      })
      .catch((error) => {
        return {
          status: error?.response?.status as number,
          message: error?.response?.data?.error?.message as string,
        };
      });

    if (response.status === 200) {
      // sign token
      const secretJWK = {
        kty: "oct",
        k: process.env.JOSE_SECRET,
      };
      const secretKey = await importJWK(secretJWK, "HS256");
      const token = await new SignJWT({ email, password })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(secretKey);
      cookies().set("back-office", token);
      redirect("/customer/dashboard");
    } else {
      return {
        status: response.status,
        message: response.message,
      };
    }
  } catch (error) {
    throw error;
  }
}
