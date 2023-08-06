import { Home } from "@mui/icons-material";
import React from "react";

import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const PageNotFound = () => {
  return (
    <Paper
      sx={{
        backgroundColor: (t) => t.palette.background.default,
        margin: 0,
        height: `calc(100vh - 64px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: `100%`,
        }}
      >
        <Typography variant='h4'>404</Typography>

        <Button
          color='secondary'
          aria-label='home'
          href='/'
          style={{ marginTop: 20 }}
        >
          <Home />
        </Button>
      </div>
    </Paper>
  );
};

export default PageNotFound;
