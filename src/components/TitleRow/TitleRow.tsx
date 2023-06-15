import styled from "styled-components";

type TitleRowProps = { isRight: boolean };

const StyledContainer = styled.div<TitleRowProps>`
  width: 100%;
  display: flex;
  flex-direction: ${({ isRight }) => (isRight ? "row-reverse" : "row")};
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid #ccc;

  span {
    width: 25%;
  }
`;

const TitleRow = ({ isRight }: TitleRowProps) => (
  <StyledContainer isRight={isRight}>
    <span>Count</span>
    <span>Amount</span>
    <span>Total</span>
    <span>Price</span>
  </StyledContainer>
);

export default TitleRow;
