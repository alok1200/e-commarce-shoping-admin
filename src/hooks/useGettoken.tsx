import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

// Define the shape of your Redux state (adjust according to your store structure)
interface RootState {
  user: {
    currentUser: {
      accessToken: string | null;
    } | null;
  };
}

const useGettoken = (): string | null => {
  const [token, setToken] = useState<string | null>(null);

  const tok = useSelector(
    (state: RootState) => state.user.currentUser?.accessToken ?? null
  );

  useEffect(() => {
    console.log(tok);
    setToken(tok);
  }, [tok]); // added `tok` as dependency for correctness

  return token;
};

export default useGettoken;
