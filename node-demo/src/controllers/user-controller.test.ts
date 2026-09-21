import type { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { userController } from './user-controller.js';

function mockResponse(): Response {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

function mockRequest(params: Record<string, string> = {}, body: unknown = {}): Request {
  return { params, body } as unknown as Request;
}

function createdIdFrom(res: Response): string {
  const calls = (res.json as ReturnType<typeof vi.fn>).mock.calls;
  const [firstCall] = calls;
  return (firstCall?.[0] as { id: string }).id;
}

describe('userController.update', () => {
  let createdId: string;

  beforeEach(async () => {
    const req = mockRequest({}, { email: 'a@b.com', displayName: 'Ada' });
    const res = mockResponse();

    await userController.create(req, res);

    createdId = createdIdFrom(res);
  });

  it('updates an existing profile and returns 200', async () => {
    const req = mockRequest({ id: createdId }, { email: 'new@b.com', displayName: 'Ada Lovelace' });
    const res = mockResponse();

    await userController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: createdId,
        email: 'new@b.com',
        displayName: 'Ada Lovelace',
      }),
    );
  });

  it('returns 404 when the profile does not exist', async () => {
    const req = mockRequest(
      { id: '00000000-0000-0000-0000-000000000000' },
      { email: 'x@y.com', displayName: 'Ghost' },
    );
    const res = mockResponse();

    await userController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: 'USER_NOT_FOUND', message: 'No user with that id' },
    });
  });

  it('throws a ZodError when the id param is not a UUID', async () => {
    const req = mockRequest({ id: 'not-a-uuid' }, { email: 'x@y.com', displayName: 'X' });
    const res = mockResponse();

    await expect(userController.update(req, res)).rejects.toThrow();
  });

  it('throws a ZodError when the body fails validation', async () => {
    const req = mockRequest({ id: createdId }, { email: 'not-an-email', displayName: '' });
    const res = mockResponse();

    await expect(userController.update(req, res)).rejects.toThrow();
  });
});

describe('userController.remove', () => {
  let createdId: string;

  beforeEach(async () => {
    const req = mockRequest({}, { email: 'a@b.com', displayName: 'Ada' });
    const res = mockResponse();

    await userController.create(req, res);

    createdId = createdIdFrom(res);
  });

  it('deletes an existing profile and returns 204', async () => {
    const req = mockRequest({ id: createdId });
    const res = mockResponse();
    res.send = vi.fn().mockReturnValue(res);

    await userController.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledWith();
  });

  it('returns 404 when the profile does not exist', async () => {
    const req = mockRequest({ id: '00000000-0000-0000-0000-000000000000' });
    const res = mockResponse();

    await userController.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: 'USER_NOT_FOUND', message: 'No user with that id' },
    });
  });

  it('throws a ZodError when the id param is not a UUID', async () => {
    const req = mockRequest({ id: 'not-a-uuid' });
    const res = mockResponse();

    await expect(userController.remove(req, res)).rejects.toThrow();
  });
});
