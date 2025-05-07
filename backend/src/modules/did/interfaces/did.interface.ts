export interface DIDInfo {
  did: string;
  method: string;
  identifier: string;
  recoveryEmail?: string;
  recoveryOptions?: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
}

export interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyHex?: string;
  ethereumAddress?: string;
}

export interface DIDDocument {
  '@context': string | string[];
  id: string;
  controller: string;
  verificationMethod: VerificationMethod[];
  authentication: string[];
  assertionMethod?: string[];
  service?: {
    id: string;
    type: string;
    serviceEndpoint: string;
  }[];
} 