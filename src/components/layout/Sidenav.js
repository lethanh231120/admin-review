import { Menu } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";

function Sidenav({ color }) {
  const { pathname } = useLocation();
  const page = pathname.replace("/", "");

  const dashboard = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z"
        fill={color}
      ></path>
      <path
        d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z"
        fill={color}
      ></path>
      <path
        d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const billing = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M4 4C2.89543 4 2 4.89543 2 6V7H18V6C18 4.89543 17.1046 4 16 4H4Z"
        fill={color}
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 9H2V14C2 15.1046 2.89543 16 4 16H16C17.1046 16 18 15.1046 18 14V9ZM4 13C4 12.4477 4.44772 12 5 12H6C6.55228 12 7 12.4477 7 13C7 13.5523 6.55228 14 6 14H5C4.44772 14 4 13.5523 4 13ZM9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H10C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12H9Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const menuItem = [
    {
      url: 'dashboard',
      image: dashboard,
      label: 'Dashboard'
    },
    // {
    //   url: 'users',
    //   image: profile,
    //   label: 'Users'
    // },
    // {
    //   url: 'reviews',
    //   image: billing,
    //   label: 'Reviews'
    // },
    // {
    //   url: 'products',
    //   image: billing,
    //   label: 'Products'
    // },
    {
      url: 'duplicate',
      image: billing,
      label: 'Duplicate'
    },
    // {
    //   url: 'tokens',
    //   image: billing,
    //   label: 'Tokens'
    // },
    {
      url: 'monitor',
      image: billing,
      label: 'Monitor'
    },
    // {
    //   url: 'tables',
    //   image: tables,
    //   label: 'Tables'
    // },
    // {
    //   url: 'billing',
    //   image: billing,
    //   label: 'Billing'
    // },
    // {
    //   url: 'rtl',
    //   image: rtl,
    //   label: 'RTL'
    // },
    // {
    //   url: 'profile',
    //   image: profile,
    //   label: 'Profile'
    // },
    // {
    //   url: 'sign-in',
    //   image: signin,
    //   label: 'Sign In'
    // },
    // {
    //   url: 'sign-up',
    //   image: signup,
    //   label: 'Sign Up'
    // }
  ]

  return (
    <>
      <div className="brand">
        <img src={logo} alt="" />
        <span>GEAR5.guru</span>
      </div>
      <hr />
      <Menu theme="light" mode="inline">
        {menuItem?.map((item, index) => (
          <Menu.Item key={index+1}>
            <NavLink to={item?.url}>
              <span
                className="icon"
                style={{
                  background: page === item?.url ? color : "",
                }}
              >
                {item?.image}
              </span>
              <span className="label">{item?.label}</span>
            </NavLink>
          </Menu.Item>
        ))}
      </Menu>
    </>
  );
}

export default Sidenav;
