import React from "react";
import { Metadata } from "next";
import FaqClient from "./FaqClient";

export const metadata: Metadata = {
  title: "FAQS – Borka Shop",
  description:
    "Frequently Asked Questions about delivery, payment, exchange, and sizing at Borka Shop Bangladesh.",
};

export default function FaqPage() {
  return <FaqClient />;
}
