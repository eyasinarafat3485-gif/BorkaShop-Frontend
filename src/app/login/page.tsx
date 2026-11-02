import React from "react";
import { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Login – Borka Shop | Account Sign In",
  description:
    "Sign in to your Borka Shop account to track orders, access your modest fashion wishlist, and manage delivery addresses.",
};

export default function LoginPage() {
  return <LoginClient />;
}
