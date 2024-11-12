// MobileFooter.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./MobileFooter.module.css";

export default function MobileFooter() {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/",
      label: "카드혜택",
      icon: (
        <svg
          width="29"
          height="25"
          viewBox="0 0 29 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.svg}
        >
          <path
            d="M0.75 12.5C0.75 7.31455 0.75 4.72183 2.36091 3.11091C3.97183 1.5 6.56455 1.5 11.75 1.5H17.25C22.4354 1.5 25.0282 1.5 26.639 3.11091C28.25 4.72183 28.25 7.31455 28.25 12.5C28.25 17.6854 28.25 20.2782 26.639 21.889C25.0282 23.5 22.4354 23.5 17.25 23.5H11.75C6.56455 23.5 3.97183 23.5 2.36091 21.889C0.75 20.2782 0.75 17.6854 0.75 12.5Z"
            stroke="currentColor"
            stroke-width="1.5"
          />
          <path
            d="M11.75 18.6875H6.25"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M9 14.5625H6.25"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M0.75 9.75H28.25"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M17.25 16.625C17.25 15.3287 17.25 14.6805 17.6527 14.2777C18.0555 13.875 18.7037 13.875 20 13.875C21.2963 13.875 21.9445 13.875 22.3473 14.2777C22.75 14.6805 22.75 15.3287 22.75 16.625C22.75 17.9213 22.75 18.5695 22.3473 18.9723C21.9445 19.375 21.2963 19.375 20 19.375C18.7037 19.375 18.0555 19.375 17.6527 18.9723C17.25 18.5695 17.25 17.9213 17.25 16.625Z"
            stroke="currentColor"
            stroke-width="1.5"
          />
        </svg>
      ),
    },
    {
      href: "/banking",
      label: "뱅킹서비스",
      icon: (
        <svg
          className={styles.svg}
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.5125 6.73748L23.0005 11.4432L24.0284 9.80933L15.5145 4.45898L6.97266 9.8006L7.99654 11.4365L15.5125 6.73748Z"
            fill="currentColor"
          />
          <path
            d="M21.7768 12.2852H19.8467V19.7413H21.7768V12.2852Z"
            fill="currentColor"
          />
          <path
            d="M16.4648 12.2852H14.5347V19.7413H16.4648V12.2852Z"
            fill="currentColor"
          />
          <path
            d="M11.1518 12.2852H9.22168V19.7413H11.1518V12.2852Z"
            fill="currentColor"
          />
          <path
            d="M23.4684 21.1699H7.53125V23.1001H23.4684V21.1699Z"
            fill="currentColor"
          />
          <path
            d="M15.5 30.8823C24.0457 30.8823 31 23.955 31 15.4412C31 6.92736 24.0457 0 15.5 0C6.95431 0 0 6.92635 0 15.4412C0 23.956 6.95431 30.8823 15.5 30.8823ZM15.5 1.93016C22.9822 1.93016 29.0698 7.99079 29.0698 15.4412C29.0698 22.8915 22.9822 28.9522 15.5 28.9522C8.0178 28.9522 1.93016 22.8905 1.93016 15.4412C1.93016 7.9918 8.0178 1.93016 15.5 1.93016Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      href: "/travel",
      label: "여행선택",
      icon: (
        <svg
          className={styles.svg}
          width="31"
          height="20"
          viewBox="0 0 31 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M25.7538 14.9639C26.0714 14.6066 26.0393 14.0597 25.682 13.7421C25.3248 13.4245 24.7778 13.4567 24.4602 13.8139L25.7538 14.9639ZM18.1836 22.1778L18.7956 22.7896L18.8134 22.7716L18.8304 22.7527L18.1836 22.1778ZM16.2485 23.1346V24H16.2854L16.322 23.9967L16.2485 23.1346ZM17.9998 14.8756C18.2686 14.4805 18.1663 13.9422 17.7709 13.6734C17.3758 13.4046 16.8375 13.507 16.5687 13.9022L17.9998 14.8756ZM33.0787 13.2278L34.3311 15.7327L35.8792 14.9587L34.6267 12.4536L33.0787 13.2278ZM7.62119 15.8091L3.14987 14.0206L2.50704 15.6277L6.97835 17.4162L7.62119 15.8091ZM2.60586 13.2169V10.9272H0.875V13.2169H2.60586ZM2.60586 10.9272V4.86914H0.875V10.9272H2.60586ZM3.47129 4.00371H5.12628V2.27285H3.47129V4.00371ZM5.92499 4.5359L8.2865 10.1961L9.88391 9.52951L7.5224 3.86943L5.92499 4.5359ZM10.6826 11.7926H30.7564V10.0617H10.6826V11.7926ZM24.4602 13.8139L17.5368 21.6028L18.8304 22.7527L25.7538 14.9639L24.4602 13.8139ZM16.2485 22.2691H14.527V24H16.2485V22.2691ZM13.7355 21.1446L17.9998 14.8756L16.5687 13.9022L12.3044 20.1712L13.7355 21.1446ZM14.527 22.2691C13.9789 22.2691 13.5773 21.7682 13.6751 21.2486L11.9741 20.9284C11.6792 22.4947 12.8755 24 14.527 24V22.2691ZM17.5716 21.5657C17.0916 22.0457 16.9917 22.1298 16.909 22.1707C16.8472 22.2011 16.7728 22.2212 16.1747 22.2723L16.322 23.9967C16.7939 23.9566 17.2543 23.9308 17.6763 23.7222C18.0773 23.5238 18.4102 23.1751 18.7956 22.7896L17.5716 21.5657ZM33.5571 16.9852H21.6453V18.716H33.5571V16.9852ZM14.9295 16.9852H13.7281V18.716H14.9295V16.9852ZM24.9415 10.4181L18.5365 1.61121L17.1366 2.62925L23.5416 11.4362L24.9415 10.4181ZM16.4368 0.541992H15.0413V2.27285H16.4368V0.541992ZM12.762 4.38152L16.5585 11.3415L18.0778 10.5128L14.2815 3.55268L12.762 4.38152ZM15.0413 0.541992C13.0705 0.541992 11.8183 2.65141 12.762 4.38152L14.2815 3.55268C13.967 2.97599 14.3844 2.27285 15.0413 2.27285V0.541992ZM18.5365 1.61121C18.0479 0.939432 17.2674 0.541992 16.4368 0.541992V2.27285C16.7136 2.27285 16.9739 2.40533 17.1366 2.62925L18.5365 1.61121ZM8.2865 10.1961C8.68991 11.1629 9.63493 11.7926 10.6826 11.7926V10.0617C10.3334 10.0617 10.0184 9.85179 9.88391 9.52951L8.2865 10.1961ZM5.12628 4.00371C5.47552 4.00371 5.79052 4.21359 5.92499 4.5359L7.5224 3.86943C7.11898 2.90254 6.17397 2.27285 5.12628 2.27285V4.00371ZM3.14987 14.0206C2.8213 13.8892 2.60586 13.5709 2.60586 13.2169H0.875C0.875 14.2786 1.52134 15.2334 2.50704 15.6277L3.14987 14.0206ZM6.97835 17.4162C9.1251 18.2748 11.416 18.716 13.7281 18.716V16.9852C11.6362 16.9852 9.56348 16.586 7.62119 15.8091L6.97835 17.4162ZM12.3044 20.1712C12.1857 20.3456 12.0353 20.6032 11.9741 20.9284L13.6751 21.2486C13.6735 21.2571 13.6729 21.2533 13.6818 21.2346C13.691 21.215 13.7073 21.1861 13.7355 21.1446L12.3044 20.1712ZM34.3311 15.7327C34.6188 16.3081 34.2004 16.9852 33.5571 16.9852V18.716C35.487 18.716 36.7424 16.6849 35.8792 14.9587L34.3311 15.7327ZM2.60586 4.86914C2.60586 4.39116 2.99333 4.00371 3.47129 4.00371V2.27285C2.03739 2.27285 0.875 3.43524 0.875 4.86914H2.60586ZM34.6267 12.4536C33.8937 10.9878 32.3955 10.0617 30.7564 10.0617V11.7926C31.7398 11.7926 32.6388 12.3482 33.0787 13.2278L34.6267 12.4536Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      href: "/mypage",
      label: "마이페이지",
      icon: (
        <svg
          width="35"
          height="35"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.svg}
        >
          <path
            d="M15.1598 16.04C15.0665 16.0267 14.9465 16.0267 14.8398 16.04C12.4932 15.96 10.6265 14.04 10.6265 11.68C10.6265 9.26664 12.5732 7.30664 14.9998 7.30664C17.4132 7.30664 19.3732 9.26664 19.3732 11.68C19.3598 14.04 17.5065 15.96 15.1598 16.04Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M23.9865 24.8401C21.6132 27.0134 18.4665 28.3334 14.9998 28.3334C11.5332 28.3334 8.38652 27.0134 6.01318 24.8401C6.14652 23.5867 6.94652 22.3601 8.37318 21.4001C12.0265 18.9734 17.9998 18.9734 21.6265 21.4001C23.0532 22.3601 23.8532 23.5867 23.9865 24.8401Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M14.9998 28.3337C22.3636 28.3337 28.3332 22.3641 28.3332 15.0003C28.3332 7.63653 22.3636 1.66699 14.9998 1.66699C7.63604 1.66699 1.6665 7.63653 1.6665 15.0003C1.6665 22.3641 7.63604 28.3337 14.9998 28.3337Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.mobile}>
      <footer className={styles.footer}>
        <nav className={styles.nav}>
          <ul className={styles.menuList}>
            {menuItems.map((item) => (
              <li key={item.href} className={styles.menuItem}>
                <Link href={item.href} className={styles.menuLink}>
                  <span
                    className={`${styles.iconWrapper} ${pathname === item.href ? styles.active : ""}`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`${styles.label} ${pathname === item.href ? styles.active : ""}`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </footer>
    </div>
  );
}
