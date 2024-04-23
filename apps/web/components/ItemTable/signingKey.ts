import chalk from 'chalk';

const globalWithSigningKey = globalThis as unknown as {
  _signing_key: SigningKeyClient
};

class SigningKeyClient {
  #key?: CryptoKey;

  async getKey() {
    if(this.#key !== undefined) {
      return this.#key;
    }

    // load key from env
    if(process.env.SIGNING_KEY !== undefined) {
      const jwk: JsonWebKey = JSON.parse(Buffer.from(process.env.SIGNING_KEY, 'base64').toString('utf-8'));
      const imported = await crypto.subtle.importKey('jwk', jwk, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);

      console.log('Imported SIGNING_KEY');

      this.#key = imported;
      return imported;
    }

    // generate new key
    const generated = await crypto.subtle.generateKey({ name: 'HMAC', hash: 'SHA-256' }, true, ['sign', 'verify']);
    const exported = await crypto.subtle.exportKey('jwk', generated);

    // output generated key for debugging
    console.log(chalk.bgCyan('*** GENERATED SIGNING KEY: ' + Buffer.from(JSON.stringify(exported)).toString('base64') + ' ***'));
    console.log(chalk.cyan('Set this key as SIGNING_KEY environment variable (.env.local) or signatures will not be valid after restarts.'));

    // store key for later
    this.#key = generated;

    return generated;
  }
}

export const signingKey = globalWithSigningKey._signing_key ?? new SigningKeyClient();

if(process.env.NODE_ENV !== 'production') {
  globalWithSigningKey._signing_key = signingKey;
}
