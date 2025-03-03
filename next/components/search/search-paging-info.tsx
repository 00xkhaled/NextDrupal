import { useTranslation } from "next-i18next";
import {
  BaseContainerProps,
  Rename,
} from "@elastic/react-search-ui/lib/esm/types";
import type { SearchContextState } from "@elastic/search-ui";
import clsx from "clsx";

export type PagingInfoContainerContext = Pick<
  SearchContextState,
  "pagingStart" | "pagingEnd" | "resultSearchTerm" | "totalResults"
>;

export type PagingInfoViewProps = Rename<
  BaseContainerProps & PagingInfoContainerContext,
  {
    pagingStart: "start";
    resultSearchTerm: "searchTerm";
    pagingEnd: "end";
  }
>;

export type PagingInfoContainerProps = BaseContainerProps &
  PagingInfoContainerContext & {
    view?: React.ComponentType<PagingInfoViewProps>;
  };

export function PagingInfoView({
  className,
  end,
  searchTerm,
  start,
  totalResults,
  ...rest
}: PagingInfoViewProps & React.HTMLAttributes<HTMLDivElement>) {
  const { t } = useTranslation();
  return (
    <div className={clsx(className, "text-sm")} {...rest}>
      {t("search-showing")}{" "}
      <strong>
        {start} - {end}
      </strong>{" "}
      {t("search-out-of")} <strong>{totalResults}</strong>
      {searchTerm && (
        <>
          {" "}
          {t("search-for")}: <em>{searchTerm}</em>
        </>
      )}
    </div>
  );
}
