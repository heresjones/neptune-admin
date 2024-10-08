import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Button,
  Container,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";

const DomainTrafficChart: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [allTrafficData, setAllTrafficData] = useState<any[]>([]);
  const [filteredTrafficData, setFilteredTrafficData] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<string>("7");
  const [totalUniqueVisits, setTotalUniqueVisits] = useState<number>(0);

  const theme = useTheme();

  const generateEmptyData = (range: string) => {
    const result = [];
    const now = new Date();
    if (range === "24h") {
      // Generate data points for each hour of the last 24 hours in the user's local time
      for (let i = 23; i >= 0; i--) {
        const date = new Date(now);
        date.setHours(now.getHours() - i);
        const formattedHour = date.toLocaleTimeString([], {
          hour: "numeric",
          hour12: true,
        });
        result.push({ date: formattedHour, visits: 0 });
      }
    } else {
      // Generate data points for each day of the range
      const days = parseInt(range, 10);
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        result.push({ date: date.toLocaleDateString(), visits: 0 });
      }
    }
    return result;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://9rf6bjk1o9.execute-api.us-east-1.amazonaws.com/Prod/read-log-data`
      );

      const data = response.data.map((item: any) => ({
        timestamp: new Date(item.timestamp),
        ip_address: item.ip_address,
      }));

      setAllTrafficData(data); // Cache the full dataset with timestamps for future filtering
      filterDataByRange(data, dateRange); // Filter data for the current date range
    } catch (error) {
      console.error("Error fetching traffic data:", error);
    }
    setLoading(false);
  };

  const filterDataByRange = (data: any[], range: string) => {
    const emptyData = generateEmptyData(range);

    const mergedData = emptyData.map((emptyItem) => {
      let uniqueIPs = new Set();
      if (range === "24h") {
        // Filter data for the last 24 hours and group by hour in local time
        data.forEach((item) => {
          const localTime = item.timestamp.toLocaleTimeString([], {
            hour: "numeric",
            hour12: true,
          });
          if (
            localTime === emptyItem.date &&
            item.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
          ) {
            uniqueIPs.add(item.ip_address); // Track unique IPs
          }
        });
      } else {
        // Filter data for the last 7, 30, or 180 days
        data.forEach((item) => {
          const localDate = item.timestamp.toLocaleDateString();
          if (localDate === emptyItem.date) {
            uniqueIPs.add(item.ip_address); // Track unique IPs
          }
        });
      }

      return {
        date: emptyItem.date,
        visits: uniqueIPs.size, // Count of unique IP addresses
      };
    });

    setFilteredTrafficData(mergedData);
    setTotalUniqueVisits(
      mergedData.reduce((sum, item) => sum + item.visits, 0)
    );
  };

  useEffect(() => {
    // Do nothing on mount, data is fetched when the user clicks the refresh button
  }, []);

  useEffect(() => {
    filterDataByRange(allTrafficData, dateRange); // Update filtered data when the date range changes
  }, [dateRange, allTrafficData]);

  const handleRangeChange = (range: string) => {
    setDateRange(range); // This will trigger filtering without a new data fetch
  };

  const maxVisitValue =
    Math.max(...filteredTrafficData.map((item) => item.visits)) || 1;
  const yAxisMax = Math.ceil(maxVisitValue * 1.1);

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
        Domain Traffic
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          gap: "16px",
          padding: "16px",
        }}
      >
        <Button
          variant="contained"
          onClick={fetchData}
          sx={{
            backgroundColor: "#9C27B0",
            color: "#FFFFFF",
            fontFamily: "Poppins, sans-serif",
            "&:hover": {
              backgroundColor: "#7B1FA2",
            },
            width: 150,
          }}
        >
          Refresh Data
        </Button>
        <Button
          variant="contained"
          onClick={() => handleRangeChange("24h")}
          sx={{
            backgroundColor: dateRange === "24h" ? "#3DAFB7" : "#40CFE2",
            color: "#FFFFFF",
            fontFamily: "Poppins, sans-serif",
            "&:hover": {
              backgroundColor: "#3DAFB7",
            },
            width: 150,
          }}
        >
          Last 24 Hours
        </Button>
        <Button
          variant="contained"
          onClick={() => handleRangeChange("7")}
          sx={{
            backgroundColor: dateRange === "7" ? "#3DAFB7" : "#40CFE2",
            color: "#FFFFFF",
            fontFamily: "Poppins, sans-serif",
            "&:hover": {
              backgroundColor: "#3DAFB7",
            },
            width: 150,
          }}
        >
          Last 7 Days
        </Button>
        <Button
          variant="contained"
          onClick={() => handleRangeChange("30")}
          sx={{
            backgroundColor: dateRange === "30" ? "#3DAFB7" : "#40CFE2",
            color: "#FFFFFF",
            fontFamily: "Poppins, sans-serif",
            "&:hover": {
              backgroundColor: "#3DAFB7",
            },
            width: 150,
          }}
        >
          Last 30 Days
        </Button>
        <Button
          variant="contained"
          onClick={() => handleRangeChange("180")}
          sx={{
            backgroundColor: dateRange === "180" ? "#3DAFB7" : "#40CFE2",
            color: "#FFFFFF",
            fontFamily: "Poppins, sans-serif",
            "&:hover": {
              backgroundColor: "#3DAFB7",
            },
            width: 150,
          }}
        >
          Last 6 Months
        </Button>
      </div>
      <Typography
        variant="h6"
        sx={{
          color: theme.palette.text.primary,
          fontFamily: "Poppins, sans-serif",
          marginTop: "8px",
          textAlign: "left",
        }}
      >
        Total Unique Visitors in the Last{" "}
        {dateRange === "24h" ? "24 Hours" : `${dateRange} Days`}:{" "}
        {totalUniqueVisits}
      </Typography>
      {loading ? (
        <CircularProgress sx={{ margin: "20px" }} />
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={filteredTrafficData}>
            <CartesianGrid
              stroke={theme.palette.divider}
              strokeDasharray="3 3"
            />
            <XAxis dataKey="date" stroke={theme.palette.text.primary} />
            <YAxis
              stroke={theme.palette.text.primary}
              domain={[0, yAxisMax]}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }}
              cursor={{ stroke: theme.palette.divider }}
            />
            <Line
              type="monotone"
              dataKey="visits"
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              dot={{ r: 6, fill: theme.palette.primary.main }}
              activeDot={{ r: 8, fill: theme.palette.secondary.main }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Container>
  );
};

export default DomainTrafficChart;
