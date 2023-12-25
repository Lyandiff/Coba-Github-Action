import React, { useEffect, useRef, useState } from "react";
import style from "@/assets/nav.module.css";
import { NavLink } from "react-router-dom";
import "@/assets/style.css";

// function Lt() {
//   return <>&lt;</>
// }

export default function Navbar() {
  const [menu, setMenu] = useState(false);
  const navulref = useRef(null);
  const navh1ref = useRef(null);

  const navroute = {
    Home: "/",
    Blog: "/blog",
    Project: "/project",
    About: "/about",
  };

  const navicon = {
    Home: "home",
    Blog: "feed",
    Project: "box",
    About: "info",
  };

  useEffect(() => {
    function handleClick(event) {
      if (
        !navulref.current.contains(event.target) &&
        !navh1ref.current.contains(event.target)
      )
        setMenu(false);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <nav className={style.navbar} role="navigation">
      <div>
        <h1 ref={navh1ref} onClick={() => setMenu(before => !before)}>
          <label className="material-symbols-rounded">
            {menu ? "close" : "menu"}
          </label>
          Lanie
        </h1>
        <ul ref={navulref} style={{ display: menu ? "flex" : "none" }}>
          {Object.keys(navroute).map(route => (
            <li key={route}>
              <NavLink
                className={({ isActive }) =>
                  isActive ? style.active : style.link
                }
                to={navroute[route]}
              >
                {({ isActive }) => (
                  <>
                    <span className="material-symbols-rounded">
                      {navicon[route]}
                    </span>
                    {route}{isActive ? <>&nbsp;&lt;</> : ""}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={e => e.preventDefault()}>
        <button type="submit">install</button>
      </form>
    </nav>
  );
}
