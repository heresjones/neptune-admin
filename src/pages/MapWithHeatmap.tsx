import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import {
  Button,
  Container,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";

interface EmailData {
  Location?: string;
}

const MapWithHeatmap: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [heatLayer, setHeatLayer] = useState<L.Layer | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const theme = useTheme(); // Access theme for dynamic styles

  const handleShowHeatmap = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://9rf6bjk1o9.execute-api.us-east-1.amazonaws.com/Prod/email-read"
      );
      const data: EmailData[] = response.data;
      const locations = data
        .map((item) => {
          try {
            const location = JSON.parse(item.Location || "{}");
            return [location.latitude, location.longitude];
          } catch {
            return null;
          }
        })
        .filter((loc) => loc !== null);

      if (map && locations.length > 0) {
        if (heatLayer) {
          map.removeLayer(heatLayer);
        }
        const newHeatLayer = (L as any).heatLayer(locations, { radius: 25 });
        newHeatLayer.addTo(map);
        setHeatLayer(newHeatLayer);
      }
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
      {loading ? <CircularProgress /> : null}
      <MapContainer
        style={{ height: "400px", marginTop: "20px" }}
        center={[37.7749, -122.4194]}
        zoom={2}
        whenReady={() => setMap(map)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </Container>
  );
};

export default MapWithHeatmap;
