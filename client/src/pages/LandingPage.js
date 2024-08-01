import React from "react";
import NavBar from "../components/HomeNaveBar";
import Hero from "../components/Hero";
import USP from "../components/USP";
import CTA from "../components/CTA";
import Testimonies from "../components/Testimonies";
import Pricing from "../components/Pricing";
import FAQs from "../components/FAQs";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Features from "../components/Features";

export default function LandingPage() {
  return (
    <>
      <NavBar />
      <Hero />
      <USP />
      <Features />
      <Testimonies />
      <Pricing />
      <FAQs />
      <Contact />
      <CTA />
      <Footer />
    </>
  );
}
