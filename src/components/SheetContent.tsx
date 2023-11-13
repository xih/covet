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

  return (
    <div>
      <div className="flex flex-col gap-y-1 text-slate-700">
        Current Owner:{" "}
        <span className="flex flex-wrap gap-x-2 gap-y-1.5 font-medium text-slate-900">
          {grantee?.split(",").map((name) => (
            <p key={name} className="">
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <Link
                      href={`https://www.google.com/search?q=${encodeURIComponent(
                        name,
                      )}`}
                      target="_blank"
                      onClick={() => {
                        mixpanel.track("searched on google", {
                          type: "grantee",
                          name: name,
                        });
                      }}
                    >
                      <Badge variant="secondary">
                        <span className="flex text-sm">{name}</span>
                      </Badge>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Search on Google</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </p>
          ))}
        </span>
      </div>
      <br />
      <div className="flex flex-col gap-y-1">
        <span className="gap-y-0.5 text-slate-700">Previous Owner: </span>
        <div className="flex flex-wrap gap-x-2 gap-y-1.5 font-medium text-slate-900">
          {grantor?.split(",").map((name) => {
            return (
              <div key={name}>
                <TooltipProvider>
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <Link
                        href={`https://www.google.com/search?q=${encodeURIComponent(
                          name,
                        )}`}
                        target="_blank"
                        onClick={() => {
                          mixpanel.track("searched on google", {
                            type: "grantor",
                            name: name,
                          });
                        }}
                      >
                        <Badge variant="secondary">
                          <span className="flex text-sm">{name}</span>
                        </Badge>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Search on Google</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            );
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
            mixpanel.track("sent to a frined", {
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
