import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Button,
  Container,
  Typography,
  CircularProgress,
  useTheme,
} from "@mui/material";
import axios from "axios";

const UserTable: React.FC = () => {
  const [rows, setRows] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const theme = useTheme();

  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      const response = await axios.get(
        "https://9rf6bjk1o9.execute-api.us-east-1.amazonaws.com/Prod/email-read"
      );
      const dataWithIds = response.data.map((item: any, index: number) => ({
        ...item,
        id: index + 1,
      }));
      setRows(dataWithIds);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await axios.get(
        "https://9rf6bjk1o9.execute-api.us-east-1.amazonaws.com/Prod/generate-signed-url"
      );
      const { url } = response.data;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "full_dataset.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating signed URL:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "Email", headerName: "Email", width: 250, sortable: true },
    {
      field: "SignupTime",
      headerName: "Signup Time",
      width: 200,
      sortable: true,
    },
    {
      field: "UserAgent",
      headerName: "User Agent",
      width: 300,
      sortable: true,
    },
    {
      field: "IPAddress",
      headerName: "IP Address",
      width: 150,
      sortable: true,
    },
    { field: "Country", headerName: "Country", width: 150, sortable: true },
    { field: "State", headerName: "State", width: 150, sortable: true },
    { field: "County", headerName: "County", width: 150, sortable: true },
  ];

  return (
    <Container
      maxWidth={false}
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        padding: 0,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontFamily: "Poppins, sans-serif",
          color: theme.palette.text.primary,
          padding: "16px",
        }}
      >
        Users
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          gap: "16px",
          padding: "16px",
        }}
      >
        {isLoadingData ? (
          <CircularProgress
            size={24}
            sx={{ margin: "auto", color: "#40CFE2" }}
          />
        ) : (
          <Button
            variant="contained"
            onClick={fetchData}
            sx={{
              backgroundColor: "#40CFE2",
              color: "#FFFFFF",
              fontFamily: "Poppins, sans-serif",
              "&:hover": {
                backgroundColor: "#3DAFB7",
              },
              width: 150,
            }}
          >
            Load Data
          </Button>
        )}
        {isDownloading ? (
          <CircularProgress
            size={24}
            sx={{ margin: "auto", color: "#40CFE2" }}
          />
        ) : (
          <Button
            variant="contained"
            onClick={handleDownload}
            sx={{
              backgroundColor: "#40CFE2",
              color: "#FFFFFF",
              fontFamily: "Poppins, sans-serif",
              "&:hover": {
                backgroundColor: "#3DAFB7",
              },
              width: 150,
            }}
          >
            Download CSV
          </Button>
        )}
      </div>
      <div
        style={{
          height: "calc(100vh - 150px)",
          width: "100%",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          pageSizeOptions={[5]}
          getRowId={(row) => row.id}
          sortingOrder={["asc", "desc"]}
          sx={{
            height: "100%",
            width: "100%",
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.grey[200],
              color: theme.palette.text.primary,
              fontFamily: "Poppins, sans-serif",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        />
      </div>
    </Container>
  );
};

export default UserTable;
