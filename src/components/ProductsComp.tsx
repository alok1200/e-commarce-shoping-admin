import React, { useState } from "react";
import styled from "styled-components";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

import Confirmation from "./Confirmation";
import ProductNotFound from "./ProductNotFound";
import EditProduct from "./EditProducts";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store"; // <-- You should replace this with your actual RootState
import { req } from "../axiosReqMethods";
import { deleteProduct } from "../redux/Products";
import { setError } from "../redux/MessageRedux";

// Styled Components
const TableWrapper = styled.div`
  margin-top: 20px;
  overflow: auto;
  border: 1px solid #d5d6d7;
  border-radius: 1vmin;
`;

const Table = styled.table`
  width: 100%;
  min-width: 1000px;
  border-collapse: collapse;
  overflow: auto;
`;

const Thead = styled.thead`
  background-color: teal;
  color: white;
`;

const Tbody = styled.tbody`
  background-color: white;
`;

const Td = styled.td`
  padding: 0.75rem 1rem;
  vertical-align: middle;

  > div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  > svg {
    color: rgb(171, 171, 171);

    :hover {
      color: rgb(130, 130, 130);
    }
  }

  > div > svg {
    color: rgb(171, 171, 171);
    :hover {
      color: rgb(130, 130, 130);
    }
  }
`;

const Tr = styled.tr`
  border-bottom: 1px solid #d5d6d7;
`;

const Image = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-position: center;
  object-fit: cover;
`;

// Product Type (adjust according to your schema)
interface Product {
  _id: string;
  img: string;
  productno: string;
  title: string;
  categories: string[];
  price: number;
  quantity: number;
  purchasedCount: number;
}

// Component
const ProductsComp: React.FC = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.Products.products);

  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const [deleteProductInfo, setDeleteProductInfo] = useState<Product | null>(
    null
  );

  const handleDelete = (product: Product) => {
    setDeleteProductInfo(product);
    setDeleteIsOpen(true);
  };

  const deleteProductHandler = async () => {
    if (!deleteProductInfo) return;
    try {
      const { data } = await req.delete(
        `/api/products/${deleteProductInfo._id}`
      );
      dispatch(setError(data.message));
      dispatch(deleteProduct(deleteProductInfo._id));
    } catch (error: any) {
      dispatch(
        setError(error.response?.data?.message || "Error deleting product")
      );
    }
    setDeleteIsOpen(false);
  };

  const [editIsOpen, setEditIsOpen] = useState(false);
  const [editProductInfo, setEditProductInfo] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditIsOpen(true);
    setEditProductInfo(product);
  };

  return (
    <>
      {products?.length ? (
        <TableWrapper>
          <Table>
            <Thead>
              <tr>
                <Td>PRO NO.</Td>
                <Td>PRODUCT NAME</Td>
                <Td>CATEGORY</Td>
                <Td>PRICE</Td>
                <Td>STOCK</Td>
                <Td>PURCHASED</Td>
                <Td>DETAILS</Td>
                <Td>ACTIONS</Td>
              </tr>
            </Thead>
            <Tbody>
              {products.map((p: Product) => (
                <Tr key={p._id}>
                  <Td>
                    <div>
                      <ContentCopyIcon
                        onClick={() => navigator.clipboard.writeText(p._id)}
                      />
                      {p.productno}
                    </div>
                  </Td>
                  <Td>
                    <div>
                      <Image src={p.img} alt="product" />
                      {p.title.length > 50
                        ? `${p.title.slice(0, 50)}...`
                        : p.title}
                    </div>
                  </Td>
                  <Td>{p.categories?.[0] || ""}</Td>
                  <Td>{p.price}</Td>
                  <Td>{p.quantity}</Td>
                  <Td>{p.purchasedCount}</Td>
                  <Td>DETAILS</Td>
                  <Td>
                    <div>
                      <RemoveRedEyeOutlinedIcon
                        onClick={() =>
                          window.open(
                            `${process.env.REACT_APP_MAIN_SITE_URL}/product/${p._id}`,
                            "_blank"
                          )
                        }
                      />
                      <EditIcon onClick={() => handleEdit(p)} />
                      <DeleteIcon onClick={() => handleDelete(p)} />
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableWrapper>
      ) : (
        <ProductNotFound />
      )}

      <Confirmation
        isOpen={deleteIsOpen}
        setIsOpen={setDeleteIsOpen}
        action={deleteProductHandler}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            gap: "0.5rem",
          }}
        >
          <b>
            Are You Sure! Want to Delete{" "}
            <span style={{ color: "red" }}>{deleteProductInfo?.title}</span>{" "}
            Record?
          </b>
          <span>
            Do you really want to delete these records? You can't view this in
            your list anymore if you delete!
          </span>
        </div>
      </Confirmation>

      <EditProduct
        isOpen={editIsOpen}
        setIsOpen={setEditIsOpen}
        EditProductInfo={editProductInfo}
        title="Update Product"
        desc="Updated your product and necessary information from here"
      />
    </>
  );
};

export default ProductsComp;
