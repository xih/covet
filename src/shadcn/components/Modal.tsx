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

export const Modal = (props: ModalProps) => {
  const { location, grantor, grantee, lat, lon, close } = props;

  return (
    <Sheet open={Boolean(props)} onOpenChange={close}>
      <SheetClose onClick={close} />
      <SheetContent side={"bottom"}>
        <SheetHeader>
          <SheetTitle>Information</SheetTitle>
          <SheetDescription>
            <p>Property name: {location}</p>
            <p>
              Coordinates: {lat},{lon}
            </p>
            <p>Grantor: {grantor}</p>
            <p>Grantee: {grantee}</p>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
