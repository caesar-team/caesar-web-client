import styled from 'styled-components';
import { Avatar } from '../Avatar';
import { Hint } from '../Hint';
import { Icon } from '../Icon';
import { Wrapper } from '../Avatar/styles';

const StyledIcon = styled(Icon)`
  width: 100%;
  height: 100%;
`;

export const TeamAvatar = props => {
  const {
    size = 40,
    fontSize = 'main',
    hint = '',
    hintPosition = 'center',
  } = props;
  const renderInner = () => {
    const accessGranted = 'accessGranted' in props ? props.accessGranted : true;

    if (!accessGranted) {
      return (
        <Hint text={hint} position={hintPosition}>
          <Wrapper size={size} fontSize={fontSize} {...props}>
            <StyledIcon name="warning" width={40} height={40} color="black" />
          </Wrapper>
        </Hint>
      );
    }

    return <Avatar {...props} />;
  };

  return renderInner();
};
