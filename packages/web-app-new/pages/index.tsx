import { styled } from 'linaria/react';
import { Button } from '@caesar/components';

const Wrapper = styled.div`
  color: white;
  background: black;
`;

const Home = () => {
  return (
    <Wrapper>
      <Button>wfwe</Button>
      <span> web-app-new</span>
    </Wrapper>
  );
};

export default Home;
