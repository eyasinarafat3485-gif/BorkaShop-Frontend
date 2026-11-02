import React from "react";
import { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout – Borka Shop",
  description:
    "Complete your modest fashion order with Cash on Delivery at Borka Shop Bangladesh. Easy exchange and nationwide home delivery.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
