import styled from 'styled-components';

export const NoPrint = styled.div`
  @media print {
    display: none !important;
  }
`;

export default NoPrint;
