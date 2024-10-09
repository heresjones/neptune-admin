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
  const [totalVisits, setTotalVisits] = useState<number>(0);

  const theme = useTheme();

  const generateEmptyData = (days: number) => {
    const result = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getUTCDate() - i);
      result.push({ date: date.toISOString().split("T")[0], visits: 0 });
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
        date: new Date(item.timestamp).toISOString().split("T")[0],
        visits: 1,
      }));

      const aggregatedData = data.reduce((acc: any, curr: any) => {
        const existing = acc.find((item: any) => item.date === curr.date);
        if (existing) {
          existing.visits += 1;
        } else {
          acc.push({ date: curr.date, visits: 1 });
        }
        return acc;
      }, []);

      setAllTrafficData(aggregatedData);
      filterDataByRange(aggregatedData, dateRange);
    } catch (error) {
      console.error("Error fetching traffic data:", error);
    }
    setLoading(false);
  };

  const filterDataByRange = (data: any[], range: string) => {
    const emptyData = generateEmptyData(parseInt(range, 10));
    const mergedData = emptyData.map((emptyDay) => {
      const existingDay = data.find((day: any) => day.date === emptyDay.date);
      return existingDay ? existingDay : emptyDay;
    });
    setFilteredTrafficData(mergedData);
    const totalVisitsInRange = mergedData.reduce(
      (sum, item) => sum + item.visits,
      0
    );
    setTotalVisits(totalVisitsInRange);
  };

  useEffect(() => {
    // Do nothing on mount, data is fetched when the user clicks the refresh button
  }, []);

  useEffect(() => {
    filterDataByRange(allTrafficData, dateRange);
  }, [dateRange, allTrafficData]);

  const handleRangeChange = (range: string) => {
    setDateRange(range);
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
          onClick={() => handleRangeChange("7")}
          sx={{
            backgroundColor: dateRange === "7" ? "#3DAFB7" : "#40CFE2", // Highlight the selected button
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
            backgroundColor: dateRange === "30" ? "#3DAFB7" : "#40CFE2", // Highlight the selected button
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
            backgroundColor: dateRange === "180" ? "#3DAFB7" : "#40CFE2", // Highlight the selected button
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
        Total Visitors in the Last {dateRange} Days: {totalVisits}
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
              allowDecimals={false} // Ensure Y-axis displays discrete values
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
