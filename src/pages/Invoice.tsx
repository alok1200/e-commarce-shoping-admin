import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { req } from "../axiosReqMethods";
import { useLocation } from "react-router-dom";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";

// Types
interface Product {
  title: string;
  quantity: number;
  price: number;
}

interface UserInfo {
  name: string;
  address: {
    mobile: string;
    street: string;
    city: string;
    zip: string;
    state: string;
  };
}

interface Order {
  createdAt: string;
  orderStatus: keyof typeof statusColors;
  paymentInfo: {
    razorpay_order_id: string;
  };
  userInfo: UserInfo;
  products: Product[];
  price: number;
  type: string;
}

// Styled Components
const Container = styled.div`
  background-color: #f4f5f7;
  min-height: 100vh;
  padding-bottom: 2rem;
  display: flex;
  justify-content: center;

  @page {
    size: auto;
    margin: 0mm;
  }

  @media print {
    background-color: red;
  }
`;

const Wrapper = styled.div`
  width: 1200px;
  max-width: 90%;
  height: max-content;
`;

const Title = styled.h2``;

const InvoiceContainer = styled.div`
  border-radius: 1vmax;
  background-color: #fff;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const First = styled.div`
  display: flex;
  justify-content: space-between;

  > h1 {
    font-size: 1.1rem;
    > p {
      margin: 0;
    }
  }

  > div {
    text-align: end;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    > p {
      margin: 0;
    }
  }

  @media only screen and (max-width: 700px) {
    flex-direction: column;
    > div {
      text-align: left;
    }
  }
`;

const statusColors = {
  pending: { background: "FDF6B2", color: "C6783B" },
  processing: { background: "DEF7EC", color: "87A66E" },
  delivered: { background: "E1EFFE", color: "3F91FA" },
};

const Status = styled.span<{ status: keyof typeof statusColors }>`
  font-weight: 500;
  margin: 0;
  padding: 0 0.7rem;
  text-align: center;
  border-radius: 50px;
  background-color: #${({ status }) => statusColors[status]?.background};
  color: #${({ status }) => statusColors[status]?.color};
`;

const SecondoryTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
`;

const SmallTitle = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  margin: 0.4rem 0;
  color: #707275;
`;

const Second = styled.div`
  display: flex;
  justify-content: space-between;
  @media only screen and (max-width: 700px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ItemContainer = styled.div<{ right?: boolean }>`
  text-align: ${(p) => (p.right ? "right" : "left")};
  @media only screen and (max-width: 700px) {
    text-align: left;
  }
`;

const Third = styled.div`
  margin-top: 20px;
  overflow: auto;
  border: 1px solid #d5d6d7;
  border-radius: 1vmin;
`;

const Table = styled.table`
  width: 100%;
  min-width: 500px;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background-color: teal;
  color: white;

  > * {
    font-size: 0.9rem;
  }
`;

const Tbody = styled.tbody`
  background-color: white;
`;

const Td = styled.td<{ price?: boolean }>`
  padding: 0.75rem 1rem;
  vertical-align: middle;
  color: ${({ price }) => (price ? "red" : "inherit")};
  font-weight: ${({ price }) => (price ? 600 : "normal")};

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
`;

const Tr = styled.tr`
  border-bottom: 1px solid #d5d6d7;
`;

const Fourth = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #f4f5f7;
  border-radius: 1vmax;

  @media only screen and (max-width: 700px) {
    flex-direction: column;
  }
`;

const FourthChild = styled.div`
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  > span {
    font-weight: 600;
  }
`;

const PrintBtn = styled.button`
  padding: 0.7rem 1.5rem;
  border-radius: 1vmin;
  background-color: teal;
  color: white;
  border: none;
  margin: 1rem 0;
  font-weight: 400;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;

  :hover {
    background-color: #00a5a5;
  }
`;

// Component
const Invoice: React.FC = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await req.get(`api/orders/${id}`);
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order", error);
      }
    })();
  }, [id]);

  const handlePrint = () => {
    const printContents =
      document.getElementById("invoice-container")?.innerHTML;
    if (!printContents) return;

    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <Container>
      {order && (
        <Wrapper>
          <Title>Invoice</Title>
          <div id="invoice-container">
            <InvoiceContainer id="invoice">
              <First>
                <h1>
                  INVOICE
                  <SmallTitle>
                    STATUS:{" "}
                    <Status status={order.orderStatus}>
                      {order.orderStatus}
                    </Status>
                  </SmallTitle>
                </h1>
                <div>
                  <h2 style={{ margin: 0, marginBottom: "0.5rem" }}>
                    {process.env.REACT_APP_COMPANY_NAME}
                  </h2>
                  <p>
                    {process.env.REACT_APP_COMPANY_ADDRESS}
                    <br />
                    {process.env.REACT_APP_COMPANY_ADDRESS_COUNTRY}
                  </p>
                </div>
              </First>
              <Second>
                <ItemContainer>
                  <SecondoryTitle>DATE</SecondoryTitle>
                  {new Date(order.createdAt).toLocaleString()}
                </ItemContainer>
                <ItemContainer>
                  <SecondoryTitle>ORDER ID</SecondoryTitle>
                  {order.paymentInfo.razorpay_order_id}
                </ItemContainer>
                <ItemContainer right>
                  <SecondoryTitle>INVOICE TO.</SecondoryTitle>
                  {order.userInfo.name}
                  <br />
                  {order.userInfo.address.mobile}
                  <br />
                  {`${order.userInfo.address.street}, ${order.userInfo.address.city} - ${order.userInfo.address.zip}, ${order.userInfo.address.state}`}
                </ItemContainer>
              </Second>
              <Third>
                <Table>
                  <Thead>
                    <tr>
                      <Td>SR.</Td>
                      <Td>PRODUCT NAME</Td>
                      <Td>QUANTITY</Td>
                      <Td>ITEM PRICE</Td>
                      <Td>TOTAL</Td>
                    </tr>
                  </Thead>
                  <Tbody>
                    {order.products.map((o, index) => (
                      <Tr key={index}>
                        <Td>{index + 1}</Td>
                        <Td>{o.title}</Td>
                        <Td>
                          <b>{o.quantity}</b>
                        </Td>
                        <Td>
                          <b>{o.price}</b>
                        </Td>
                        <Td price>{o.price * o.quantity}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Third>
              <Fourth>
                <FourthChild>
                  <SecondoryTitle>ORDER TYPE</SecondoryTitle>
                  <span>{order.type}</span>
                </FourthChild>
                <FourthChild>
                  <SecondoryTitle>TRANSACTION COST</SecondoryTitle>
                  <span>{(order.price * 0.02).toFixed(2)}</span>
                </FourthChild>
                <FourthChild>
                  <SecondoryTitle>DISCOUNT</SecondoryTitle>
                  <span>0</span>
                </FourthChild>
                <FourthChild>
                  <SecondoryTitle>TOTAL AMOUNT</SecondoryTitle>
                  <span>{Math.ceil(order.price + order.price * 0.02)}</span>
                </FourthChild>
              </Fourth>
            </InvoiceContainer>
          </div>
          <PrintBtn onClick={handlePrint}>
            Print invoice <LocalPrintshopIcon />
          </PrintBtn>
        </Wrapper>
      )}
    </Container>
  );
};

export default Invoice;
