import React from "react";
import { Metadata } from "next";
import AboutUsClient from "./AboutUsClient";

export const metadata: Metadata = {
  title: "About Us – Borka Shop",
  description:
    "Learn about Borka Shop, Bangladesh's trusted modest fashion brand. Discover our craftsmanship workflow, fabric standards, brand growth, and customer commitment.",
};

export default function AboutUsPage() {
  return <AboutUsClient />;
}
