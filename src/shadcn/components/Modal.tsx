import mixpanel from "mixpanel-browser";
import Link from "next/link";
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
  const { location, grantor, grantee, lat, lon, onOpenChange, isOpen } = props;

  // pretty print the location
  const prettyLocation = location?.replace(/['"]+/g, ""); // remove quotes
  const prettyLocation2 = prettyLocation?.replace(/[0+]/g, "");

  return (
    <Sheet open={isOpen} modal={false}>
      <SheetContent side={window.innerWidth > 800 ? "right" : "bottom"}>
        <SheetHeader>
          <SheetTitle className="text-left"> {prettyLocation2}</SheetTitle>
          <SheetDescription className="text-left">
            <p>
              Grantee:{" "}
              <span className="font-medium text-slate-900">{grantee}</span>
            </p>
            {/* <br /> */}

            <p>
              Grantor:{" "}
              <span className="font-medium text-slate-900">{grantor}</span>{" "}
            </p>

            <p>
              Coordinates: {lat},{lon}
            </p>
            <br />
            <Link
              href={`https://www.google.com/search?q=${grantee}`}
              target="_blank"
              // add mixpanel event here:
            >
              <Button
                onClick={() => {
                  mixpanel.track("searched on google", {
                    "Property name": location,
                    Grantor: grantor,
                    Grantee: grantee,
                  });
                }}
              >
                Who is {grantee}?
              </Button>
            </Link>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
