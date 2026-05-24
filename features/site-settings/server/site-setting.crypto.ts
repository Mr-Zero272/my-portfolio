import { ApiErrorCode, throwApiError } from '@/lib/api';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

const VERSION = 'v1';
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

function getEncryptionKey() {
  const secret = process.env.SITE_SETTING_ENCRYPTION_KEY;

  if (!secret) {
    throwApiError(ApiErrorCode.CONFIGURATION_ERROR, {
      details: 'SITE_SETTING_ENCRYPTION_KEY is required to encrypt site setting secrets.',
    });
  }

  return createHash('sha256').update(secret).digest();
}

export function encryptSecret(plainText: string) {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [
    VERSION,
    iv.toString('base64'),
    authTag.toString('base64'),
    ciphertext.toString('base64'),
  ].join(':');
}

export function decryptSecret(cipherText: string) {
  const [version, iv, authTag, encrypted] = cipherText.split(':');

  if (version !== VERSION || !iv || !authTag || !encrypted) {
    throwApiError(ApiErrorCode.BAD_REQUEST, {
      message: 'Unsupported encrypted secret format.',
    });
  }

  const decipher = createDecipheriv(ALGORITHM, getEncryptionKey(), Buffer.from(iv, 'base64'));
  decipher.setAuthTag(Buffer.from(authTag, 'base64'));

  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}

export function maskSecret(value?: string | null) {
  if (!value) return null;

  if (value.startsWith(`${VERSION}:`)) {
    return '********';
  }

  if (value.length <= 8) {
    return '********';
  }

  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}
