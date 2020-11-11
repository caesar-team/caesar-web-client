import { createSrp } from './srp';

async function prepareLoginSRP(email, A, prepareLoginEndpoint) {
  try {
    const {
      data: { publicEphemeralValue, seed },
    } = await prepareLoginEndpoint({
      email,
      publicEphemeralValue: A,
    });

    return { B: publicEphemeralValue, seed };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e.response);
    throw new Error(e);
  }
}

async function loginSRP(email, matcher, loginEndpoint) {
  try {
    const {
      data: { secondMatcher, jwt },
    } = await loginEndpoint({
      email,
      matcher,
    });

    return { serverM2: secondMatcher, jwt };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e.response);
    throw new Error(e);
  }
}

export async function login(
  email,
  password,
  { prepareLoginEndpoint, loginEndpoint },
) {
  const srp = createSrp();

  const a = srp.getRandomSeed();
  const A = srp.generateA(a);

  const { B, seed } = await prepareLoginSRP(email, A, prepareLoginEndpoint);

  const S = srp.generateClientS(A, B, a, srp.generateX(seed, email, password));
  const M1 = srp.generateM1(A, B, S);

  const { serverM2, jwt } = await loginSRP(email, M1, loginEndpoint);

  const clientM2 = srp.generateM2(A, M1, S);

  if (clientM2 !== serverM2) {
    throw new Error('mismatch');
  }

  return jwt;
}
