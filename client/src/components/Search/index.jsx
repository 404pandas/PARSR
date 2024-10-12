import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Dropdown from "./Dropdown";
import InputSelect from "./InputSelect";
import InputType from "./InputType";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { useQuery } from "@apollo/client";
import { QUERY_PETS } from "../../utils/queries";

const sleep = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration));

export default function Search() {
  const [selectedOption, setSelectedOption] = useState("Name");
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 900);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);

  const { loading, error, data } = useQuery(QUERY_PETS);

  const handleDropdownChange = (option) => setSelectedOption(option);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let active = true;

    if (open && options.length === 0) {
      (async () => {
        await sleep(1000); // For demo purposes
        if (active && data?.pets) {
          const searchOptions = data.pets.map((pet) => ({
            title: pet.description,
          }));
          setOptions(searchOptions);
        }
      })();
    }

    return () => {
      active = false;
    };
  }, [data, open, options.length]);

  useEffect(() => {
    if (!open) setOptions([]);
  }, [open]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div id='description-search'>
      {isSmallScreen ? (
        <Autocomplete
          sx={{ width: 300 }}
          id='auto-complete'
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          isOptionEqualToValue={(option, value) => option.title === value.title}
          getOptionLabel={(option) => option.title || ""}
          options={options.map((option) => ({ ...option, key: option.title }))}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Description'
              id='text-field'
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading && <CircularProgress color='inherit' size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      ) : (
        <Paper
          component='form'
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
            height: 50,
          }}
        >
          <Dropdown onSelectChange={handleDropdownChange} />
          {selectedOption === "Animal Type" ? (
            <InputSelect />
          ) : (
            <InputType onSelectChange={selectedOption} />
          )}
        </Paper>
      )}
    </div>
  );
}
