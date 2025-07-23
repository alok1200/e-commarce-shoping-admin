import React from "react";
import styled from "styled-components";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { req } from "../axiosReqMethods";
import { useDispatch } from "react-redux";
import { setError } from "../redux/MessageRedux";
import { useNavigate } from "react-router-dom";

// ---------------- Styled Components ----------------

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
`;

const Thead = styled.thead`
  background-color: teal;
  color: white;
`;

const Tbody = styled.tbody`
  background-color: white;
`;

const Td = styled.td`
  padding: 0.6rem 1rem;
  vertical-align: middle;

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

// ----- Status Styles -----
const statusColors: Record<string, { background: string; color: string }> = {
  pending: { background: "FDF6B2", color: "C6783B" },
  processing: { background: "DEF7EC", color: "87A66E" },
  delivered: { background: "E1EFFE", color: "3F91FA" },
};

const Status = styled.p<{ status: string }>`
  font-weight: 500;
  margin: 0;
  text-align: center;
  border-radius: 50px;
  background-color: #${({ status }) => statusColors[status]?.background};
  color: #${({ status }) => statusColors[status]?.color};
`;
// --------------------------

const Select = styled.select`
  height: 2rem;
  border-radius: 0.5vmin;
  border: 1px solid lightgrey;
  background-color: #f9fafb;
  padding: 0 0.5rem;
`;

const Options = styled.option``;

// ---------------- Props & Types ----------------

interface Order {
  _id: string;
  createdAt: string;
  price: number;
  orderStatus: "pending" | "processing" | "delivered";
  userInfo: {
    address: {
      city?: string;
      state?: string;
      mobile: string;
    };
  };
}

interface OrdersTabelProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

// ---------------- Component ----------------

const OrdersTabel: React.FC<OrdersTabelProps> = ({ orders, setOrders }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleStateChange = async (
    id: string,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = e.target;

    try {
      const { data } = await req.put(`/api/orders/status/${id}`, {
        status: value,
      });

      dispatch(setError(data.message));

      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o._id === id
            ? { ...o, orderStatus: value as Order["orderStatus"] }
            : o
        )
      );
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || "Update failed"));
    }
  };

  return (
    <TableWrapper>
      <Table>
        <Thead>
          <tr>
            <Td>Order ID</Td>
            <Td>TIME</Td>
            <Td>SHIPPING ADDRESS</Td>
            <Td>PHONE</Td>
            <Td>AMOUNT</Td>
            <Td>STATUS</Td>
            <Td>ACTION</Td>
            <Td>INVOICE</Td>
          </tr>
        </Thead>
        <Tbody>
          {orders?.map((o) => (
            <Tr key={o._id}>
              <Td>
                <ContentCopyIcon
                  onClick={() => navigator.clipboard.writeText(o._id)}
                />
              </Td>
              <Td>{new Date(o.createdAt).toDateString()}</Td>
              <Td>{`${o.userInfo.address?.city}, ${o.userInfo.address?.state}`}</Td>
              <Td>{o.userInfo.address.mobile}</Td>
              <Td>{o.price}</Td>
              <Td>
                <Status status={o.orderStatus}>
                  {o.orderStatus.charAt(0).toUpperCase() +
                    o.orderStatus.slice(1)}
                </Status>
              </Td>
              <Td>
                <Select
                  value={o.orderStatus}
                  onChange={(e) => handleStateChange(o._id, e)}
                >
                  <Options value="pending">Pending</Options>
                  <Options value="processing">Processing</Options>
                  <Options value="delivered">Delivered</Options>
                </Select>
              </Td>
              <Td>
                <RemoveRedEyeOutlinedIcon
                  onClick={() => navigate(`/order/${o._id}`)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableWrapper>
  );
};

export default OrdersTabel;
