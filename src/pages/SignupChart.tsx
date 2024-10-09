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
  const [signupData, setSignupData] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<string>("7");

  const theme = useTheme();

  const generateEmptyData = (days: number) => {
    const result = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      result.push({ date: date.toLocaleDateString(), signups: 0 });
    }
    return result;
  };

  const fetchData = async (range: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://9rf6bjk1o9.execute-api.us-east-1.amazonaws.com/Prod/email-read?range=${range}`
      );
      const data = response.data.map((item: any) => ({
        date: new Date(item.SignupTime).toLocaleDateString(),
        signups: 1,
      }));

      const aggregatedData = data.reduce((acc: any, curr: any) => {
        const existing = acc.find((item: any) => item.date === curr.date);
        if (existing) {
          existing.signups += 1;
        } else {
          acc.push({ date: curr.date, signups: 1 });
        }
        return acc;
      }, []);

      const emptyData = generateEmptyData(parseInt(range, 10));
      const mergedData = emptyData.map((emptyDay) => {
        const existingDay = aggregatedData.find(
          (day: any) => day.date === emptyDay.date
        );
        return existingDay ? existingDay : emptyDay;
      });

      setSignupData(mergedData);
    } catch (error) {
      console.error("Error fetching signup data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(dateRange);
  }, [dateRange]);

  const handleRangeChange = (range: string) => {
    setDateRange(range);
    fetchData(range);
  };

  // Calculate the max Y-axis value with a 10% buffer above the highest signup count
  const maxSignupValue =
    Math.max(...signupData.map((item) => item.signups)) || 1;
  const yAxisMax = Math.ceil(maxSignupValue * 1.1); // 10% buffer

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
        User Signups Over Time
      </Typography>
      <div>
        <Button
          variant="contained"
          onClick={() => handleRangeChange("7")}
          sx={{ margin: 1 }}
        >
          Last 7 Days
        </Button>
        <Button
          variant="contained"
          onClick={() => handleRangeChange("30")}
          sx={{ margin: 1 }}
        >
          Last 30 Days
        </Button>
        <Button
          variant="contained"
          onClick={() => handleRangeChange("180")}
          sx={{ margin: 1 }}
        >
          Last 6 Months
        </Button>
        <Button
          variant="contained"
          onClick={() => fetchData(dateRange)}
          sx={{ margin: 1 }}
        >
          Refresh Data
        </Button>
      </div>
      {loading ? (
        <CircularProgress sx={{ margin: "20px" }} />
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={signupData}>
            <CartesianGrid
              stroke={theme.palette.divider}
              strokeDasharray="3 3"
            />
            <XAxis dataKey="date" stroke={theme.palette.text.primary} />
            <YAxis stroke={theme.palette.text.primary} domain={[0, yAxisMax]} />
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
