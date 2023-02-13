import "@/styles/globals.css";

import { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { Overpass } from "@next/font/google";
import { createContext } from "react";

import { Layout, LayoutProps } from "@/components/layout";

import siteConfig from "@/site.config";

interface AppPropsWithPageLayout extends AppProps {
  pageProps: AppProps["pageProps"] & LayoutProps;
}

// Language context
const defaultLanguageLinks = siteConfig.locales;
export const LangContext = createContext({
  languageLinks: defaultLanguageLinks,
});

// Add fonts
const overpass = Overpass({ subsets: ["latin"], variable: "--font-overpass" });
function Fonts({ children }: { children: React.ReactNode }) {
  return <div className={`${overpass.variable} font-sans`}>{children}</div>;
}

function App({ Component, pageProps }: AppPropsWithPageLayout) {
  return (
    <Fonts>
      <LangContext.Provider
        value={{
          languageLinks: defaultLanguageLinks,
        }}
      >
        <Layout menus={pageProps.menus}>
          <Component {...pageProps} />
        </Layout>
      </LangContext.Provider>
    </Fonts>
  );
}

export default appWithTranslation(App);
