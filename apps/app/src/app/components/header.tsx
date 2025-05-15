"use client";
import Product from "@/app/components/product";
import { Box, Tab, Tabs, Typography } from "@/lib/mui";
import { useState } from "react";
import Export from "./export";
import UI from "./ui";

interface TabPanelProps {
  children?: React.ReactNode;
  value: string;
  label: string;
}

export const TabPanel = (props: TabPanelProps) => {
  const { children, value, label } = props;

  return (
    <div role="tabpanel" hidden={value !== label}>
      {value === label && <Box>{children}</Box>}
    </div>
  );
};

const Header = () => {
  const [procedure, setProcedure] = useState<string>("Product");

  return (
    <Box
      sx={{
        height: "20%",
        paddingBottom: 2,
        mx: 6,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box>
        <Typography variant="h4">Subscription</Typography>
      </Box>
      <Box
        sx={{
          marginTop: 3,
          paddingBottom: 4,
        }}
      >
        <Tabs
          value={procedure}
          onChange={(e, newVal) => {
            setProcedure(newVal);
          }}
          aria-label="Top Tab"
          sx={{
            "& .MuiTab-root.Mui-selected": {
              color: "#F143E2",
            },
          }}
        >
          <Tab label="1. Product" value="Product" />
          <Tab label="2. UI" value="UI" />
          <Tab label="3. Export" value="Export" />
        </Tabs>
      </Box>
      <TabPanel value={procedure} label="Product">
        <Product />
      </TabPanel>
      <TabPanel value={procedure} label="UI">
        <UI />
      </TabPanel>
      <TabPanel value={procedure} label="Export">
        <Export />
      </TabPanel>
    </Box>
  );
};

export default Header;
