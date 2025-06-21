import {Navbar, NavbarBrand, NavbarContent,Avatar} from "@heroui/react";
import FullLogo from "../../assets/full-logo.svg";

function NavBar() {
    return (
        <Navbar maxWidth="full">
        <NavbarBrand>
          <img src={FullLogo} alt="Full Logo" />
        </NavbarBrand>
       
        <NavbarContent justify="end">
         <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
        </NavbarContent>
      </Navbar>
    )
}

export default NavBar;