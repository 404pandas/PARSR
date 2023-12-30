import { useState } from "react";
import Paper from "@mui/material/Paper";
import Dropdown from "./Dropdown";
import InputSelect from "./InputSelect";
import InputType from "./InputType";

export default function Search() {
  const [selectedOption, setSelectedOption] = useState("Name");

  const handleDropdownChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <Paper
      component='form'
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 400,
        height: 60,
      }}
    >
      <div>
        <Dropdown onSelectChange={handleDropdownChange} />
      </div>
      {selectedOption !== "Animal Type" && (
        <InputType onSelectChange={selectedOption} />
      )}
      {selectedOption === "Animal Type" && <InputSelect />}
    </Paper>
  );
}
