import { postLogin, postLoginPrepare, postRegistration } from 'common/api';
import { createSrp } from './srp';

async function loginFirstPhase(email, A, prepareLoginEndpoint) {
  try {
    const {
      data: { publicEphemeralValue, seed },
    } = await prepareLoginEndpoint({
      email,
      publicEphemeralValue: A,
    });

    return { B: publicEphemeralValue, seed };
  } catch (e) {
    console.log(e.response);
    throw new Error(e);
  }
}

async function loginSecondPhase(email, matcher, loginEndpoint) {
  try {
    const {
      data: { secondMatcher, jwt },
    } = await loginEndpoint({
      email,
      matcher,
    });

    return { serverM2: secondMatcher, jwt };
  } catch (e) {
    console.log(e.response);
    throw new Error(e);
  }
}

export async function login(
  email,
  password,
  { prepareLoginEndpoint = postLoginPrepare, loginEndpoint = postLogin } = {},
) {
  const srp = createSrp();

  const a = srp.getRandomSeed();
  const A = srp.generateA(a);

  const { B, seed } = await loginFirstPhase(email, A, prepareLoginEndpoint);

  const S = srp.generateClientS(A, B, a, srp.generateX(seed, email, password));
  const M1 = srp.generateM1(A, B, S);

  const { serverM2, jwt } = await loginSecondPhase(email, M1, loginEndpoint);

  const clientM2 = srp.generateM2(A, M1, S);

  if (clientM2 !== serverM2) {
    throw new Error('mismatch');
  }

  return jwt;
}

export async function registration(
  email,
  password,
  { registrationEndpoint = postRegistration } = {},
) {
  const srp = createSrp();

  const seed = srp.getRandomSeed();
  const verifier = srp.generateV(srp.generateX(seed, email, password));

  return await registrationEndpoint({ email, seed, verifier });
}
