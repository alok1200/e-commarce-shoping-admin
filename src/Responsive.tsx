import { css, FlattenSimpleInterpolation } from "styled-components";

export const mobile = (props: FlattenSimpleInterpolation) => {
  return css`
    @media only screen and (max-width: 700px) {
      ${props}
    }
  `;
};
