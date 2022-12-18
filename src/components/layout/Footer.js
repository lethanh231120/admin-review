import { Layout, Row, Col } from "antd";

function Footer() {
  const { Footer: AntFooter } = Layout;

  return (
    <AntFooter style={{ background: "#fafafa" }}>
      <Row className="just">
        <Col xs={24} md={12} lg={12}>
          <div className="copyright">
            © 2022, Copyright by
            <a href="https://killkaido.gear5.guru" className="font-weight-bold" rel="noreferrer" target="_blank">
              Gear5.guru
            </a>
          </div>
        </Col>
      </Row>
    </AntFooter>
  );
}

export default Footer;
