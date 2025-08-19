import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const authType = [
  {
    ITEM_LABEL: "REP",
    ITEM_VALUE: "rep",
  },
  {
    ITEM_LABEL: "ARS",
    ITEM_VALUE: "ars",
  },
  {
    ITEM_LABEL: "OTH",
    ITEM_VALUE: "oth",
  },
  {
    ITEM_LABEL: "MMP",
    ITEM_VALUE: "mmp",
  },
];

export default function Consolidation() {
  const [masterData, setMasterData] = useState([
    {
      CustomerCode: "CUST001",
      DemandNo: "DEM20230001",
      ItemCode: "ITM1001",
      ItemDescription: "Metal Pipe 1m",
      StationCode: "STN-F1",
      DemandDate: "2023-05-16",
      Quantity: 100,
      UnitPrice: 2.5,
      AuthType: "rep",
    },
    {
      CustomerCode: "CUST002",
      DemandNo: "DEM20230002",
      ItemCode: "ITM1002",
      ItemDescription: "Steel Rod 2m",
      StationCode: "STN-G2",
      DemandDate: "2023-06-22",
      Quantity: 150,
      UnitPrice: 3.75,
      AuthType: "ars",
    },
    {
      CustomerCode: "CUST003",
      DemandNo: "DEM20230003",
      ItemCode: "ITM1003",
      ItemDescription: "Copper Wire 50m",
      StationCode: "STN-H3",
      DemandDate: "2023-07-10",
      Quantity: 200,
      UnitPrice: 1.8,
      AuthType: "oth",
    },
    {
      CustomerCode: "CUST004",
      DemandNo: "DEM20230004",
      ItemCode: "ITM1004",
      ItemDescription: "Aluminum Sheet 1x1m",
      StationCode: "STN-F1",
      DemandDate: "2023-08-15",
      Quantity: 80,
      UnitPrice: 5.0,
      AuthType: "mmp",
    },
    {
      CustomerCode: "CUST005",
      DemandNo: "DEM20230005",
      ItemCode: "ITM1005",
      ItemDescription: "PVC Pipe 0.5m",
      StationCode: "STN-J4",
      DemandDate: "2023-09-03",
      Quantity: 300,
      UnitPrice: 1.2,
      AuthType: "rep",
    },
    {
      CustomerCode: "CUST006",
      DemandNo: "DEM20230006",
      ItemCode: "ITM1006",
      ItemDescription: "Brass Fitting",
      StationCode: "STN-G2",
      DemandDate: "2023-10-12",
      Quantity: 50,
      UnitPrice: 4.0,
      AuthType: "ars",
    },
    {
      CustomerCode: "CUST007",
      DemandNo: "DEM20230007",
      ItemCode: "ITM1007",
      ItemDescription: "Steel Bolt M10",
      StationCode: "STN-K5",
      DemandDate: "2023-11-20",
      Quantity: 500,
      UnitPrice: 0.5,
      AuthType: "oth",
    },
    {
      CustomerCode: "CUST008",
      DemandNo: "DEM20230008",
      ItemCode: "ITM1008",
      ItemDescription: "Galvanized Plate",
      StationCode: "STN-F1",
      DemandDate: "2023-12-05",
      Quantity: 120,
      UnitPrice: 6.5,
      AuthType: "mmp",
    },
    {
      CustomerCode: "CUST009",
      DemandNo: "DEM20230009",
      ItemCode: "ITM1009",
      ItemDescription: "Iron Angle 2m",
      StationCode: "STN-H3",
      DemandDate: "2024-01-18",
      Quantity: 90,
      UnitPrice: 3.0,
      AuthType: "rep",
    },
    {
      CustomerCode: "CUST010",
      DemandNo: "DEM20230010",
      ItemCode: "ITM1010",
      ItemDescription: "Stainless Steel Tube",
      StationCode: "STN-J4",
      DemandDate: "2024-02-25",
      Quantity: 70,
      UnitPrice: 7.0,
      AuthType: "ars",
    },
  ]);
   const [selectedType, setSelectedType] = useState("all");


  const handleTypeChange = (value) => {
    setSelectedType(value);
    if (value === "all") {
      setFilteredData(masterData);
    } else {
      const filtered = masterData.filter(item => item.AuthType === value);
      setFilteredData(filtered);
    }
  };

  const [filteredData, setFilteredData] = useState(masterData); // Initialize with all data

 

  return (
    <div>
       <Select value={selectedType} onValueChange={handleTypeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {authType.map((items) => (
            <SelectItem
              key={items.ITEM_VALUE}
              value={items.ITEM_VALUE}
            >
              {items.ITEM_LABEL}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>DEMAND NO</TableHead>
            <TableHead>ITEM CODE</TableHead>
            <TableHead>DESCRIPTION</TableHead>
            <TableHead>STATION</TableHead>
            <TableHead>DATE</TableHead>
            <TableHead>QUANTITY</TableHead>
            <TableHead>UNIT PRICE</TableHead>
            <TableHead>AUTHORITY</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item) => (
            <TableRow key={item.DemandNo}>
              <TableCell>{item.DemandNo}</TableCell>
              <TableCell>{item.ItemCode}</TableCell>
              <TableCell>{item.ItemDescription}</TableCell>
              <TableCell>{item.StationCode}</TableCell>
              <TableCell>{item.DemandDate}</TableCell>
              <TableCell>{item.Quantity}</TableCell>
              <TableCell>${item.UnitPrice.toFixed(2)}</TableCell>
              <TableCell>{item.AuthType.toUpperCase()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}