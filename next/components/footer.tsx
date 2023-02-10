import Link from "next/link";
import { DrupalMenuLinkContent } from "next-drupal";

interface FooterProps {
  links: DrupalMenuLinkContent[];
}

export function Footer({ links }: FooterProps) {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center justify-between text-sm md:flex-row">
          <p className="mb-6 md:mb-0">
            © {new Date().getFullYear()} Next4drupal example
          </p>
          {links?.length ? (
            <ul className="flex gap-4">
              {links.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.url}
                    passHref
                    className="text-wunderpurple-500 no-underline hover:text-wunderpurple-300"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
