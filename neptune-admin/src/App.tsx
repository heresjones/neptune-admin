import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Container,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";

interface EmailData {
  Email: string;
  SignupTime: string;
  UserAgent: string;
  IPAddress: string;
  Country?: string;
  State?: string;
  County?: string;
  ReferralSource: string;
  OtherMetadata: string;
}

const SortableTable: React.FC = () => {
  const [data, setData] = useState<EmailData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof EmailData>("Email");

  useEffect(() => {
    // Fetch the data from the API
    axios
      .get(
        "https://9rf6bjk1o9.execute-api.us-east-1.amazonaws.com/Prod/email-read"
      )
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching data. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleSortRequest = (property: keyof EmailData) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortData = (
    array: EmailData[],
    order: "asc" | "desc",
    orderBy: keyof EmailData
  ) => {
    return array.sort((a, b) => {
      if (order === "asc") {
        return a[orderBy] > b[orderBy] ? 1 : -1;
      } else {
        return a[orderBy] < b[orderBy] ? 1 : -1;
      }
    });
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Signup Data
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Email",
                  "SignupTime",
                  "UserAgent",
                  "IPAddress",
                  "Country",
                  "State",
                  "County",
                  "ReferralSource",
                ].map((column) => (
                  <TableCell key={column}>
                    <TableSortLabel
                      active={orderBy === column}
                      direction={orderBy === column ? orderDirection : "asc"}
                      onClick={() =>
                        handleSortRequest(column as keyof EmailData)
                      }
                    >
                      {column}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortData(data, orderDirection, orderBy).map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.Email}</TableCell>
                  <TableCell>{row.SignupTime}</TableCell>
                  <TableCell>{row.UserAgent}</TableCell>
                  <TableCell>{row.IPAddress}</TableCell>
                  <TableCell>{row.Country || "N/A"}</TableCell>
                  <TableCell>{row.State || "N/A"}</TableCell>
                  <TableCell>{row.County || "N/A"}</TableCell>
                  <TableCell>{row.ReferralSource}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default SortableTable;
