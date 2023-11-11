import mixpanel from "mixpanel-browser";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";

export function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          onClick={() => {
            mixpanel.track("click help");
          }}
          variant="secondary"
        >
          Help
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>How do I use Post Covet?</AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            <span>
              1. Click on a dot to inspect a single family residence in SF
            </span>
            <br />
            2. Find out the current and previous owners of the home
            <br />
            3. Click on the name to perform a google search of the owner or
            discover the home on Zillow, Trulia, Redfin, Compass, or Google Maps
            <br />
            <br />
            {"=))"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          {/* <AlertDialogAction>Close</AlertDialogAction> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
