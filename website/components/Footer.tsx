"use client";

import { useState } from "react";
import Link from "next/link";
import { FiClock, FiPhone, FiMapPin } from "react-icons/fi";
import { FaInstagram, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";

const fullText =
  "Restaurant \"Demo Digital Menu\", located in the heart of the city, invites you to feel like royalty and savor the finest dishes from North Indian, South Indian, and Mughlai cuisines. Along with delicious and affordably priced dishes and beverages, every Friday and Saturday you'll enjoy live music that creates a warm, cozy atmosphere for relaxing with family and friends.";

export default function Footer() {
  const [expanded, setExpanded] = useState(false);

  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Expandable description card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p
            className={`text-sm leading-relaxed text-gray-800 ${
              expanded ? "" : "line-clamp-3"
            }`}
          >
            {fullText}
          </p>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-2 text-sm font-medium text-blue-600 hover:underline"
          >
            {expanded ? "Collapse Text" : "Expand Text"}
          </button>
        </div>

        {/* Three info columns */}
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* About the venue */}
          <div>
            <h3 className="mb-4 text-base font-bold text-gray-900">
              About the venue
            </h3>
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400">
                <FiClock className="h-5 w-5 text-black" />
              </span>
              <p className="text-sm text-gray-800">
                Today we are open from 11:00 AM
                <br />and close at 11:00 PM
              </p>
            </div>
          </div>

          {/* Contact details */}
          <div>
            <h3 className="mb-4 text-base font-bold text-gray-900">
              Contact details
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400">
                  <FiPhone className="h-5 w-5 text-black" />
                </span>
                <p className="text-sm text-gray-800">
                  Phone:
                  <br />
                  <span className="font-semibold">+91 98765 43210</span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400">
                  <FiMapPin className="h-5 w-5 text-black" />
                </span>
                <p className="text-sm text-gray-800">
                  MG Road, Shop No. 12, Near City Center Mall, Bhopal, Madhya Pradesh 462001
                </p>
              </div>
            </div>
          </div>

          {/* Social media */}
          <div>
            <h3 className="mb-4 text-base font-bold text-gray-900">
              We are on social media
            </h3>
            <div className="flex flex-col gap-4">
              <Link href="#" className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400">
                  <FaInstagram className="h-5 w-5 text-black" />
                </span>
                <span className="text-sm text-gray-800">instagram</span>
              </Link>
              <Link href="#" className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400">
                  <FaTelegramPlane className="h-5 w-5 text-black" />
                </span>
                <span className="text-sm text-gray-800">telegram</span>
              </Link>
              <Link href="#" className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400">
                  <FaWhatsapp className="h-5 w-5 text-black" />
                </span>
                <span className="text-sm text-gray-800">whatsapp</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom orange bar */}
      <div className="mx-auto max-w-7xl px-6 pb-2">
        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl bg-amber-400 px-6 py-4 sm:flex-row">
          <p className="text-sm font-medium text-black">
            © {new Date().getFullYear()} Demo QR menu
          </p>
          <Link
            href="/privacy-policy"
            className="text-sm font-medium text-black hover:underline"
          >
            Privacy Policy
          </Link>
        </div>
      </div>

      {/* Created with */}
      <p className="py-4 text-center text-sm text-gray-500">
        Designed And Developed by <span className="font-bold text-gray-700">Bluewebspark Technologies</span>
      </p>
    </footer>
  );
}