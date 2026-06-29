import { describe, it, expect, vi } from 'vitest';
import { validateApiKey } from '@/lib/api-auth';

function makeRequest(authHeader?: string): Request {
  return new Request('http://localhost', {
    headers: authHeader ? { Authorization: authHeader } : {},
  });
}

describe('validateApiKey', () => {
  it('returns false when AGENT_API_KEY is not set', () => {
    vi.stubEnv('AGENT_API_KEY', '');
    expect(validateApiKey(makeRequest('Bearer secret'))).toBe(false);
    vi.unstubAllEnvs();
  });

  it('returns false when no Authorization header', () => {
    vi.stubEnv('AGENT_API_KEY', 'secret');
    expect(validateApiKey(makeRequest())).toBe(false);
    vi.unstubAllEnvs();
  });

  it('returns false when token does not match', () => {
    vi.stubEnv('AGENT_API_KEY', 'secret');
    expect(validateApiKey(makeRequest('Bearer wrong'))).toBe(false);
    vi.unstubAllEnvs();
  });

  it('returns true when token matches', () => {
    vi.stubEnv('AGENT_API_KEY', 'secret');
    expect(validateApiKey(makeRequest('Bearer secret'))).toBe(true);
    vi.unstubAllEnvs();
  });

  it('returns false when format is not Bearer', () => {
    vi.stubEnv('AGENT_API_KEY', 'secret');
    expect(validateApiKey(makeRequest('Token secret'))).toBe(false);
    vi.unstubAllEnvs();
  });
});
