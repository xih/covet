import React from "react";
import { useState } from "react";
import { Drawer } from "vaul";
import { Button } from "./ui/button";

export default function OnboardingDrawer({
  showButton = false,
  openState = true,
}) {
  const [open, setOpen] = useState(openState);

  return (
    <div>
      <Drawer.Root dismissible={false} open={open}>
        {showButton ? (
          <Drawer.Trigger asChild onClick={() => setOpen(true)}>
            <Button variant="secondary">Help</Button>
          </Drawer.Trigger>
        ) : null}
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex flex-col rounded-t-[10px] bg-zinc-100">
            <div className="flex-1 rounded-t-[10px] bg-white p-4">
              <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300" />
              <div className="mx-auto max-w-md">
                <Drawer.Title className="mb-4 font-medium">
                  How do I use Post Covet?
                </Drawer.Title>
                <p className="mb-2 text-zinc-600">
                  1. Click on a dot to inspect a single family residence in SF
                </p>
                <p className="mb-2 text-zinc-600">
                  2. Find out the current and previous owners of the home
                </p>
                <p className="mb-6 text-zinc-600">
                  3. Click on the name to perform a google search of the owner
                  or discover the home on Zillow, Trulia, Redfin, Compass, or
                  Google Maps
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mb-6 w-full rounded-md bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                >
                  Get Started!
                </button>
              </div>
            </div>
            <div className="mt-auto border-t border-zinc-200 bg-zinc-100 p-4">
              <div className="mx-auto flex max-w-md justify-end gap-6">
                <a
                  className="gap-0.25 flex items-center text-xs text-zinc-600"
                  href="https://twitter.com/emilkowalski_"
                  target="_blank"
                >
                  Twitter
                  <svg
                    fill="none"
                    height="16"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    width="16"
                    aria-hidden="true"
                    className="ml-1 h-3 w-3"
                  >
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                    <path d="M15 3h6v6"></path>
                    <path d="M10 14L21 3"></path>
                  </svg>
                </a>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}