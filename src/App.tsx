import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MultiSelect from "./components/MultiSelect";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const queryClient = new QueryClient();

function App() {
  const theme = createTheme({
    components: {
      MuiAutocomplete: {
        styleOverrides: {
          listbox: {
            '& .MuiAutocomplete-option[aria-selected="true"]': {
              backgroundColor: "transparent",
            },
            '& .MuiAutocomplete-option[aria-selected="true"].Mui-focused': {
              backgroundColor: "transparent",
            },
          },
        },
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <MultiSelect />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
