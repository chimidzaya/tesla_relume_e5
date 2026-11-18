import Image from "next/image";
import Link from "next/link";
import { modelHref, models } from "@/data/models";
import { ContactForm } from "./ContactForm";
import { Logo } from "./Logo";

const socials = [
  { label: "Facebook", href: "https://www.facebook.com/tesla", icon: "/images/facebook.svg" },
  { label: "Instagram", href: "https://www.instagram.com/teslamotors", icon: "/images/instagram.svg" },
  { label: "X", href: "https://x.com/tesla", icon: "/images/x.svg" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/tesla-motors", icon: "/images/linkedin.svg" },
  { label: "YouTube", href: "https://www.youtube.com/tesla", icon: "/images/youtube.svg" },
];

const pageLinks = [
  { label: "Харьцуулалт", href: "/#compare" },
  { label: "Цэнэглэлт", href: "/#charging" },
  { label: "Холбоо барих", href: "#contact" },
];

const linkClass = "block py-1.5 font-sans text-sm text-on-dark-muted transition-colors duration-200 hover:text-on-dark hover:underline";

export function Footer() {
  return (
    <footer id="contact" className="bg-ink px-gutter pb-10 pt-section-bottom text-on-dark">
      <div className="mx-auto max-w-site">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto_minmax(0,360px)] lg:gap-16">
          <div className="flex flex-col gap-6 text-sm">
            <Logo className="mb-2 self-start text-xl" />
            <div className="flex flex-col gap-1">
              <p className="font-sans font-semibold">Хаяг</p>
              <p>3500 Deer Creek Road, Palo Alto, CA 94304</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-sans font-semibold">Холбоо барих</p>
              <a href="tel:+18006138840" className="self-start underline underline-offset-[3px] hover:text-on-dark-muted">
                1-800-613-8840
              </a>
              <a
                href="mailto:support@tesla.com"
                className="self-start underline underline-offset-[3px] hover:text-on-dark-muted"
              >
                support@tesla.com
              </a>
            </div>
            <div className="flex gap-3.5">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-75 transition-opacity hover:opacity-100"
                >
                  <Image src={social.icon} alt="" width={24} height={24} unoptimized className="invert" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex gap-12 sm:gap-20">
            <div>
              <p className="mb-1 font-sans text-sm font-semibold">Загварууд</p>
              <ul>
                {models.map((model) => (
                  <li key={model.slug}>
                    <Link href={modelHref(model)} className={linkClass}>
                      {model.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 font-sans text-sm font-semibold">Хуудас</p>
              <ul>
                {pageLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a href="https://www.tesla.com" target="_blank" rel="noopener noreferrer" className={linkClass}>
                    Tesla.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <ContactForm />
        </div>
        <p className="mt-10 border-t border-on-dark-muted/20 pt-8 font-sans text-sm text-on-dark-muted">© 2026 Tesla</p>
      </div>
    </footer>
  );
}
