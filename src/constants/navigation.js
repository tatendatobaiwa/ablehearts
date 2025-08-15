/**
 * Navigation constants for consistent routing across the application
 */

export const ROUTES = {
  HOME: '/',
  ABOUT_US: '/about-us',
  PROGRAMS: '/programs-and-initiatives',
  GET_INVOLVED: '/get-involved',
  GALLERY: '/gallery',
  SHOP: '/shop',
  TERMS: '/terms-of-use',
  PRIVACY: '/privacy-policy',
  UB_APP: '/ablehearts-ub',
  BIUST_APP: '/ablehearts-biust'
};

export const NAVIGATION_ITEMS = [
  { to: ROUTES.HOME, label: "Home" },
  { to: ROUTES.ABOUT_US, label: "About Us" },
  { to: ROUTES.PROGRAMS, label: "Programs" },
  { to: ROUTES.GET_INVOLVED, label: "Get Involved" },
  { to: ROUTES.GALLERY, label: "Gallery" },
  { to: ROUTES.SHOP, label: "Shop" }
];

export const FOOTER_LINKS = [
  { to: ROUTES.PROGRAMS, label: "Programs & Initiatives" },
  { to: ROUTES.GET_INVOLVED, label: "Get Involved" },
  { to: ROUTES.SHOP, label: "Shop" },
  { to: ROUTES.ABOUT_US, label: "About Us" }
];

export const SOCIAL_LINKS = [
  {
    href: "https://web.facebook.com/ableheartsfoundation/?_rdc=1&_rdr#",
    label: "AbleHearts on Facebook",
    icon: "facebook"
  },
  {
    href: "https://www.instagram.com/ableheartsfoundation/?hl=en",
    label: "AbleHearts on Instagram", 
    icon: "instagram"
  },
  {
    href: "https://wa.me/26771422300",
    label: "AbleHearts on WhatsApp",
    icon: "whatsapp"
  }
];

export const CONTACT_INFO = {
  email: "ableheartsfoundation@gmail.com",
  phone: "+267 71 422 300",
  location: "Botswana"
};