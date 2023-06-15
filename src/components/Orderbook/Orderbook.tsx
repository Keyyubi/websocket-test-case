import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import Row from "../Row/Row";
import TitleRow from "../TitleRow/TitleRow";
import { updateAsks, updateBids } from "./orderbookSlice";
import { StyledContainer, StyledSideContainer } from "./Orderbook.styles";

/* 
Receiving data format {
  Number: ChannelId,
  Array: [
    PRICE,
    COUNT (Quantity),
    AMOUNT
  ]
}

IF AMOUNT > 0 THEN it's a BID
ELSE it's an ASK

The Logic should be like belows:

when count > 0 then you have to add or update the price level
3.1 if amount > 0 then add/update bids
3.2 if amount < 0 then add/update asks

when count = 0 then you have to delete the price level.
4.1 if amount = 1 then remove from bids
4.2 if amount = -1 then remove from asks

*/

function Orderbook() {
  const bids = useAppSelector((state) => state.orderbook.bids);
  const asks = useAppSelector((state) => state.orderbook.asks);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const ws = new WebSocket("wss://api-pub.bitfinex.com/ws/2");

    // WebSocket event listeners
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          event: "subscribe",
          channel: "book",
          symbol: "tBTCUSD",
        })
      );
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      const values = response[1];

      if (values && values.length === 3 && typeof values[1] === "number") {
        if (values[2] > 0) {
          // Means it's a bid
          dispatch(updateBids(values));
        } else {
          // Means it's an ask
          dispatch(updateAsks(values));
        }
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Cleanup function
    return () => {
      ws.close();
    };
  }, []);

  return (
    <StyledContainer>
      <StyledSideContainer>
        <TitleRow isRight={false}/>
        {bids &&
          bids.map((bid) => (
            <Row key={bid[0]} amount={bid[2]} count={bid[1]} price={bid[0]} total={bid[3]} isRight={false}/>
          ))}
      </StyledSideContainer>
      <StyledSideContainer>
        <TitleRow isRight={true} />
        {asks &&
          asks.map((ask) => (
            <Row key={ask[0]} amount={ask[2]} count={ask[1]} price={ask[0]} total={ask[3]} isRight={true} />
          ))}
      </StyledSideContainer>
    </StyledContainer>
  );
}

export default Orderbook;
