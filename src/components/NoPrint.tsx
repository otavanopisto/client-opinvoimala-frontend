import styled from 'styled-components';

export const NoPrint = styled.div`
  width: 100%;
  @media print {
    display: none !important;
  }
`;

export default NoPrint;
