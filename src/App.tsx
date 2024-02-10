import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MultiSelect from "./components/MultiSelect";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MultiSelect />
    </QueryClientProvider>
  );
}

export default App;