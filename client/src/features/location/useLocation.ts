import { useEffect } from "react";
import { useLocationStore } from "./locationStore";

export const useLocation = () => {
  const { setLocation } = useLocationStore();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, [setLocation]);
};
