import {
  Alert,
  Autocomplete,
  AutocompleteChangeReason,
  Avatar,
  Checkbox,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { SyntheticEvent, useCallback, useMemo, useState } from "react";
import useGetCharacters from "../hooks/useGetCharacters";
import { Character } from "../types";
import useCustomDebounce from "../hooks/useCustomDebounce";

const boldenMatchedSubstring = (option: string, query: string) => {
  const parts = option.split(new RegExp(`(${query})`, "gi"));

  return (
    <Typography>
      {parts.map((part, index) => (
        <span
          key={index}
          style={
            part.toLowerCase() === query.toLowerCase()
              ? { fontWeight: "bold" }
              : {}
          }
        >
          {part}
        </span>
      ))}
    </Typography>
  );
};

const MultiSelect = () => {
  const [values, setValues] = useState<(string | Character)[]>([]);
  const [searchTerm, setSearchTerm] = useCustomDebounce("");

  const {
    data: characters = [],
    isLoading,
    isFetching,
    isError,
  } = useGetCharacters(searchTerm);

  const characterNames = useMemo(() => {
    return values
      .filter((item) => typeof item !== "string") // karakter nesnelerini filtrele
      .map((character) => (character as Character).name);
  }, [values]);

  const handleAutocompleteChange = useCallback(
    (
      _event: SyntheticEvent<Element, Event>,
      value: (string | Character)[],
      reason: AutocompleteChangeReason
    ) => {
      if (reason !== "createOption") setValues(value);
    },
    []
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        paddingBlock: "20px",
      }}
    >
      <Autocomplete
        multiple
        value={values}
        loading={isLoading || isFetching}
        onInputChange={(_event, value) => {
          setSearchTerm(value);
        }}
        onChange={handleAutocompleteChange}
        freeSolo
        fullWidth
        options={characters}
        renderInput={(params) => (
          <TextField {...params} label="Search characters..." />
        )}
        getOptionLabel={(option) => {
          if (typeof option === "string") {
            return option;
          }
          return option.name.toString();
        }}
        renderOption={(props, option, { selected }) => {
          return (
            <ListItem {...props} key={option.id}>
              <Checkbox
                checked={selected || characterNames.includes(option.name)}
              />
              <ListItemAvatar>
                <Avatar src={option.image} />
              </ListItemAvatar>
              <ListItemText
                primary={boldenMatchedSubstring(option.name, searchTerm)}
                secondary={`${option.episode.length} Episodes`}
              />
            </ListItem>
          );
        }}
      />
      {isError && (
        <Alert sx={{ marginTop: "10px" }} severity="error">
          Not found
        </Alert>
      )}
    </div>
  );
};

export default MultiSelect;
