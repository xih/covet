import React from "react";
import mixpanel from "mixpanel-browser";

import Link from "next/link";

import { Button } from "~/components/ui/button";
import { useRouter } from "next/router";
import PropertyOwnerCard from "./PropertyOwnerCard";
import { Card } from "./ui/card";
import RealEstateMarketplaceCard from "./RealEstateMarketplaceCard";

export type SheetContentProps = {
  location?: string;
  grantee?: string;
  grantor?: string;
};

export default function SheetContent(props: SheetContentProps) {
  const { location, grantee, grantor } = props;

  const domain = "https://postcovet.com";

  const router = useRouter();

  const textMessage = encodeURIComponent(
    `👋 Want to purchase this home? Check out who owns this home near me: ${
      domain + router.asPath
    }`,
  );

  const grantees = grantee?.split(",");
  const grantors = grantor?.split(",");

  return (
    <div>
      <div className="flex flex-col gap-y-2 text-slate-700">
        <div className="flex flex-col gap-y-2">
          <span className="text-base">
            {" "}
            {grantees && grantees?.length > 1
              ? `${grantees?.length} Current Owners:`
              : "Current Owner:"}{" "}
          </span>
          <Card className="mb-2 w-full py-0">
            {grantees?.map((name) => (
              <PropertyOwnerCard name={name} key={name} />
            ))}
          </Card>
        </div>
        <div className="flex flex-col gap-y-1">
          <span className="gap-y-0.5 text-slate-700">
            <span className="text-base">
              {grantors && grantors?.length > 1
                ? `${grantors?.length} Previous Owners:`
                : "Previous Owner:"}{" "}
            </span>
          </span>
          <div className="flex flex-wrap gap-x-2 gap-y-1.5 font-medium text-slate-900">
            <Card className="mb-2 w-full py-0">
              {grantor?.split(",").map((name) => {
                return <PropertyOwnerCard name={name} key={name} />;
              })}
            </Card>
          </div>
        </div>
        <div className="flex flex-col gap-y-1">
          <p className="text-slate-800">Find on:</p>
          <RealEstateMarketplaceCard location={location} />
        </div>
        <Link
          href={`sms:&body=${textMessage}`}
          onClick={() => {
            mixpanel.track("sent to a friend", {
              type: "text",
              address: location,
            });
          }}
        >
          <Button className="w-full">Text this to a friend!</Button>
        </Link>
      </div>
    </div>
  );
}
