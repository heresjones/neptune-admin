import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Container, Typography, useTheme } from "@mui/material";
import axios from "axios";

interface User {
  id: string;
  Email: string;
  SignupTime: string;
  UserAgent: string;
  IPAddress: string;
  Country?: string;
  State?: string;
  County?: string;
}

const UserTable: React.FC = () => {
  const [rows, setRows] = useState<User[]>([]);
  const theme = useTheme(); // Access theme for color usage

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://9rf6bjk1o9.execute-api.us-east-1.amazonaws.com/Prod/email-read"
      );

      const dataWithIds = response.data.map((item: User, index: number) => ({
        ...item,
        id: index + 1,
      }));

      setRows(dataWithIds);
    } catch (error) {
      console.error("Error fetching data:", error);
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
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontFamily: "Poppins, sans-serif",
          color: theme.palette.text.primary,
        }}
      >
        Users
      </Typography>
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
      <div
        style={{
          height: "calc(100vh - 100px)",
          width: "100%",
          marginTop: 20,
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
              backgroundColor: "#40CFE2",
              color: "#FFFFFF",
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
