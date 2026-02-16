import { jest, describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { api, ApiError } from "~/services/api-client";

beforeEach(() => {
  globalThis.fetch = jest.fn() as jest.Mock<typeof fetch>;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("api.get", () => {
  it("makes a GET request and returns JSON", async () => {
    const mockData = { id: 1, name: "test" };
    (globalThis.fetch as jest.Mock<typeof fetch>).mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: () => Promise.resolve(mockData),
    } as Response);

    const result = await api.get("/test");
    expect(result).toEqual(mockData);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/test",
      expect.objectContaining({
        headers: expect.objectContaining({ "Content-Type": "application/json" }),
      }),
    );
  });

  it("throws ApiError on non-OK response", async () => {
    (globalThis.fetch as jest.Mock<typeof fetch>).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      headers: new Headers(),
      text: () => Promise.resolve("Not Found"),
    } as Response);

    await expect(api.get("/notfound")).rejects.toThrow(ApiError);
    await expect(api.get("/notfound")).rejects.toThrow("Not Found");
  });
});

describe("api.post", () => {
  it("makes a POST request with JSON body", async () => {
    const mockData = { success: true };
    (globalThis.fetch as jest.Mock<typeof fetch>).mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: () => Promise.resolve(mockData),
    } as Response);

    const result = await api.post("/test", { key: "value" });

    expect(result).toEqual(mockData);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/test",
      expect.objectContaining({
        method: "POST",
        body: '{"key":"value"}',
      }),
    );
  });
});

describe("api.delete", () => {
  it("makes a DELETE request", async () => {
    (globalThis.fetch as jest.Mock<typeof fetch>).mockResolvedValue({
      ok: true,
      status: 204,
      headers: new Headers({ "content-length": "0" }),
      json: () => Promise.resolve(undefined),
    } as Response);

    await api.delete("/test/1");

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/test/1",
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});
