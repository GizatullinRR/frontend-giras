export function apiErrorMessage(err: unknown, fallback: string): string {
  if (typeof err !== 'object' || err === null || !('error' in err)) {
    return fallback;
  }

  const payload = (err as { error?: { message?: unknown } }).error;
  const message = payload?.message;

  if (typeof message === 'string') {
    return message;
  }

  if (Array.isArray(message)) {
    return message.filter((item) => typeof item === 'string').join(', ');
  }

  return fallback;
}
