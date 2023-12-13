import mixpanel from "mixpanel-browser";
import { env } from "~/env.mjs";

// Initialize Mixpanel with your Mixpanel project token
export const initMixpanel = () => {
  const isDevelopmentEnv = process.env.NODE_ENV === "development";

  mixpanel.init(env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
    debug: isDevelopmentEnv ? true : false,
    track_pageview: true,
    persistence: "localStorage",
  });
};

export const trackMapClickEvent = (location: string, action: string) => {
  mixpanel.track("Map Click", {
    Location: location,
    Action: action,
  });
};

export const testMixpanel = () => {
  mixpanel.track("test");
};

// Create a user session and track user identification
export const identifyUser = (userId: string) => {
  mixpanel.identify(userId);
};

// Function to track sign-in event
export const trackSignInEvent = (email: string) => {
  mixpanel.track("Sign In", { Email: email });
};

export const registerUser = (name: string, email: string) => {
  console.log("does registerUser fire");
  mixpanel.register({
    Name: name,
    Email: email,
  });
  console.log(
    "User registered with properties:",
    mixpanel.get_property("Email"),
  );
  console.log(
    "User registered with properties:",
    mixpanel.get_property("Name"),
  );
};

export const clickedAddress = (
  address: string,
  currentOwner: string,
  previousOwner: string,
) => {
  mixpanel.track("clicked address", {
    propertyName: address,
    currentOwner: currentOwner,
    previousOwner: previousOwner,
  });
};
