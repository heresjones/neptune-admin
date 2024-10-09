import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { GeoJsonObject as GeoJSONType } from "geojson";
import leafletPip from "@mapbox/leaflet-pip"; // Import leaflet-pip for point-in-polygon checks
import {
  Button,
  Container,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import countyData from "../us-counties.json";

interface EmailData {
  email: string;
  latitude?: string;
  longitude?: string;
  county?: string;
}

const countyGeoJsonData: GeoJSONType = countyData as GeoJSONType;

const HeatmapLayer: React.FC<{
  locations: LatLngExpression[];
  maxIntensity: number;
}> = ({ locations, maxIntensity }) => {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const heatLayer = (L as any).heatLayer(locations, {
        radius: 25,
        max: maxIntensity,
      });
      heatLayer.addTo(map);
      return () => {
        map.removeLayer(heatLayer);
      };
    }
  }, [locations, map, maxIntensity]);

  return null;
};

const CountyLayer: React.FC<{ userCounts: { [county: string]: number } }> = ({
  userCounts,
}) => {
  const map = useMap();

  useEffect(() => {
    const maxUserCount = Math.max(...Object.values(userCounts));
    const getColor = (count: number) => {
      if (count === 1) {
        return `rgb(0, 0, 255)`; // Dark blue for a single user
      }
      const normalized = count / maxUserCount;
      const blueShade = Math.round(255 * (1 - normalized));
      return `rgb(${blueShade}, ${blueShade}, 255)`; // Gradient color with varying intensity
    };

    const geoJsonLayer = L.geoJSON(countyGeoJsonData, {
      style: (feature) => {
        // Normalize the county name from the GeoJSON data to lowercase and trim whitespace
        const countyName = feature?.properties?.name.toLowerCase().trim() || "";
        const userCount = userCounts[countyName] || 0;

        return {
          fillColor: getColor(userCount),
          color: userCount > 0 ? "blue" : "gray", // Blue border if there are users, gray if none
          weight: userCount > 0 ? 2 : 1, // Thicker border for counties with users
          fillOpacity: 0.6,
        };
      },
      onEachFeature: (feature, layer) => {
        // Normalize the county name from the GeoJSON data to lowercase and trim whitespace
        const countyName = feature?.properties?.name.toLowerCase().trim() || "";
        const displayCountyName = feature?.properties?.name || ""; // Use the original case for display
        const userCount = userCounts[countyName] || 0;

        // Only log counties that have users
        if (userCount > 0) {
          console.log(`County: ${displayCountyName}, Users: ${userCount}`);
        }

        // Display the county name in the tooltip with proper casing
        layer.bindTooltip(
          `<strong>County:</strong> ${displayCountyName}<br /><strong>Users:</strong> ${userCount}`,
          { sticky: true }
        );
      },
    });

    geoJsonLayer.addTo(map);
    return () => {
      map.removeLayer(geoJsonLayer);
    };
  }, [userCounts, map]);

  return null;
};

const MapWithHeatmap: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [locations, setLocations] = useState<LatLngExpression[]>([]);
  const [userCounts, setUserCounts] = useState<{ [county: string]: number }>(
    {}
  );
  const theme = useTheme();

  const handleShowHeatmap = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://9rf6bjk1o9.execute-api.us-east-1.amazonaws.com/Prod/email-read"
      );
      const data: EmailData[] = response.data;

      // Log the entire incoming data to make sure we're receiving it correctly
      console.log("API Data:", data);

      const countyUserCounts: { [county: string]: number } = {};
      data.forEach((item) => {
        if (item.county) {
          // Normalize the county name to lowercase and trim whitespace
          const normalizedCountyName = item.county.trim().toLowerCase();
          countyUserCounts[normalizedCountyName] =
            (countyUserCounts[normalizedCountyName] || 0) + 1;
          console.log(
            `Normalized County from API Data: ${normalizedCountyName}`
          );
        }
      });
      setUserCounts(countyUserCounts);

      // Parse locations based on user data
      const parsedLocations = data
        .map((item) => {
          if (item.latitude && item.longitude) {
            return [
              parseFloat(item.latitude),
              parseFloat(item.longitude),
            ] as LatLngExpression;
          }
          return null;
        })
        .filter((loc) => loc !== null) as LatLngExpression[];

      setLocations(parsedLocations);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  return (
    <Container
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: theme.palette.text.primary,
          fontFamily: "Poppins, sans-serif",
        }}
      >
        User Signup Heatmap
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleShowHeatmap}
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          fontFamily: "Poppins, sans-serif",
          "&:hover": {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        Show Heatmap
      </Button>
      {loading && <CircularProgress sx={{ marginLeft: "10px" }} />}
      <MapContainer
        style={{ height: "500px", marginTop: "20px" }}
        center={[37.7749, -95.7129]}
        zoom={4}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />
        <HeatmapLayer
          locations={locations}
          maxIntensity={Math.max(...Object.values(userCounts))}
        />
        <CountyLayer userCounts={userCounts} />
      </MapContainer>
    </Container>
  );
};

export default MapWithHeatmap;
