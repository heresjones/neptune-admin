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

const SignupChart: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [allSignupData, setAllSignupData] = useState<any[]>([]); // Store the full dataset
  const [filteredSignupData, setFilteredSignupData] = useState<any[]>([]); // Store the data based on date range
  const [dateRange, setDateRange] = useState<string>("7");
  const [totalSignups, setTotalSignups] = useState<number>(0);

  const theme = useTheme();

  const generateEmptyData = (range: string) => {
    const result = [];
    const now = new Date();
    if (range === "24h") {
      // Generate data points for each hour of the last 24 hours
      for (let i = 23; i >= 0; i--) {
        const date = new Date(now);
        date.setHours(now.getHours() - i);
        result.push({ date: `${date.getHours()}:00`, signups: 0 });
      }
    } else {
      // Generate data points for each day of the range
      const days = parseInt(range, 10);
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        result.push({ date: date.toLocaleDateString(), signups: 0 });
      }
    }
    return result;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://9rf6bjk1o9.execute-api.us-east-1.amazonaws.com/Prod/email-read`
      );
      const data = response.data.map((item: any) => ({
        timestamp: new Date(item.SignupTime),
        signups: 1,
      }));

      setAllSignupData(data); // Cache the full dataset with timestamps for future filtering
      filterDataByRange(data, dateRange); // Filter data for the current date range
    } catch (error) {
      console.error("Error fetching signup data:", error);
    }
    setLoading(false);
  };

  const filterDataByRange = (data: any[], range: string) => {
    const emptyData = generateEmptyData(range);
    const mergedData = emptyData.map((emptyItem) => {
      let filteredData;
      if (range === "24h") {
        // Filter data for the last 24 hours and group by hour
        const hourKey = emptyItem.date;
        filteredData = data.filter(
          (item) =>
            `${item.timestamp.getHours()}:00` === hourKey &&
            item.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
        );
      } else {
        // Filter data for the last 7, 30, or 180 days
        const dayKey = emptyItem.date;
        filteredData = data.filter(
          (item) => item.timestamp.toLocaleDateString() === dayKey
        );
      }

      return {
        date: emptyItem.date,
        signups: filteredData.length,
      };
    });

    setFilteredSignupData(mergedData);
    setTotalSignups(mergedData.reduce((sum, item) => sum + item.signups, 0));
  };

  useEffect(() => {
    // Do nothing on mount, data is fetched when the user clicks the refresh button
  }, []);

  useEffect(() => {
    filterDataByRange(allSignupData, dateRange); // Update filtered data when the date range changes
  }, [dateRange, allSignupData]);

  const handleRangeChange = (range: string) => {
    setDateRange(range); // This will trigger filtering without a new data fetch
  };

  const maxSignupValue =
    Math.max(...filteredSignupData.map((item) => item.signups)) || 1;
  const yAxisMax = Math.ceil(maxSignupValue * 1.1);

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
        User Signups
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
          onClick={fetchData} // Data fetch is triggered only when the button is clicked
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
        Total Signups in the Last{" "}
        {dateRange === "24h" ? "24 Hours" : `${dateRange} Days`}: {totalSignups}
      </Typography>
      {loading ? (
        <CircularProgress sx={{ margin: "20px" }} />
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={filteredSignupData}>
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
              dataKey="signups"
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

export default SignupChart;
