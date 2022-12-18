import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Affix } from "antd";
import Sidenav from "./Sidenav";
import Header from "./Header";
import Footer from "./Footer";

import { Routes, Route } from "react-router-dom";
import Home from "../../../src/pages/Home";
import NotFound from "./404";
import User from "../../pages/User";
import Reviews from "../../pages/Reviews";
import Products from "../../pages/Products";
import Tokens from "../../pages/Tokens";
import Report from "../../pages/Report";
import DetailReview from "../review/DetailReview";
import DetailProduct from "../../pages/detail-product/DetailProduct";
import AddProduct from "../../pages/add-product/AddProduct";
import SignIn from "../modal/SignIn";
import Monitor from "../../pages/Monitor";
import AddService from "../monitor/AddService";

const { Header: AntHeader, Content, Sider } = Layout;

const Main = () => {
  const [visible, setVisible] = useState(false);
  const [sidenavColor, setSidenavColor] = useState("#1890ff");
  const [sidenavType, setSidenavType] = useState("transparent");
  const [fixed, setFixed] = useState(false);
  const [openModal, setOpenModal] = useState(false)

  const openDrawer = () => setVisible(!visible);
  const handleSidenavType = (type) => setSidenavType(type);
  const handleSidenavColor = (color) => setSidenavColor(color);
  const handleFixedNavbar = (type) => setFixed(type);

  let { pathname } = useLocation();
  pathname = pathname.replace("/", "");

  return (
    <Layout
      className={`layout-dashboard ${
        pathname === "profile" ? "layout-profile" : ""
      } ${pathname === "rtl" ? "layout-dashboard-rtl" : ""}`}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        trigger={null}
        width={250}
        theme="light"
        className={`sider-primary ant-layout-sider-primary ${
          sidenavType === "#fff" ? "active-route" : ""
        }`}
        style={{ background: sidenavType }}
      >
        <Sidenav color={sidenavColor} />
      </Sider>
      <Layout style={{ overflowY: 'auto', height: '100vh' }}>
        <div style={{ position: 'sticky' }}>
          {fixed ? (
            <Affix>
              <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
                <Header
                  onPress={openDrawer}
                  name={pathname}
                  subName={pathname}
                  handleSidenavColor={handleSidenavColor}
                  handleSidenavType={handleSidenavType}
                  handleFixedNavbar={handleFixedNavbar}
                  setOpenModal={setOpenModal}
                  openModal={openModal}
                />
              </AntHeader>
            </Affix>
          ) : (
            <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
              <Header
                onPress={openDrawer}
                name={pathname}
                subName={pathname}
                handleSidenavColor={handleSidenavColor}
                handleSidenavType={handleSidenavType}
                handleFixedNavbar={handleFixedNavbar}
                setOpenModal={setOpenModal}
                openModal={openModal}
              />
            </AntHeader>
          )}
        </div>
        <Content className="content-ant" style={{ overflowY: 'auto', position: 'sticky', overflowX: 'hidden' }}>
          <Routes>
            <Route path='' element={<Home />} />
            <Route path='dashboard' element={<Home />} />
            <Route path='users' element={<User />} />
            <Route path='reviews'>
              <Route path='' element={<Reviews />} />
              <Route path=':reviewId/detail' element={<DetailReview />} />
            </Route>
            <Route path='products'>
              <Route path='' element={<Products />} />
              <Route path=':productId' element={<DetailProduct />} />
              <Route path=':productId/reviews/report' element={<Report />} />
              <Route path='add-product' element={<AddProduct />} />
            </Route>
            <Route path='tokens'>
              <Route path='' element={<Tokens />} />
              {/* <Route path=':tokenId' element={<DetailProduct />} /> */}
              {/* <Route path=':tokenId/reviews/report' element={<Report />} /> */}
              {/* <Route path='add-product' element={<AddProduct />} /> */}
            </Route>
            <Route path='monitor'>
              <Route path='' element={<Monitor />} />
              <Route path='add-service' element={<AddService />} />
            </Route>
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Content>
        <Footer />
      </Layout>
      <SignIn
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </Layout>
  );
}

export default Main;
