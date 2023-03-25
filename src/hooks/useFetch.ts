import { useEffect, useState } from "react";

export default function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      try {
        const resp = await fetch(url);
        const { data, error } = await resp.json();
        if (!resp.ok) throw error;
        if (!ignore) setData(data);
      } catch (error) {
        console.error(error);
        setError(true);
      }
    }
    fetchData();

    return () => {
      ignore = true;
    };
  }, [url]);

  return {
    data,
    error,
  };
}
