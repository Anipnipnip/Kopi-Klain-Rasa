import React from "react";
import { assets } from "../assets/assets";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { SiGojek } from "react-icons/si";

const Footer = () => {
  return (
    <div id="footer" className="w-full bg-[#3F171C] text-white py-12">
      {/* Isi Konten */}
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-8 px-4">
        {/* Logo */}
        <img src={assets.logo_footer} alt="Logo" className="w-36" />

        {/* Menu Navigasi */}
        <div className="flex flex-wrap justify-center gap-8">
          <a href="#" className="font-medium text-gray-200 hover:text-white transition">
            Home
          </a>
          <a href="#" className="font-medium text-gray-200 hover:text-white transition">
            About
          </a>
          <a href="#" className="font-medium text-gray-200 hover:text-white transition">
            Products
          </a>
          <a
            href="https://www.google.com/maps/place/Kopi+klainrasa/@-6.2557805,106.876266,17z/data=!4m15!1m8!3m7!1s0x2e69f30c7cf5f459:0xe7e979745f1bb04f!2sKopi+klainrasa!8m2!3d-6.2557805!4d106.8788409!10e1!16s%2Fg%2F11jz69vhr8!3m5!1s0x2e69f30c7cf5f459:0xe7e979745f1bb04f!8m2!3d-6.2557805!4d106.8788409!16s%2Fg%2F11jz69vhr8?entry=ttu&g_ep=EgoyMDI1MTExMi4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gray-200 hover:text-white transition"
          >
            Location
          </a>
        </div>


        {/* Ikon Sosial */}
        <div className="flex items-center gap-6 text-2xl">
          <a
            href="https://www.instagram.com/klainrasa"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition-colors duration-300"
          >
            <FaInstagram />
          </a>

          <a
            href="https://www.facebook.com/klainrasa.klainrasa?locale=id_ID"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors duration-300"
          >
            <FaFacebookF />
          </a>

          <a
            href="https://wa.me/6285890392698"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-500 transition-colors duration-300"
          >
            <FaWhatsapp />
          </a>

          <a
            href="https://gofood.link/u/0dK1WO"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-400 transition-colors duration-300"
          >
            <SiGojek />
          </a>
        </div>

        {/* Copyright */}
        <p className="mt-6 text-center text-gray-300 text-sm">
          © 2025 Your Brand. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
