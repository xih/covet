import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "~/components/ui/sheet";

export type ModalProps = {
  location?: string;
  grantor?: string;
  grantee?: string;
  lat?: number;
  lon?: number;
  close?: () => void;
};

// //@ts-ignore-3 adf
// function toTitleCase(str): string {
//   return str.replace(/\w\S*/g, function (txt): string {
//     return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//   });
// }

export const Modal = (props: ModalProps) => {
  const { location, grantor, grantee, lat, lon, close } = props;

  // pretty print the location
  const prettyLocation = location?.replace(/['"]+/g, ""); // remove quotes
  const prettyLocation2 = prettyLocation?.replace(/[0+]/g, "");

  return (
    <Sheet open={Boolean(props)} onOpenChange={close}>
      <SheetClose onClick={close} />
      <SheetContent side={"bottom"}>
        <SheetHeader>
          <SheetTitle className="text-left"> {prettyLocation2}</SheetTitle>
          <SheetDescription className="text-left">
            <p>
              Owner{" "}
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
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
