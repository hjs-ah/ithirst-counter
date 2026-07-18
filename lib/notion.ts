import { Client } from "@notionhq/client";

export type MemberTag = "Lay Member" | "Minister";

export interface Donation {
  id: string;
  name: string;
  cases: number;
  tag: MemberTag;
  dateGiven: string | null;
  notes: string;
}

export interface SiteText {
  header: string;
  subheader: string;
  goal: number;
}

export const DEFAULT_SITE_TEXT: SiteText = {
  header: "Cases of Water Given",
  subheader:
    "Every case logged here reaches the street through iThirst. Filter by who gave, sort by what matters, and watch the total rise.",
  goal: 150,
};

function getClient() {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    throw new Error(
      "NOTION_TOKEN is not set. Add it to your environment variables (see README)."
    );
  }
  return new Client({ auth: token });
}

/**
 * Pulls every row from the iThirst Water Donations data source in Notion
 * and splits it into donation entries and the editable site text.
 *
 * Expected Notion schema (data source: "iThirst Water Donations"):
 *   - Name        (title)
 *   - Cases       (number)
 *   - Tags        (select: "Lay Member" | "Minister")
 *   - Date Given  (date)
 *   - Notes       (rich text)
 *   - Entry Type  (select: "Donation" | "Site Text")
 *   - Header      (rich text)  — only used on the "Site Text" row
 *   - Subheader   (rich text)  — only used on the "Site Text" row
 *
 * A single row with Entry Type = "Site Text" holds the editable page
 * header/subheader so it can live in the same table without polluting
 * donation totals or lists.
 */
export async function getIThirstData(): Promise<{
  donations: Donation[];
  siteText: SiteText;
}> {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    throw new Error(
      "NOTION_DATABASE_ID is not set. Add it to your environment variables (see README)."
    );
  }

  const notion = getClient();
  const donations: Donation[] = [];
  let siteText: SiteText = DEFAULT_SITE_TEXT;
  let cursor: string | undefined = undefined;

  do {
    const response: Awaited<ReturnType<typeof notion.databases.query>> =
      await notion.databases.query({
        database_id: databaseId,
        start_cursor: cursor,
        page_size: 100,
      });

    for (const page of response.results) {
      if (!("properties" in page)) continue;
      const props = page.properties as Record<string, any>;

      const entryType = props?.["Entry Type"]?.select?.name ?? "Donation";

      if (entryType === "Site Text") {
        const header = props?.Header?.rich_text
          ?.map((t: any) => t.plain_text)
          .join("");
        const subheader = props?.Subheader?.rich_text
          ?.map((t: any) => t.plain_text)
          .join("");
        const goal = props?.Goal?.number;
        siteText = {
          header: header?.trim() ? header : DEFAULT_SITE_TEXT.header,
          subheader: subheader?.trim() ? subheader : DEFAULT_SITE_TEXT.subheader,
          goal: typeof goal === "number" && goal > 0 ? goal : DEFAULT_SITE_TEXT.goal,
        };
        continue;
      }

      const name =
        props?.Name?.title?.map((t: any) => t.plain_text).join("") ?? "Untitled";
      const cases = typeof props?.Cases?.number === "number" ? props.Cases.number : 0;
      const tag: MemberTag =
        props?.Tags?.select?.name === "Minister" ? "Minister" : "Lay Member";
      const dateGiven = props?.["Date Given"]?.date?.start ?? null;
      const notes =
        props?.Notes?.rich_text?.map((t: any) => t.plain_text).join("") ?? "";

      donations.push({ id: page.id, name, cases, tag, dateGiven, notes });
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return { donations, siteText };
}
