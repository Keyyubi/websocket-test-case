import styled from "styled-components";
import { formatNumber, roundToNearestDouble } from "../../helpers";
import { useAppSelector } from "../../hooks";

export const StyledRow = styled.div<{ isRight: boolean }>`
  display: flex;
  flex-direction: ${({ isRight }) => (isRight ? "row-reverse" : "row")};
  justify-content: space-around;
  position: relative;
  width: 100%;
  height: 30px;
  z-index: 1;

  span {
    width: 25%;
  }
`;

type RowProps = {
  amount: number;
  count: number;
  price: number;
  total: number;
  isRight: boolean;
};

function Row(props: RowProps) {
  const { amount, count, price, total, isRight = false } = props;
  const maxTotalBids = useAppSelector((state) => state.orderbook.maxTotalBids);
  const maxTotalAsks = useAppSelector((state) => state.orderbook.maxTotalAsks);
  const maxTotal = isRight ? maxTotalAsks : maxTotalBids;
  const depth = Math.floor((total / maxTotal) * 100);

  /** The reason why I used inline style for the background visualization is
   * to prevent producing lots of styled components with different classnames.
   * Because every different depth would cause producing a different stlyed component which means a different className
   */
  return (
    <StyledRow isRight={isRight}>
      <div
        style={{
          position: "absolute",
          width: depth,
          maxWidth: "100%",
          height: "100%",
          left: isRight ? 0 : "unset",
          right: isRight ? "unset" : 0,
          backgroundColor: isRight ? "#680101" : "#044900",
          opacity: 0.5,
          zIndex: -1,
        }}
      ></div>
      <span>{count}</span>
      <span>{roundToNearestDouble(Math.abs(amount))}</span>
      <span>{total}</span>
      <span>{formatNumber(price)}</span>
    </StyledRow>
  );
}

export default Row;
