import clsx from "clsx";
import mixpanel from "mixpanel-browser";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "~/components/ui/sheet";

export type ModalProps = {
  isOpen: boolean;
  location?: string;
  grantor?: string;
  grantee?: string;
  lat?: number;
  lon?: number;
  onOpenChange: (open: boolean) => void;
  // drawerOpened: boolean;
};

// //@ts-ignore-3 adf
// function toTitleCase(str): string {
//   return str.replace(/\w\S*/g, function (txt): string {
//     return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//   });
// }

export const Modal = (props: ModalProps) => {
  const {
    location = "",
    grantor,
    grantee,
    lat,
    lon,
    onOpenChange,
    isOpen,
  } = props;

  const first = location.slice(0, 4);
  const middle = location.slice(4, -4);
  const last = location.slice(-4);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const prettyLocation = [
    first.replace(/^0+/, ""),
    middle.trim().replace(/^0+/, ""),
    last.replace(/^0+/, ""),
  ].join(" ");

  useEffect(() => {
    // Add debounce to `onChange` to fix perf issues.
    const onChange = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", onChange);
    return () => window.removeEventListener("resize", onChange);
  });

  return (
    <div
      className={clsx(
        "fixed z-50 gap-4 border-l bg-background p-6 shadow-lg transition duration-300 ease-in-out",
        windowWidth > 800
          ? isOpen
            ? "inset-y-0 right-0 w-3/4 translate-x-0 sm:max-w-sm"
            : "inset-y-0 right-0 w-3/4 translate-x-full sm:max-w-sm"
          : isOpen
          ? "inset-x-0 bottom-0 translate-y-0"
          : "inset-x-0 bottom-0 translate-y-full",
      )}
      data-state={isOpen ? "open" : "closed"}
    >
      <button
        onClick={() => onOpenChange(false)}
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
      >
        Close
      </button>
      <div className="text-left"> {prettyLocation}</div>
      <div className="text-left">
        <p>
          Grantee:{" "}
          <span className="font-medium text-slate-900">
            {grantee?.split(",").map((name) => (
              <p key={name} className="underline">
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
                  {name}
                </Link>
              </p>
            ))}
          </span>
        </p>
        <br />

        <p>
          Grantor:{" "}
          <span className="font-medium text-slate-900">
            {grantor?.split(",").map((name) => {
              return (
                <p key={name} className="underline">
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
                    // add mixpanel event here:
                  >
                    {name}
                  </Link>
                </p>
              );
            })}
          </span>{" "}
        </p>
        <br />

        <p>
          Coordinates:
          <br />
          <span className="font-medium text-slate-900">
            {lat},{lon}
          </span>
        </p>
      </div>
    </div>
  );
};
