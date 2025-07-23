import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { clearError } from "../redux/MessageRedux";
import { RootState } from "../redux/store"; // adjust if store path/type is different

interface ContainerProps {
  value: string;
}

const Container = styled.div<ContainerProps>`
  display: ${(props) => props.value};
  transition: all 0.5s ease-in-out;
  position: sticky;
  bottom: 0;
`;

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  min-height: 50px;
  background-color: #353536;
  display: flex;
  align-items: center;
`;

const Success = styled.div`
  margin-left: 15px;
  font-weight: 500;
  color: white;
`;

function MessageComponent(): JSX.Element {
  const dispatch = useDispatch();

  const id = useSelector((state: RootState) => state.error.id);
  const message = useSelector((state: RootState) => state.error.error);
  const [isShow, setIsShow] = useState<string>("block");

  useEffect(() => {
    if (message && id) {
      setIsShow("block");
      const timeout = setTimeout(() => {
        dispatch(clearError());
        setIsShow("none");
        console.log("hiding error");
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [message, id, dispatch]);

  return (
    <>
      {message && id && (
        <Container value={isShow}>
          <Wrapper>
            <Success>{message}</Success>
          </Wrapper>
        </Container>
      )}
    </>
  );
}

export default MessageComponent;
