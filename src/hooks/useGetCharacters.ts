import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Character } from "../types";
const fetchCharacters = async (searchTerm: string) => {
  const params = { name: searchTerm };
  const response = await axios.get(
    `https://rickandmortyapi.com/api/character`,
    { params }
  );
  return response.data.results as Character[];
};
const useGetCharacters = (searchTerm: string) => {
  const { data, refetch, isLoading, isFetching, isError } = useQuery({
    queryKey: ["characters", searchTerm],
    queryFn: () => fetchCharacters(searchTerm),
    staleTime: 0,
  });
  return { data, refetch, isLoading, isFetching, isError };
};

export default useGetCharacters;
