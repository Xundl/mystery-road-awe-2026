import { LocationCard } from "./LocationCard";
import type { Location } from "../../../js/types";

interface LocationListProps {
  locations: Location[];
}

export function LocationList({ locations }: LocationListProps) {
  return (
    <div className="locations-grid">
      {locations.map((loc) => (
        <LocationCard key={loc.id} location={loc} />
      ))}
    </div>
  );
}
