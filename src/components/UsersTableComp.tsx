import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import EditUser from "../components/EditUser";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Confirmation from "./Confirmation";
import { req } from "../axiosReqMethods";
import { deleteUser } from "../redux/UseersComponentRedux";
import { setError } from "../redux/MessageRedux";
import { RootState } from "../redux/store"; // <-- Replace with your actual root state type

interface User {
  _id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  purchasedProducts?: any[]; // adjust if you have specific product types
}

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
`;

const IsAdmin = styled.div<{ value: boolean }>`
  color: ${(p) => (p.value ? "green" : "red")};
`;

function UsersTableComp() {
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.users);
  const users: User[] = data.fetchedUsers;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [EditUserInfo, setEditUserInfo] = useState<User | null>(null);

  const [isWarningOpen, setIsWarningOpen] = useState<boolean>(false);
  const [DeleteUserInfo, setDeleteUserInfo] = useState<User | null>(null);

  const DeleteUser = async () => {
    if (!DeleteUserInfo) return;
    const userId = DeleteUserInfo._id;

    try {
      await req.delete(`/api/users/${userId}`);
      dispatch(deleteUser(userId));
      dispatch(
        setError(
          `${DeleteUserInfo.firstName} ${DeleteUserInfo.lastName}'s Account is deleted Successfully!!`
        )
      );
    } catch (error) {
      dispatch(
        setError(
          `Failed to delete ${DeleteUserInfo.firstName} ${DeleteUserInfo.lastName}'s Account`
        )
      );
    }

    setIsWarningOpen(false);
  };

  return (
    <>
      <TableWrapper>
        <Table>
          <Thead>
            <tr>
              <Td>ID</Td>
              <Td>JOINING DATE</Td>
              <Td>NAME</Td>
              <Td>EMAIL</Td>
              <Td>PURCHASED</Td>
              <Td>isAdmin</Td>
              <Td>ACTIONS</Td>
            </tr>
          </Thead>
          <Tbody>
            {users?.map((u) => (
              <Tr key={u._id}>
                <Td>
                  <div>
                    <ContentCopyIcon
                      onClick={() => navigator.clipboard.writeText(u?._id)}
                    />
                  </div>
                </Td>
                <Td>{new Date(u.createdAt).toDateString()}</Td>
                <Td>{`${u.firstName} ${u.lastName}`}</Td>
                <Td>{u.email}</Td>
                <Td>{u?.purchasedProducts?.length ?? 0}</Td>
                <Td>
                  <IsAdmin value={u.isAdmin}>
                    {JSON.stringify(u.isAdmin)}
                  </IsAdmin>
                </Td>
                <Td>
                  <div>
                    <EditIcon
                      onClick={() => {
                        setEditUserInfo(u);
                        setIsOpen(true);
                      }}
                    />
                    <DeleteIcon
                      onClick={() => {
                        setDeleteUserInfo(u);
                        setIsWarningOpen(true);
                      }}
                    />
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableWrapper>

      <Confirmation
        isOpen={isWarningOpen}
        setIsOpen={setIsWarningOpen}
        action={DeleteUser}
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
            <span style={{ color: "red" }}>
              {`${DeleteUserInfo?.firstName} ${DeleteUserInfo?.lastName}`}
            </span>{" "}
            This User?
          </b>
          <span>
            Do you really want to delete this user? You can't view them in your
            list anymore if you delete!
          </span>
        </div>
      </Confirmation>

      <EditUser
        EditUserInfo={EditUserInfo}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Edit user"
        desc="Update necessary information of users from here"
      />
    </>
  );
}

export default UsersTableComp;
