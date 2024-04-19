import { Link, useLocation } from "react-router-dom"
import styled from "styled-components"
import logo from "@/assets/image/logo.png"
import styles from "./index.module.scss"
import Person from "../Person"
import Language from "../Language"
import { useTranslation } from "react-i18next"

const NavWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #08121b;
  @media (max-width: 768px) {
    align-items: stretch;
  }
`

const MenuList = styled.ul`
  display: flex;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    align-items: stretch;
  }
`

const MenuItem = styled.li`
  list-style: none;
  margin-top: 12px;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }

  @media (max-width: 768px) {
    margin: 1rem 0;
  }
`

const NavLink = styled(Link)`
  display: block;
  color: #fff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  vertical-align: middle;
  @media (max-width: 945px) {
    font-size: 14px;
    display: none;
  }

  &:hover,
  &.active {
    color: #1677ff;
    opacity: 1;
  }
`

function Navbar({ menus }) {
  const location = useLocation()
  const { t, i18n } = useTranslation()

  return (
    <div className={styles.root}>
      <NavWrapper>
        <Link to="/">
          <img
            style={{
              width: 50,
              height: 50,
              display: "inline-block",
              verticalAlign: "middle",
            }}
            alt="量子"
            className="logo"
            src={logo}
          />
          <span
            style={{ color: "#fff", height: 50, paddingLeft: 10 }}
            className="logoName"
          >
            {t("logo.Tai Yuan Quantum")}
          </span>
        </Link>
        <MenuList>
          {menus?.map(({ label, path }) => (
            <MenuItem key={path}>
              <NavLink
                to={path}
                className={location.pathname === path ? "active" : ""}
              >
                {label}
              </NavLink>
            </MenuItem>
          ))}
          <div className="changeLanguage">
            <Language />
          </div>
          <div className="header_right">
            <Person />
          </div>
        </MenuList>
      </NavWrapper>
    </div>
  )
}

export default Navbar
