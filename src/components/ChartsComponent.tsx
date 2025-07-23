import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { req } from "../axiosReqMethods";
import BarChart from "./Charts/BarChart";
import PieChart from "./Charts/PieChart";

// Styled component
const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  gap: 1rem;
  margin: 2rem 0;

  @media only screen and (max-width: 800px) {
    flex-direction: column;
  }
`;

// Types
interface SizeColorData {
  sizes: { name: string; value: number }[];
  colors: { name: string; value: number }[];
}

interface ChartDataItem {
  name: string;
  value: number;
}

function ChartsComponent() {
  const [sizeColordataSet, setSizeColorDataSet] = useState<
    SizeColorData[] | null
  >(null);
  const [topProducts, setTopProducts] = useState<ChartDataItem[] | null>(null);
  const [topCat, setTopCat] = useState<ChartDataItem[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [sizeColorRes, topRes, topCatRes] = await Promise.all([
          req.get("/api/analytics/popularsizecolor"),
          req.get("/api/analytics/topproducts/?for=chart"),
          req.get("/api/analytics/topcat"),
        ]);

        setSizeColorDataSet(sizeColorRes.data);
        setTopProducts(topRes.data);
        setTopCat(topCatRes.data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    })();
  }, []);

  return (
    <>
      {sizeColordataSet && sizeColordataSet[0] && (
        <Container>
          <BarChart data={sizeColordataSet[0].sizes} title="Top Size" />
          <BarChart
            data={sizeColordataSet[0].colors}
            color={true}
            title="Top Color"
          />
        </Container>
      )}

      {topProducts && topCat && (
        <Container>
          <PieChart data={topProducts} title="Top Products" />
          <PieChart data={topCat} title="Top Categories" />
        </Container>
      )}
    </>
  );
}

export default ChartsComponent;
