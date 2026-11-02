import React from "react";
import { Metadata } from "next";
import SizeGuideClient from "./SizeGuideClient";

export const metadata: Metadata = {
  title: "Size Guide – Borka Shop",
  description:
    "Official Size Guide for Borka Shop. Find your perfect Abaya, Burqa, and Hijab size based on height, bust, and sleeve measurements.",
};

export default function SizeGuidePage() {
  return <SizeGuideClient />;
}
