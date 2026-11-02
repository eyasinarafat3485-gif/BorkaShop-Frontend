import React from "react";
import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us – Borka Shop | Customer Support & Showroom",
  description:
    "Get in touch with Borka Shop customer care. Call us at 01793-679254, WhatsApp direct chat, email support, or visit our Dhanmondi Dhaka showroom.",
  keywords: [
    "borka shop contact",
    "burqa shop phone number",
    "borka shop dhanmondi",
    "borka shop customer care",
    "borka shop whatsapp",
  ],
};

export default function ContactPage() {
  return <ContactClient />;
}
