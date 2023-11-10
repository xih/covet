import React from "react";
import { Drawer } from "vaul";

export type NestedBottomSheetProps = {
  open: boolean;
  setOpen: () => void;
};

export default function NestedBottomSheet(props: NestedBottomSheetProps) {
  const { open, setOpen } = props;

  return (
    <Drawer.Root
      // shouldScaleBackground
      open={open}
      onRelease={(e, f) => {
        console.log(e, "event?");
        console.log(f, "open state?");
      }}
      onOpenChange={(open) => {
        console.log("3. on open change (open state)", open);
      }}
      modal={false}
    >
      <Drawer.Portal>
        {/* <Drawer.Overlay className="fixed inset-0 bg-black/40" /> */}
        <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-full max-h-[50%] flex-col rounded-t-[10px] bg-gray-100">
          <div className="flex-1 rounded-t-[10px] bg-white p-4">
            <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300" />
            <div className="mx-auto max-w-md">
              <Drawer.Title className="mb-4 font-medium">
                Drawer for React.
              </Drawer.Title>
              <Drawer.NestedRoot>
                <Drawer.Trigger className="mb-6 w-full rounded-md bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                  Open Second Drawer
                </Drawer.Trigger>
                <Drawer.Portal>
                  <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                  <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-full max-h-[94%] flex-col rounded-t-[10px] bg-gray-100">
                    <div className="flex-1 rounded-t-[10px] bg-white p-4">
                      <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300" />
                      <div className="mx-auto max-w-md">
                        <Drawer.Title className="mb-4 font-medium">
                          This drawer is nested.
                        </Drawer.Title>
                        <p className="mb-2 text-gray-600">
                          Place a{" "}
                          <span className="font-mono text-[15px] font-semibold">
                            `Drawer.NestedRoot`
                          </span>{" "}
                          inside another drawer and it will be nested
                          automatically for you.
                        </p>
                        <p className="mb-2 text-gray-600">
                          You can view more examples{" "}
                          <a
                            href="https://github.com/emilkowalski/vaul#examples"
                            className="underline"
                            target="_blank"
                          >
                            here
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  </Drawer.Content>
                </Drawer.Portal>
              </Drawer.NestedRoot>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
