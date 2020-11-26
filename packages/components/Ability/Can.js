import { createContextualCan } from '@casl/react';
import { AbilityContext } from './AbilityProvider';

export const Can = createContextualCan(AbilityContext.Consumer);
