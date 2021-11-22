import styled from 'styled-components';

export const NoPrint = styled.div`
  @media print {
    display: none;
  }
`;

export default NoPrint;
