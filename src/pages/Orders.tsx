import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import OrdersTabel from "../components/OrdersTabel";
import styled from "styled-components";
import { req } from "../axiosReqMethods";
import { setError } from "../redux/MessageRedux";
import { useDispatch } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import axios, { CancelTokenSource } from "axios";

// Styled Components
const Container = styled.div`
  padding: 1rem 0;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f4f5f7;
  box-sizing: border-box;
`;

const Wrapper = styled.div`
  width: 1200px;
  max-width: 90%;
`;

const Title = styled.h1`
  font-size: 1.25rem;
`;

const FilterSection = styled.form`
  max-width: 100%;
  display: flex;
  padding: 1.5rem 1rem;
  background-color: white;
  box-sizing: border-box;
  gap: 0.5rem;
  border-radius: 1vmin;

  @media (max-width: 650px) {
    flex-direction: column;
  }

  > * {
    background-color: #f4f5f7;
    border: #f4f5f7 1px solid;
    border-radius: 1vmin;
    padding: 1rem 0.8rem;
  }

  > input:focus,
  > select:focus {
    background-color: white;
  }
`;

const SearchOrder = styled.input`
  padding: 0.7rem 0.5rem;
  outline: none;
  flex: 2;

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

const Sections = styled.select`
  flex: 1;
`;

const Options = styled.option``;

const Search = styled.button`
  flex: 1;
  background-color: teal;
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  :hover {
    background-color: #02a8a8;
  }
`;

const LoadMoreBtn = styled.p`
  margin: 1rem auto;
  width: max-content;
  cursor: pointer;

  :hover {
    text-decoration: underline;
    color: teal;
  }
`;

// Types
interface Order {
  _id: string;
  customerNumber: number;
  status: string;
  totalPrice: number;
  createdAt: string;
  [key: string]: any;
}

interface Queries {
  search?: string;
  status?: string;
  sort?: string;
}

// Component
const Orders: React.FC = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState<number>(1);
  const [queries, setQueries] = useState<Queries>({});

  const handleS = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    { type }: { type: keyof Queries }
  ) => {
    setQueries((prev) => ({ ...prev, [type]: e.target.value }));
  };

  const fetch = async (cancelToken: CancelTokenSource) => {
    try {
      const params = new URLSearchParams(
        queries as Record<string, string>
      ).toString();
      const { data } = await req.get<Order[]>(
        `/api/orders/?page=${page}&${params}`,
        {
          cancelToken: cancelToken.token,
        }
      );
      setOrders((prev) => [...prev, ...data]);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          dispatch(setError(error.response.data.message));
        } else if (axios.isCancel(error)) {
          setOrders([]);
        } else {
          dispatch(setError("Failed to fetch orders"));
        }
      }
    }
  };

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    fetch(cancelToken);
    return () => cancelToken.cancel();
  }, [page]);

  const search = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cancelToken = axios.CancelToken.source();
    setPage(1);
    setOrders([]);
    fetch(cancelToken);
  };

  return (
    <Container>
      <Title>Orders</Title>
      <Wrapper>
        <FilterSection onSubmit={search}>
          <SearchOrder
            type="number"
            placeholder="Search by customer number"
            onChange={(e) => handleS(e, { type: "search" })}
          />
          <Sections onChange={(e) => handleS(e, { type: "status" })}>
            <Options hidden>Status</Options>
            <Options value="pending">Pending</Options>
            <Options value="processing">Processing</Options>
            <Options value="delivered">Delivered</Options>
            <Options value="">All</Options>
          </Sections>
          <Sections onChange={(e) => handleS(e, { type: "sort" })}>
            <Options hidden>Sort</Options>
            <Options value="price-asc">Price Low to High</Options>
            <Options value="price-desc">Price High to Low</Options>
            <Options value="newest">New Orders</Options>
            <Options value="oldest">Old Orders (default)</Options>
          </Sections>
          <Search type="submit">
            <AddIcon /> Search
          </Search>
        </FilterSection>

        <OrdersTabel orders={orders} setOrders={setOrders} />
        <LoadMoreBtn onClick={() => setPage((p) => p + 1)}>
          Load more
        </LoadMoreBtn>
      </Wrapper>
    </Container>
  );
};

export default Orders;
