import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe("API client", () => {
  it("getProjects retorna array de proyectos", async () => {
    const fakeProjects = [{ slug: "test", title: "Test", description: "desc", stack: [] }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(fakeProjects),
    });

    const { getProjects } = await import("@/lib/api");
    const result = await getProjects();
    expect(result).toEqual(fakeProjects);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/projects"),
      expect.any(Object),
    );
  });

  it("postContact maneja error 422", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 422,
      statusText: "Unprocessable Entity",
    });

    const { postContact } = await import("@/lib/api");
    await expect(
      postContact({ name: "", email: "", message: "" }),
    ).rejects.toThrow("API error: 422");
  });
});
