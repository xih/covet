import React from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import mixpanel from "mixpanel-browser";
import { titleCase } from "title-case";

type RealEstateMarketplaceCardProps = {
  location?: string;
};

export default function RealEstateMarketplaceCard({
  location,
}: RealEstateMarketplaceCardProps) {
  const realEstateMarketPlaceNames = ["trulia", "zillow", "redfin", "compass"];

  return (
    <Card className="px-0 py-2">
      <CardContent className="px-2 pb-0">
        <div className="flex flex-wrap justify-start gap-2">
          {realEstateMarketPlaceNames.map((marketplaceName, index) => {
            return (
              <Button
                key={index}
                className="text-xs"
                onClick={() => {
                  mixpanel.track("searched address", {
                    type: `${marketplaceName}`,
                    address: location,
                  });
                  const encodedName = encodeURIComponent(
                    `${marketplaceName} ` + location + " san francisco",
                  );
                  const searchUrl = `https://www.google.com/search?q=${encodedName}`;
                  window.open(searchUrl, "_blank");
                }}
                variant="outline"
              >
                {`${titleCase(marketplaceName)}`}
              </Button>
            );
          })}

          <Button
            onClick={() => {
              const encodedName = encodeURIComponent(
                location + " san francisco",
              );
              const searchUrl = `https://www.google.com/search?q=${encodedName}`;
              window.open(searchUrl, "_blank");
            }}
            variant="outline"
            className="text-xs"
          >
            Google Maps
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
