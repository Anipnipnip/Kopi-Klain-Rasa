import logo from "./logo.jpg";
import search_icon from "./search_icon.svg";
import remove_icon from "./remove_icon.svg";
import arrow_right_icon_colored from "./arrow_right_icon_colored.svg";
import star_icon from "./star_icon.svg";
import star_dull_icon from "./star_dull_icon.svg";
import cart_icon from "./cart_icon.svg";
import nav_cart_icon from "./nav_cart_icon.svg";
import add_icon from "./add_icon.svg";
import refresh_icon from "./refresh_icon.svg";
import product_list_icon from "./product_list_icon.svg";
import order_icon from "./order_icon.svg";
import upload_area from "./upload_area.png";
import profile_icon from "./profile_icon.png";
import menu_icon from "./menu_icon.svg";
import delivery_truck_icon from "./delivery_truck_icon.svg";
import leaf_icon from "./leaf_icon.svg";
import coin_icon from "./coin_icon.svg";
import box_icon from "./box_icon.svg";
import trust_icon from "./trust_icon.svg";
import black_arrow_icon from "./black_arrow_icon.svg";
import white_arrow_icon from "./white_arrow_icon.svg";
import main_banner_bg from "./main_banner_bg.png";
import main_banner_bg_sm from "./main_banner_bg_sm.png";
import bottom_banner_image from "./bottom_banner_image.png";
import bottom_banner_image_sm from "./bottom_banner_image_sm.png";
import add_address_iamge from "./add_address_image.svg";
import transactions_icon from './transaction_icon.png'

import klain_food from "./klain_food.png";
import klain_snack from "./klain_snack.png";
import klain_drink from "./klain_drink.png";
import klain_hot from "./klain_hot.png";

import krig1 from "./krig1.jpg";
import krig2 from "./krig2.jpg";
import krig3 from "./krig3.jpg";
import krig4 from "./krig4.jpg";
import krig5 from "./krig5.jpg";
import krig6 from "./krig6.jpg";
import krig7 from "./krig7.jpg";
import krig8 from "./krig8.jpg";
import logo_footer from "./logo_footer.png";
import kr_banner from "./kr_banner.png";
import bginstagram from "./bginstagram.png";
import ig_icon from "./ig_icon.png"

export const assets = {
  logo,
  search_icon,
  remove_icon,
  arrow_right_icon_colored,
  star_icon,
  star_dull_icon,
  cart_icon,
  nav_cart_icon,
  add_icon,
  refresh_icon,
  product_list_icon,
  order_icon,
  upload_area,
  profile_icon,
  menu_icon,
  delivery_truck_icon,
  leaf_icon,
  coin_icon,
  trust_icon,
  black_arrow_icon,
  white_arrow_icon,
  main_banner_bg,
  main_banner_bg_sm,
  bottom_banner_image,
  bottom_banner_image_sm,
  add_address_iamge,
  box_icon,
  klain_food,
  klain_snack,
  klain_drink,
  klain_hot,
  krig1,
  krig2,
  krig3,
  krig4,
  krig5,
  krig6,
  krig7,
  krig8,
  logo_footer,
  kr_banner,
  bginstagram,
  ig_icon,
  transactions_icon
};

export const categories = [
  {
    text: "Food",
    path: "food",
    image: klain_food,
    bgColor: "#FEF6DA",
  },
  {
    text: "Snack",
    path: "snack",
    image: klain_snack,
    bgColor: "#FEF6DA",
  },
  {
    text: "Drink",
    path: "drink",
    image: klain_drink,
    bgColor: "#FEF6DA",
  },
   {
    text: "Hot",
    path: "hot",
    image: klain_hot,
    bgColor: "#FEF6DA",
  },
];

export const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { text: "Home", url: "#" },
      { text: "Best Sellers", url: "#" },
      { text: "Offers & Deals", url: "#" },
      { text: "Contact Us", url: "#" },
      { text: "FAQs", url: "#" },
    ],
  },
  {
    title: "Need help?",
    links: [
      { text: "Delivery Information", url: "#" },
      { text: "Return & Refund Policy", url: "#" },
      { text: "Payment Methods", url: "#" },
      { text: "Track your Order", url: "#" },
      { text: "Contact Us", url: "#" },
    ],
  },
  {
    title: "Follow Us",
    links: [
      { text: "Instagram", url: "#" },
      { text: "Twitter", url: "#" },
      { text: "Facebook", url: "#" },
      { text: "YouTube", url: "#" },
    ],
  },
];

export const features = [
  {
    icon: delivery_truck_icon,
    title: "Fastest Delivery",
    description: "Groceries delivered in under 30 minutes.",
  },
  {
    icon: leaf_icon,
    title: "Freshness Guaranteed",
    description: "Fresh produce straight from the source.",
  },
  {
    icon: coin_icon,
    title: "Affordable Prices",
    description: "Quality groceries at unbeatable prices.",
  },
  {
    icon: trust_icon,
    title: "Trusted by Thousands",
    description: "Loved by 10,000+ happy customers.",
  },
];


export const testimonials = [
  {
    id: 1,
    text: "Kopinya enak banget, aromanya khas dan bikin semangat pagi hari!",
    author: "Dina Pratiwi",
    role: "Mahasiswi"
  },
  {
    id: 2,
    text: "Tempatnya cozy, pas buat nongkrong bareng temen atau kerja remote.",
    author: "Andi Saputra",
    role: "Freelancer"
  },
  {
    id: 3,
    text: "Snacknya gurih dan variatif, cocok banget dipadukan sama kopi.",
    author: "Rizky Firmansyah",
    role: "Karyawan Swasta"
  },
  {
    id: 4,
    text: "Pelayanannya ramah, vibes cafenya bikin betah berlama-lama.",
    author: "Sarah Nurhaliza",
    role: "Content Creator"
  }
];
