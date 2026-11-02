import React from "react";
import { Metadata } from "next";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = {
  title: "Register – Borka Shop | Create Customer Account",
  description:
    "Create your Borka Shop account for fast modest fashion checkout, saved delivery addresses, and order tracking.",
};

export default function RegisterPage() {
  return <RegisterClient />;
}
