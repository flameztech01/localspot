
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Heart,
  MapPin,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";
import directoryData from "../data/places.json";


// ================= LOCALSPOT ICON =================

const LocalSpotIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 22C12 22 20 14.8 20 9.5C20 5.36 16.42 2 12 2C7.58 2 4 5.36 4 9.5C4 14.8 12 22 12 22Z"
      fill="#1655F2"
    />

    <circle
      cx="12"
      cy="9.5"
      r="3"
      fill="white"
    />
  </svg>
);


// ================= HOTEL ICON =================

const HotelIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M4 19V6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    <path
      d="M4 10H16C18.2 10 20 11.8 20 14V19"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M4 14H20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    <path
      d="M7 10V7H11V10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M13 10V7H17V10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


// ================= RESTAURANT ICON =================

const RestaurantIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M6 3V10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    <path
      d="M3.5 3V8C3.5 9.38 4.62 10.5 6 10.5C7.38 10.5 8.5 9.38 8.5 8V3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M6 10.5V21"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    <path
      d="M15 3V21"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    <path
      d="M15 3C17.2 3 18.5 5 18.5 7.5V10H15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M15 10H18.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);


// ================= CAFE ICON =================

const CafeIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M5 9H17V14C17 17.31 14.31 20 11 20H11C7.69 20 5 17.31 5 14V9Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />

    <path
      d="M17 11H19C20.1 11 21 11.9 21 13C21 14.1 20.1 15 19 15H17"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    <path
      d="M8 5C8 3.9 8.9 3 10 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    <path
      d="M12 5C12 3.9 12.9 3 14 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    <path
      d="M5 21H19"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);


// ================= ATTRACTION ICON =================

const AttractionIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 21C12 21 19 14.7 19 9.2C19 5.22 15.87 2 12 2C8.13 2 5 5.22 5 9.2C5 14.7 12 21 12 21Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />

    <circle
      cx="12"
      cy="9"
      r="2.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />

    <path
      d="M8 17.5L6 21H18L16 17.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Home() {
    const [isLiked, setIsLiked] = useState(false)
  return (
    <div className="w-full bg-white overflow-x-hidden">

      {/* ================= HERO SECTION ================= */}

      <div className="relative w-full h-[650px] sm:h-[700px] md:h-[750px] lg:h-[850px] xl:h-[930px]">

        {/* Background Image */}

        <img
          src="/local.jpg"
          alt="Paris"
          className="absolute inset-0 w-full h-full object-cover"
        />


        {/* ================= NAVBAR ================= */}

        <div className="absolute z-10 top-0 left-0 w-full min-h-17.5 sm:min-h-[80px] md:h-[88px] lg:h-[92px] xl:h-[100px] bg-white flex items-center px-3 sm:px-5 md:px-8 lg:px-10 xl:px-14">

          {/* LOGO */}

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

            <LocalSpotIcon
              className="w-6 h-7 sm:w-7 sm:h-8 md:w-8 md:h-9 lg:w-8 lg:h-9"
            />

            <span className="font-geist font-medium text-[19px] sm:text-[22px] md:text-[25px] lg:text-[28px] leading-none">
              LocalSpot
            </span>

          </div>


          {/* NAV LINKS */}

          <div className="flex items-center ml-auto gap-2 sm:gap-3 md:gap-5 lg:gap-8 xl:gap-12">

            <a
              href="/"
              className="font-geist font-semibold text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] leading-none text-[#111111]"
            >
              Home
            </a>

            <a
              href="/categories"
              className="font-geist font-normal text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] leading-none text-[#111111]"
            >
              Categories
            </a>

            <a
              href="/favorites"
              className="font-geist font-normal text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] leading-none text-[#111111]"
            >
              Favorites
            </a>

          </div>


          {/* NAV SEARCH */}

          <div className="hidden sm:flex items-center ml-3 md:ml-5 lg:ml-8 xl:ml-auto w-[170px] md:w-[210px] lg:w-[300px] xl:w-[550px] h-10 md:h-12 lg:h-15 border border-[#565555] rounded-xl lg:rounded-2xl px-3 lg:px-4 gap-2 lg:gap-4">

            <Search
              size={18}
              className="text-[#2C2C2C] w-5 h-5 lg:w-7.5 lg:h-7.5 shrink-0"
            />

            <input
              type="text"
              placeholder="Search for places..."
              className="w-full min-w-0 h-5 font-geist font-normal outline-none text-[12px] lg:text-[16px]"
            />

          </div>

        </div>


        {/* ================= HERO TEXT ================= */}

        <div className="absolute z-10 left-4 sm:left-8 md:left-12 lg:left-20 top-[170px] sm:top-[200px] md:top-[250px] lg:top-[300px] xl:top-[300px] w-[calc(100%-32px)] sm:w-[600px] md:w-[700px] lg:w-[720px]">

          <div className="w-full">

            <h1 className="w-full font-geist font-semibold text-[40px] sm:text-[50px] md:text-[64px] lg:text-[72px] xl:text-[80px] leading-none">

              Explore the best
              <br />
              places in your city

            </h1>


            <p className="mt-4 w-full sm:w-[520px] md:w-[580px] lg:w-[517px] font-geist font-normal text-[17px] sm:text-[19px] md:text-[21px] lg:text-[24px] leading-tight lg:leading-none">

              Find and discover top hotels, restaurants, cafes
              <br className="hidden sm:block" />
              and attractions around you.

            </p>


            {/* HERO SEARCH */}

            <div className="mt-8 sm:mt-10 lg:mt-12 flex items-center w-full sm:w-[560px] md:w-[620px] lg:w-[712px] h-[70px] lg:h-[87px] bg-white rounded-2xl p-3 sm:p-4">

              <div className="flex items-center flex-1 min-w-0 gap-3 sm:gap-4">

                <Search
                  size={18}
                  className="text-[#111111] w-5 h-5 shrink-0"
                />

                <input
                  type="text"
                  placeholder="Search for places e.g hotels, cafes..."
                  className="w-full min-w-0 font-geist font-normal text-[13px] sm:text-[14px] lg:text-[16px] outline-none text-[#111111]"
                />

              </div>


              <button className="ml-3 bg-black w-[85px] sm:w-[105px] lg:w-[124px] h-[48px] sm:h-[52px] lg:h-[55px] rounded-lg text-white px-3 sm:px-5 lg:px-8 py-3 lg:py-4 shrink-0">

                <span className="font-geist font-medium text-[14px] sm:text-[16px] lg:text-[18px] leading-none">
                  Search
                </span>

              </button>

            </div>

          </div>

        </div>

      </div>


      {/* ================= CATEGORIES ================= */}

      <div className="w-full min-h-[270px] px-4 sm:px-6 md:px-8 lg:px-14 py-8 bg-[#FAFAF8]">

        <h2 className="w-full font-geist text-[28px] sm:text-[30px] md:text-[32px] lg:text-[36px] font-medium leading-none text-[#111111]">
          Categories
        </h2>


        {/* CATEGORY CARDS */}

        <div className="w-full flex flex-wrap justify-center items-center gap-4 sm:gap-5 md:gap-6 lg:gap-10 xl:gap-16 mt-6">


          {/* HOTEL */}

          <div className="w-[145px] sm:w-[155px] md:w-[170px] lg:w-44.25 h-[125px] sm:h-[130px] md:h-[135px] lg:h-33.75 bg-black text-white rounded-lg flex flex-col items-center justify-center gap-3 lg:gap-4 p-4">

            <HotelIcon className="w-7 h-7 lg:w-8 lg:h-8" />

            <p className="font-geist font-medium text-[17px] sm:text-[18px] lg:text-[20px] leading-none">
              Hotels
            </p>

            <span className="text-[10px] text-gray-300">
              120 places
            </span>

          </div>


          {/* RESTAURANTS */}

          <div className="w-[145px] sm:w-[155px] md:w-[170px] lg:w-44.25 h-[125px] sm:h-[130px] md:h-[135px] lg:h-33.75 bg-black text-white rounded-lg flex flex-col items-center justify-center gap-3 lg:gap-4 p-4">

            <RestaurantIcon className="w-7 h-7 lg:w-8 lg:h-8" />

            <p className="font-geist font-medium text-[17px] sm:text-[18px] lg:text-[20px] leading-none">
              Restaurants
            </p>

            <span className="text-[10px] text-gray-300">
              120 places
            </span>

          </div>


          {/* CAFES */}

          <div className="w-[145px] sm:w-[155px] md:w-[170px] lg:w-44.25 h-[125px] sm:h-[130px] md:h-[135px] lg:h-33.75 bg-black text-white rounded-lg flex flex-col items-center justify-center gap-3 lg:gap-4 p-4">

            <CafeIcon className="w-7 h-7 lg:w-8 lg:h-8" />

            <p className="font-geist font-medium text-[17px] sm:text-[18px] lg:text-[20px] leading-none">
              Cafes
            </p>

            <span className="text-[10px] text-gray-300">
              120 places
            </span>

          </div>


          {/* ATTRACTIONS */}

          <div className="w-[145px] sm:w-[155px] md:w-[170px] lg:w-44.25 h-[125px] sm:h-[130px] md:h-[135px] lg:h-33.75 bg-black text-white rounded-lg flex flex-col items-center justify-center gap-3 lg:gap-4 p-4">

            <AttractionIcon className="w-7 h-7 lg:w-8 lg:h-8" />

            <p className="font-geist font-medium text-[17px] sm:text-[18px] lg:text-[20px] leading-none">
              Attractions
            </p>

            <span className="text-[10px] text-gray-300">
              120 places
            </span>

          </div>

        </div>

      </div>


      {/* ================= TOP PLACES ================= */}

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-14 mt-7">

        <h2 className="font-geist text-[20px] font-medium leading-none text-[#111111]">
          Top Places
        </h2>


        {/* PLACE CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-3 mt-4">

          {directoryData.map((place) => (

        <div
        key={place.id}
        className="w-full h-[240px] sm:h-[250px] md:h-[270px] lg:h-[280px] xl:h-59 bg-white rounded-2xl overflow-hidden">
              {/* IMAGE */}

              <div className="relative w-full h-[240px] sm:h-[250px] md:h-[270px] lg:h-[280px] xl:h-59">

            <img
            src={place.images[0]}
            alt={place.name}
            className="w-full h-full rounded-t-2xl object-cover"/>

                {/* HEART */}

                <button onClick={(e) => {e.stopPropagation(); setIsLiked((prev) => ({ ...prev, [place.id]: !prev[place.id] }));}} className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center">


                  <Heart
                    size={20}
                    className={isLiked[place.id] ? "text-red-500 fill-red-500" : "text-[#111111]"}
                  />

                </button>

              </div>


              {/* CARD INFORMATION */}

              <div className="p-4 w-full min-h-[178px] rounded-b-2xl border gap-4 outline-none border-[#FFFFFF]">


                {/* CATEGORY */}

                <span className="inline-flex items-center bg-[#111111] text-white px-4 py-2 font-geist text-[14px] sm:text-[16px] font-medium leading-none w-auto min-w-[78px] h-9.25 rounded-lg gap-2.5 justify-center">

                  {place.category}

                </span>


                {/* NAME */}

                <h3 className="mt-3 font-geist text-[21px] sm:text-[22px] lg:text-[24px] font-medium leading-tight text-[#111111]">

                {place.name}

                </h3>


                {/* RATING */}

                <div className="flex items-center gap-1 mt-3 flex-wrap">

                  <span className="text-[#FFB800] text-[16px] w-5 h-5">
                    ★
                  </span>

                  <span className="font-geist text-[16px] sm:text-[18px] font-normal text-[#111111]">
                    {place.rating.average}
                </span>

                    <span className="font-geist text-[16px] sm:text-[18px] font-normal text-[#555555]">
                     ({place.rating.totalReviews} reviews)
                </span>

                </div>


                {/* LOCATION */}

                <div className="flex items-center gap-1.5 mt-2">

                  <MapPin
                    size={14}
                    className="text-[#111111] w-5 h-5 shrink-0"
                  />

                  <span className="font-geist text-[15px] sm:text-[17px] lg:text-[18px] font-normal text-[#555555]">
                    {place.location.address}
                  </span>

                </div>

              </div>

            </div>
          ))}

        </div>


      </div>


      {/* ================= FOOTER ================= */}

      <footer className="w-full min-h-[136px] mt-8 px-4 sm:px-6 md:px-8 lg:px-14 py-8 bg-white flex flex-col md:flex-row items-center justify-between gap-6">


        {/* LOGO */}

        <div className="flex items-center gap-2">

          <LocalSpotIcon className="w-8 h-8" />

          <span className="font-geist text-[24px] sm:text-[28px] font-medium text-[#111111]">
            LocalSpot
          </span>

        </div>


        {/* FOOTER NAVIGATION */}

        <div className="flex items-center gap-6 sm:gap-8 lg:gap-10">

          <a
            href="/"
            className="font-geist text-[16px] sm:text-[18px] lg:text-[20px] text-[#111111]"
          >
            Home
          </a>

          <a
            href="/categories"
            className="font-geist text-[16px] sm:text-[18px] lg:text-[20px] text-[#111111]"
          >
            Categories
          </a>

          <a
            href="/favorites"
            className="font-geist text-[16px] sm:text-[18px] lg:text-[20px] text-[#111111]"
          >
            Favorites
          </a>

        </div>


        {/* SOCIAL ICONS */}

        <div className="flex items-center gap-5 sm:gap-6">

          <a href="#" aria-label="Facebook">
            <FaFacebookF className="w-5 h-5 text-[#111111]" />
          </a>

          <a href="#" aria-label="Instagram">
            <FaInstagram className="w-5 h-5 text-[#111111]" />
          </a>

          <a href="#" aria-label="TikTok">
            <FaTiktok className="w-5 h-5 text-[#111111]" />
          </a>

          <a href="#" aria-label="X">
            <FaXTwitter className="w-5 h-5 text-[#111111]" />
          </a>

        </div>

      </footer>

    </div>
  );
}