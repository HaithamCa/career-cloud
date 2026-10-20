export function newGuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function extractApiErrorMessage(err: unknown): string {
  if (!err || typeof err !== 'object') {
    return 'An unexpected error occurred while communicating with the server.';
  }
  const httpErr = err as { error?: { message?: string; errors?: Array<{ message?: string }> }; message?: string; status?: number };
  if (httpErr.error?.errors && Array.isArray(httpErr.error.errors) && httpErr.error.errors.length > 0) {
    return httpErr.error.errors.map((e) => e.message).filter(Boolean).join(' ');
  }
  if (typeof httpErr.error?.message === 'string' && httpErr.error.message.trim().length > 0) {
    return httpErr.error.message;
  }
  if (httpErr.status === 0) {
    return 'Unable to reach the CareerCloud API server. Verify it is running on port 5115.';
  }
  return httpErr.message || 'Request failed.';
}
