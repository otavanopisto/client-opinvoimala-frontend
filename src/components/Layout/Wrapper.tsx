import styled from 'styled-components';

export type WrapperSize = 'sm' | 'normal';

const Wrapper = styled.div<{ size?: WrapperSize }>`
  position: relative;
  margin: auto;
  max-width: ${p => (p.size === 'sm' ? 992 : 1200)}px;
  padding-left: ${p => p.theme.spacing.lg};
  padding-right: ${p => p.theme.spacing.lg};

  @media ${p => p.theme.breakpoint.mobile} {
    padding-left: ${p => p.theme.spacing.xl};
    padding-right: ${p => p.theme.spacing.xl};
  }
`;

export default Wrapper;
