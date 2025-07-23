import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { req } from "../axiosReqMethods";
import { updateUser } from "../redux/apiCalls/users";

// Types
interface User {
  _id: string;
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  number: string;
  isAdmin: boolean;
  resetPasswordExpire?: string;
  createdAt?: string;
}

// Styled Components
const Container = styled.div`
  width: 100%;
  background-color: #f6fbfb;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 20px;
  padding: 15px;
  border-radius: 1vmax;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    margin: 10px;
  }
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;

  @media (max-width: 768px) {
    flex-direction: column;
    margin: 10px;
  }
`;

const Avatar = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserID = styled.h2`
  color: #333;
  font-size: 1.5rem;
  margin-left: 10px;
`;

const MiddleSection = styled.div`
  margin-top: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

const Input = styled.input`
  flex: 1 0 33%;
  margin: 20px;
  padding: 15px;
  border-radius: 1vmin;
  border: none;
  background-color: #d2e5e5;
  font-size: 1rem;
  transition: all 0.3s ease-in-out;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px teal;
  }
`;

const Select = styled.select`
  flex: 1 0 33%;
  margin: 20px;
  padding: 15px;
  border-radius: 1vmin;
  border: none;
  background-color: #d2e5e5;
  font-size: 1rem;
`;

const Option = styled.option``;

const SubmitButton = styled.button`
  width: 40%;
  border: none;
  background-color: teal;
  padding: 15px 20px;
  color: white;
  border-radius: 1vmin;
  margin-left: 58%;
  font-size: 1rem;
  transition: all 0.3s ease-in-out;

  &:disabled {
    color: green;
    background-color: #e1e6ed;
    cursor: not-allowed;
  }

  &:hover {
    background-color: #0e8e8e;
  }
`;

// Component
const UserPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchUser = async () => {
      const response = await req.get(`/api/users/info/${id}`);
      setUser(response.data);
    };
    fetchUser();
  }, [id]);

  const inputOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setUser((prevUser) => {
      if (!prevUser) return null;
      const parsedValue =
        name === "isAdmin" ? JSON.parse(value.toLowerCase()) : value;
      return {
        ...prevUser,
        [name]: parsedValue,
      };
    });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (user) {
      const { resetPasswordExpire, createdAt, _id, ...others } = user;
      updateUser(_id, others);
    }
  };

  return (
    <>
      {user && (
        <Container>
          <TopSection>
            <Avatar src={user.avatar} />
            <UserID>userID : {user._id}</UserID>
          </TopSection>
          <MiddleSection>
            <Form onSubmit={onSubmit}>
              <Input
                name="firstName"
                value={user.firstName}
                onChange={inputOnChange}
              />
              <Input
                name="lastName"
                value={user.lastName}
                onChange={inputOnChange}
              />
              <Input name="email" value={user.email} onChange={inputOnChange} />
              <Input
                name="number"
                value={user.number}
                onChange={inputOnChange}
              />
              <Select
                name="isAdmin"
                value={String(user.isAdmin)}
                onChange={inputOnChange}
              >
                <Option value="true">True</Option>
                <Option value="false">False</Option>
              </Select>
              <SubmitButton type="submit">Save user</SubmitButton>
            </Form>
          </MiddleSection>
        </Container>
      )}
    </>
  );
};

export default UserPage;
