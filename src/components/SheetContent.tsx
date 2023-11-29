import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import mixpanel from "mixpanel-browser";
import { Badge } from "./ui/badge";

import Link from "next/link";

import { Button } from "~/components/ui/button";
import { BottomSheetProps } from "./BottomSheet";
import { useRouter } from "next/router";
import PropertyOwnerCard from "./PropertyOwnerCard";

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
      <div className="flex flex-col gap-y-1 text-slate-700">
        <span className="text-base">
          {" "}
          {grantees && grantees?.length > 1
            ? `${grantees?.length} Current Owners:`
            : "Current Owner:"}{" "}
        </span>
        <span className="flex flex-wrap gap-x-2 gap-y-2 font-medium text-slate-900">
          {grantees?.map((name) => (
            <PropertyOwnerCard name={name} key={name} />
          ))}
        </span>
      </div>
      <br />
      <div className="flex flex-col gap-y-1">
        <span className="gap-y-0.5 text-slate-700">
          <span className="text-base">
            {grantors && grantors?.length > 1
              ? `${grantors?.length} Previous Owners:`
              : "Previous Owner:"}{" "}
          </span>
        </span>
        <div className="flex flex-wrap gap-x-2 gap-y-1.5 font-medium text-slate-900">
          {grantor?.split(",").map((name) => {
            return <PropertyOwnerCard name={name} key={name} />;
          })}
        </div>
      </div>
      <br />
      <div className="flex flex-col gap-y-1">
        <p className="text-slate-800">Find on:</p>
        <div className="flex flex-wrap justify-start gap-1">
          <div className="flex grow flex-row gap-1">
            <Link
              href={`https://www.google.com/search?q=${encodeURIComponent(
                "zillow " + location + " san francisco",
              )}`}
              target="_blank"
              onClick={() => {
                mixpanel.track("searched address", {
                  type: "zillow",
                  address: location,
                });
              }}
            >
              <Button variant="outline" className="grow">
                Zillow
              </Button>
            </Link>

            <Link
              href={`https://www.google.com/search?q=${encodeURIComponent(
                "trulia " + location + " san francisco",
              )}`}
              target="_blank"
              onClick={() => {
                mixpanel.track("searched address", {
                  type: "trulia",
                  address: location,
                });
              }}
            >
              <Button variant="outline">Trulia</Button>
            </Link>
            <Link
              href={`https://www.google.com/search?q=${encodeURIComponent(
                "redfin " + location + " san francisco",
              )}`}
              target="_blank"
              onClick={() => {
                mixpanel.track("searched address", {
                  type: "redfin",
                  address: location,
                });
              }}
            >
              <Button variant="outline">Redfin</Button>
            </Link>
            <Link
              href={`https://www.google.com/search?q=${encodeURIComponent(
                "compass " + location + " san francisco",
              )}`}
              target="_blank"
              onClick={() => {
                mixpanel.track("searched address", {
                  type: "compass",
                  address: location,
                });
              }}
            >
              <Button variant="outline">Compass</Button>
            </Link>
          </div>
          <Link
            href={`https://maps.google.com/?q=${encodeURIComponent(
              location + " san francisco",
            )}`}
            target="_blank"
            onClick={() => {
              mixpanel.track("searched address", {
                type: "google maps",
                address: location,
              });
            }}
          >
            <Button variant="outline">Google Maps</Button>
          </Link>
        </div>
      </div>
      <br />
      <div>
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
