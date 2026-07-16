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
 * and normalizes it into a flat shape the UI can consume.
 *
 * Expected Notion schema (data source: "iThirst Water Donations"):
 *   - Name        (title)
 *   - Cases       (number)
 *   - Tags        (select: "Lay Member" | "Minister")
 *   - Date Given  (date)
 *   - Notes       (rich text)
 */
export async function getDonations(): Promise<Donation[]> {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    throw new Error(
      "NOTION_DATABASE_ID is not set. Add it to your environment variables (see README)."
    );
  }

  const notion = getClient();
  const results: Donation[] = [];
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

      const name =
        props?.Name?.title?.map((t: any) => t.plain_text).join("") ?? "Untitled";
      const cases = typeof props?.Cases?.number === "number" ? props.Cases.number : 0;
      const tag: MemberTag =
        props?.Tags?.select?.name === "Minister" ? "Minister" : "Lay Member";
      const dateGiven = props?.["Date Given"]?.date?.start ?? null;
      const notes =
        props?.Notes?.rich_text?.map((t: any) => t.plain_text).join("") ?? "";

      results.push({ id: page.id, name, cases, tag, dateGiven, notes });
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return results;
}
