import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/userRedux";
import { Link } from "react-router-dom";
import MenuOpenOutlinedIcon from "@mui/icons-material/MenuOpenOutlined";
import { RootState } from "../redux/store"; // Adjust if your RootState is located elsewhere

interface NavbarProps {
  setSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}

interface TopLeftProps {
  isOpen: boolean;
}

const NavbarContainer = styled.div`
  width: 100%;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.8);
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 3px 2px -1px rgba(0, 0, 0, 0.1);

  > * svg {
    cursor: pointer;
  }
`;

const NavbarWrapper = styled.div`
  height: 100%;
  padding: 0px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.span`
  font-weight: bold;
  font-size: 30px;
  cursor: pointer;
`;

const TopLeft = styled.div<TopLeftProps>`
  display: flex;
  align-items: center;
  gap: 1rem;

  > svg {
    transition: transform 0.1s ease-in-out;
    transform: ${(p) => (p.isOpen ? "rotateY(0)" : "rotateY(180deg)")};
  }
`;

const TopRight = styled.div`
  display: flex;
  align-items: center;
`;

const Auth = styled.p`
  margin: 5px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const Navbar: React.FC<NavbarProps> = ({ setSideBar, isOpen }) => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.clear();
  };

  return (
    <NavbarContainer>
      <NavbarWrapper>
        <TopLeft isOpen={isOpen}>
          <MenuOpenOutlinedIcon onClick={() => setSideBar((p) => !p)} />
          <Logo>
            <Link to="/">vc8bp</Link>
          </Logo>
        </TopLeft>
        <TopRight>
          {!user ? (
            <>
              <Auth>
                <Link to="/login">Login</Link>
              </Auth>
              <Auth>Signup</Auth>
            </>
          ) : (
            <>
              <Avatar src={user.avatar} alt="avatar" />
              <Auth onClick={handleLogout}>Logout</Auth>
            </>
          )}
        </TopRight>
      </NavbarWrapper>
    </NavbarContainer>
  );
};

export default Navbar;
