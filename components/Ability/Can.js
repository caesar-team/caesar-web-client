import { createContextualCan } from '@casl/react';
import { AbilityConsumer } from './AbilityProvider';

const Can = createContextualCan(AbilityConsumer);

export default Can;
