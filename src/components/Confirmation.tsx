import React, { ReactNode } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Modal from "./Modal";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  > svg {
    color: red;
    font-size: 2.5rem;
  }
`;

const Bottom = styled.div`
  background-color: #f9fafb;
  display: flex;
  gap: 1rem;

  > button {
    padding: 0.7rem 1rem;
    border: none;
    border-radius: 1vmin;
  }
`;

const Cancel = styled.button`
  background-color: #e5e7eb;

  :hover {
    background-color: #f2f4f7;
  }
`;

const Delete = styled.button`
  background-color: #008080;
  color: white;

  :hover {
    background-color: #02adad;
  }
`;

// Props interface
interface ConfirmationProps {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  action: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({
  children,
  isOpen,
  setIsOpen,
  action,
}) => {
  return (
    <Modal isOpen={isOpen}>
      <Container>
        <DeleteOutlineIcon />
        {children}
        <Bottom>
          <Cancel onClick={() => setIsOpen(false)}>No, Keep it</Cancel>
          <Delete onClick={action}>Yes, Delete it</Delete>
        </Bottom>
      </Container>
    </Modal>
  );
};

export default Confirmation;
