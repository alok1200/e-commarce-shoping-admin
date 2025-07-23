import { useState, useEffect, ChangeEvent } from "react";
import EditModal from "./EditModal";
import styled from "styled-components";
import { updateUser } from "../redux/apiCalls/users";
import { useDispatch } from "react-redux";

const Container = styled.div`
  margin: 1rem 0;
  display: grid;
  gap: 1rem;
  @media (max-width: 800px) {
    margin-left: 1em;
  }
`;

const Section = styled.div`
  display: flex;

  @media (max-width: 800px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Left = styled.div`
  flex: 1;
`;

const Right = styled.div`
  flex: 2;

  > input,
  select {
    box-sizing: border-box;
    width: 100%;
    padding: 0.9rem 0.5rem;
    background-color: #f4f5f7;
    border: 1px rgb(229, 231, 235) solid;
    border-radius: 1vmin;
    font-size: 1.1rem;
    outline: none;

    :focus {
      background-color: white;
    }
  }
`;

type EditUserProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  EditUserInfo?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    number: string;
    isAdmin: boolean;
    createdAt?: string;
    resetPasswordExpire?: string;
  };
  title: string;
  desc: string;
  action?: () => void;
};

type UserType = {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  number: string;
  isAdmin: boolean;
};

function EditUser({
  isOpen,
  setIsOpen,
  EditUserInfo,
  title,
  desc,
}: EditUserProps) {
  const DefaultValues: UserType = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    number: "",
    isAdmin: false,
  };

  const [User, setUser] = useState<UserType>(DefaultValues);

  useEffect(() => {
    if (!EditUserInfo) return;
    setUser({ ...EditUserInfo });
  }, [EditUserInfo]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const dispatch = useDispatch();
  const handleSubmit = async () => {
    if (!EditUserInfo || !User._id) return;
    const { resetPasswordExpire, createdAt, _id, ...others } = User;
    await updateUser(dispatch, User._id, others);
    setIsOpen(false);
  };

  return (
    <EditModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      action={handleSubmit}
      title={title}
      desc={desc}
    >
      <Container>
        <Section>
          <Left>
            <label>First name</label>
          </Left>
          <Right>
            <input
              name="firstName"
              value={User.firstName}
              onChange={handleChange}
            />
          </Right>
        </Section>

        <Section>
          <Left>
            <label>Last name</label>
          </Left>
          <Right>
            <input
              name="lastName"
              value={User.lastName}
              onChange={handleChange}
            />
          </Right>
        </Section>

        <Section>
          <Left>
            <label>Email</label>
          </Left>
          <Right>
            <input name="email" value={User.email} onChange={handleChange} />
          </Right>
        </Section>

        <Section>
          <Left>
            <label>Number</label>
          </Left>
          <Right>
            <input name="number" value={User.number} onChange={handleChange} />
          </Right>
        </Section>

        <Section>
          <Left>
            <label>IsAdmin</label>
          </Left>
          <Right>
            <select
              value={User.isAdmin.toString()}
              onChange={(e) =>
                setUser((prev) => ({
                  ...prev,
                  isAdmin: e.target.value === "true",
                }))
              }
            >
              <option value="false">User</option>
              <option value="true">Admin</option>
            </select>
          </Right>
        </Section>
      </Container>
    </EditModal>
  );
}

export default EditUser;
