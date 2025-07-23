import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect, ChangeEvent } from "react";
import styled from "styled-components";
import { req } from "../axiosReqMethods";
import ProductsComp from "../components/ProductsComp";
import { setProducts } from "../redux/Products";
import { useDispatch } from "react-redux";
import EditProduct from "../components/EditProducts";
import axios from "axios";

interface Query {
  category?: string;
  sort?: string;
  s?: string;
}

const Container = styled.div`
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

const FilterSection = styled.div`
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

  > input:focus {
    background-color: white;
  }

  > select:focus {
    background-color: white;
  }
`;

const SearchProduct = styled.input`
  padding: 0.7rem 0.5rem;
  outline: none;
  flex: 2;
`;

const Sections = styled.select`
  flex: 1;
`;

const Options = styled.option``;

const AddProduct = styled.button`
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

function Products() {
  const dispatch = useDispatch();
  const [querie, setQuery] = useState<Query>({});
  const [editIsOpen, setEditIsOpen] = useState(false);

  const handleS = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    { type }: { type: keyof Query }
  ) => {
    setQuery((prev) => ({ ...prev, [type]: e.target.value }));
  };

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();

    (async () => {
      try {
        const url = `/api/products/allinfo?limit=100&${new URLSearchParams(
          querie as Record<string, string>
        )}`;
        const { data } = await req.get(url, {
          cancelToken: cancelTokenSource.token,
        });
        dispatch(setProducts(data));
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.log(error);
      }
    })();

    return () => cancelTokenSource.cancel();
  }, [querie]);

  return (
    <Container>
      <Title>Products</Title>
      <Wrapper>
        <FilterSection>
          <SearchProduct
            placeholder="Search by product name"
            onChange={(e) => handleS(e, { type: "s" })}
          />
          <Sections onChange={(e) => handleS(e, { type: "category" })}>
            <Options value="" defaultValue="">
              category
            </Options>
            <Options value="jewelery">jewelery</Options>
            <Options value="clothing">clothing</Options>
            <Options value="bottom">bottom</Options>
          </Sections>
          <Sections onChange={(e) => handleS(e, { type: "sort" })}>
            <Options value="" defaultValue="">
              Price sort
            </Options>
            <Options value="price-asc">Low to high</Options>
            <Options value="price-desc">High to low</Options>
          </Sections>
          <AddProduct onClick={() => setEditIsOpen(true)}>
            <AddIcon /> Add Product
          </AddProduct>
        </FilterSection>
        <ProductsComp />
      </Wrapper>
      <EditProduct
        isOpen={editIsOpen}
        setIsOpen={setEditIsOpen}
        editProduct={false}
        title="Add Product"
        desc="Add your product's information from here"
      />
    </Container>
  );
}

export default Products;
