import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { notifyMe } from '@/lib/actions/notify';
import { ERROR_MESSAGES } from '@/lib/constants/errors';
import { createClient } from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('notifyMe action', () => {
  let mockInsert: ReturnType<typeof vi.fn>;
  let mockFrom: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockInsert = vi.fn().mockResolvedValue({ error: null });
    mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

    vi.mocked(createClient).mockResolvedValue({
      from: mockFrom,
    } as any);

    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('successfully adds email to waitlist', async () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');

    const result = await notifyMe(formData);

    expect(result.success).toBe(true);
    expect(result.message).toContain("You're in");
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'test@example.com',
        full_name: null,
        role: 'interested',
        source: 'coming-soon',
      })
    );
  });

  it('returns error for invalid email', async () => {
    const formData = new FormData();
    formData.append('email', 'invalid-email');

    const result = await notifyMe(formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe(ERROR_MESSAGES.VALID_EMAIL);
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('handles duplicate email error (code 23505)', async () => {
    mockInsert.mockResolvedValue({
      error: { code: '23505' },
    });

    const formData = new FormData();
    formData.append('email', 'duplicate@example.com');

    const result = await notifyMe(formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe('This email is already on the list.');
  });

  it('handles generic database error', async () => {
    mockInsert.mockResolvedValue({
      error: { code: 'other', message: 'DB Error' },
    });

    const formData = new FormData();
    formData.append('email', 'error@example.com');

    const result = await notifyMe(formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe(ERROR_MESSAGES.GENERIC_SHORT);
  });

  it('catches unexpected exceptions', async () => {
    vi.mocked(createClient).mockRejectedValue(new Error('Unexpected error'));

    const formData = new FormData();
    formData.append('email', 'exception@example.com');

    const result = await notifyMe(formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe(ERROR_MESSAGES.GENERIC_SHORT);
  });
});
