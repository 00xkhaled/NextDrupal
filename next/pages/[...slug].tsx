import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { DrupalNode } from "next-drupal";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { LayoutProps } from "@/components/layout";
import { NodeArticle } from "@/components/node--article";
import { NodeBasicPage } from "@/components/node--basic-page";
import { NodeLandingPage } from "@/components/node--landing-page";
import { drupal } from "@/lib/drupal";
import { getMenus } from "@/lib/get-menus";
import { getNodePageJsonApiParams } from "@/lib/get-params";
import { getNodeTranslatedVersions, setLanguageLinks } from "@/lib/utils";
import { LangContext } from "@/pages/_app";

const RESOURCE_TYPES = ["node--page", "node--article", "node--landing_page"];

export default function NodePage({
  resource,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!resource) return null;

  return (
    <LangContext.Provider
      value={{
        languageLinks: setLanguageLinks(resource.translations),
      }}
    >
      <Head>
        <title>{resource.title}</title>
        <meta name="description" content="A Next.js site powered by Drupal." />
      </Head>
      {resource.type === "node--page" && <NodeBasicPage node={resource} />}
      {resource.type === "node--article" && <NodeArticle node={resource} />}
      {resource.type === "node--landing_page" && (
        <NodeLandingPage node={resource} />
      )}
    </LangContext.Provider>
  );
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const paths = await drupal.getStaticPathsFromContext(RESOURCE_TYPES, context);
  return {
    paths: paths,
    fallback: "blocking",
  };
};

interface NodePageProps extends LayoutProps {
  resource: DrupalNode;
}

export const getStaticProps: GetStaticProps<NodePageProps> = async (
  context
) => {
  const path = await drupal.translatePathFromContext(context);

  if (!path) {
    return {
      notFound: true,
    };
  }

  if (path.redirect?.length) {
    const [redirect] = path.redirect;
    return {
      redirect: {
        destination: redirect.to,
        permanent: false,
      },
    };
  }

  const type = path.jsonapi.resourceName;

  // If we are looking at the path of a frontpage node,
  // redirect the user to the homepage for that language:

  if (type === "node--frontpage") {
    return {
      redirect: {
        destination: "/" + context.locale,
        permanent: false,
      },
    };
  }

  const resource = await drupal.getResourceFromContext<DrupalNode>(
    path,
    context,
    {
      params: getNodePageJsonApiParams(type),
    }
  );

  // At this point, we know the path exists and it points to a resource.
  // If we receive an error, it means something went wrong on Drupal.
  // We throw an error to tell revalidation to skip this for now.
  // Revalidation can try again on next request.
  if (!resource) {
    throw new Error(`Failed to fetch resource: ${path.jsonapi.individual}`);
  }

  // If we're not in preview mode and the resource is not published,
  // Return page not found.
  if (!context.preview && resource?.status === false) {
    return {
      notFound: true,
    };
  }

  // Add information about possible other language versions of this node.
  resource.translations = await getNodeTranslatedVersions(
    resource,
    context,
    drupal
  );

  return {
    props: {
      resource,
      menus: await getMenus(context),
      ...(await serverSideTranslations(context.locale)),
    },
    revalidate: 60,
  };
};
