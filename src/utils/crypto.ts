import CryptoJS from 'crypto-js';
import forge from 'node-forge';
export interface CryptoKey {
  key: string;
  iv: string;
  length?: number;
  encryptKey?: string;
}

export interface EncryptData {
  data: string;
  key: string;
  rawData?: Record<string, any>;
}

export interface DecryptData {
  data: string;
  key: string;
}

export interface LoadPrivateKeyFunction {
  (key: string): Promise<string>;
}

export class CryptoData {
  private privateKey: string = '';
  private publicKey: string = '';
  private cryptoKey?: CryptoKey;

  private generatorKey(length = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let list: string[] = [];
    for (let i = 0; i < length; i++) {
      const ch = chars.charAt(Math.floor(Math.random() * chars.length));
      list.push(ch);
    }
    return list.join('');
  }

  private generatorIv() {
    const chars = '0123456789abcdef';
    let list: string[] = [];
    for (let i = 0; i < 16; i++) {
      const ch = chars.charAt(Math.floor(Math.random() * chars.length));
      list.push(ch);
    }
    return list.join('');
  }

  public getKey(): CryptoKey {
    this.cryptoKey = {
      key: this.generatorKey(),
      iv: this.generatorIv(),
      length: 16,
    }
    return this.cryptoKey;
  }

  public setKey(key: CryptoKey): void {
    this.cryptoKey = key;
  }

  public getPublicKey(): string {
    return this.publicKey;
  }

  public getPrivateKey(): string {
    return this.privateKey;
  }

  public setPublicKey(key: string): void {
    this.publicKey = key;
  }

  public setPrivateKey(key: string): void {
    this.privateKey = key;
  }

  public async enryptByPublicKey(input: string): Promise<string> {
    return rsaEncrypt(input, this.getPublicKey());
  }


  public encryptByKey(rawData: any, key?: CryptoKey): string {
    if (!key) {
      key = this.getKey();
    }
    const text = typeof rawData !== 'string' ? JSON.stringify(rawData) : rawData;
    const dataStr = String(text);
    const keyBytes = this.padKey(key.key);
    const ivBytes = CryptoJS.enc.Utf8.parse(key.iv);

    const encrypted = CryptoJS.AES.encrypt(dataStr, keyBytes, {
      iv: ivBytes,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const data = encrypted.toString();
    return data;
  }

  public async encrypt(rawData: any): Promise<EncryptData> {
    const key = this.getKey();
    if (!key.encryptKey) {
      key.encryptKey = await rsaEncrypt(key.iv + ':' + key.key, this.getPublicKey());
    }
    const data = rawData ? this.encryptByKey(rawData, key) : '';
    return {
      data: data,
      key: key.encryptKey,
    }
  }

  private padKey(key: string) {
    const keyStr = String(key);
    if (keyStr.length === 16) {
      return CryptoJS.enc.Utf8.parse(keyStr);
    }
    if (keyStr.length < 16) {
      return CryptoJS.enc.Utf8.parse(keyStr.padEnd(16, '0'));
    }
    return CryptoJS.enc.Utf8.parse(keyStr.substring(0, 16));
  }

  public decryptByKey(data: string, key?: CryptoKey): string {
    if (!key) {
      key = this.getKey();
    }
    const keyBytes = this.padKey(key.key);
    const ivBytes = CryptoJS.enc.Utf8.parse(key.iv);
    const decrypted = CryptoJS.AES.decrypt(data, keyBytes, {
      iv: ivBytes,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const str = decrypted.toString(CryptoJS.enc.Utf8);
    return str;
  }
}

export const CRYPTO = new CryptoData();

function toPemPublicKey(rawKey: string): string {
  return `-----BEGIN PUBLIC KEY-----
${rawKey}
-----END PUBLIC KEY-----`
}

async function rsaEncrypt(str: string, key: string) {
  const publicKey = forge.pki.publicKeyFromPem(toPemPublicKey(key));
  const encrypted = publicKey.encrypt(
    forge.util.encodeUtf8(str),
    'RSA-OAEP',
    {
      md: forge.md.sha256.create(),
      mgf1: { md: forge.md.sha256.create() }
    }
  );
  return forge.util.encode64(encrypted);
}