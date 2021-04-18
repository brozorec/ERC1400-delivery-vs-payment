import React from "react";
import { PageHeader } from "antd";

// displays a page header

export default function Header() {
  return (
    <a href="https://github.com/brozorec/ERC1400-delivery-vs-payment" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="Auto DvP"
        subTitle="..."
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
