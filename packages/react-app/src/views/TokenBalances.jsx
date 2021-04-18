import React from "react";
import { formatUnits } from "@ethersproject/units";
import { Statistic, Card, Row, Col } from 'antd';
import { useContractReader } from "../hooks";

const TokenBalances = ({ readContracts, address }) => {

  const total = useContractReader(
    readContracts,
    "ERC1400",
    "balanceOf",
    [address]
  );
  const reserved = useContractReader(
    readContracts,
    "ERC1400",
    "balanceOfByPartition",
    [
      "0x7265736572766564000000000000000000000000000000000000000000000000",
      address
    ]
  );
  const issued = useContractReader(
    readContracts,
    "ERC1400",
    "balanceOfByPartition",
    [
      "0x6973737565640000000000000000000000000000000000000000000000000000",
      address
    ]
  );

  return (
    <div style={{ padding: "30px", background: "#ececec", marginBottom: "50px" }}>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="nombre total de vos jetons"
              value={total ? formatUnits(total) : 'loading...'}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="vos jetons réservés"
              value={9.3}
              value={reserved ? formatUnits(reserved) : 'loading...'}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="vos jetons disponible"
              value={issued ? formatUnits(issued) : 'loading...'}
              precision={2}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default TokenBalances;
