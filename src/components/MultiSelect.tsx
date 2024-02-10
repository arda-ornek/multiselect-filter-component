import {
  Alert,
  Autocomplete,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { SyntheticEvent, useCallback, useState } from "react";
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

  const handleAutocompleteChange = useCallback(
    (_event: SyntheticEvent<Element, Event>, value: (string | Character)[]) => {
      const isOption = characters.some(
        (character) =>
          character.name.toLowerCase() ===
          (value.slice(-1)?.[0] as Character).name.toLowerCase()
      );

      if (isOption) {
        setValues(value);
      }
    },
    [characters]
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
        renderOption={(props, option) => {
          return (
            <ListItem {...props} key={option.id}>
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
