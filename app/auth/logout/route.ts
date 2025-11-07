import { getLogoutFlow } from "@ory/nextjs/app";
import { NextResponse } from "next/server";

export async function GET() {
  const flow = await getLogoutFlow({});
  return NextResponse.redirect(flow.logout_url);
}


