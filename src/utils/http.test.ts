import { describe, expect, it } from "vitest";
import { performRequest, TopGGAPIError } from "@utils/http";

describe("performRequest", () => {
  it("exposes the v1 error code on TopGGAPIError", async () => {
    const fetchImpl = async () =>
      new Response(
        JSON.stringify({
          type: "https://tools.ietf.org/html/rfc9110#section-15.5.5",
          title: "Not Found",
          status: 404,
          detail: "Project not found.",
          code: "PROJECT_NOT_FOUND",
        }),
        { status: 404, headers: { "Content-Type": "application/problem+json" } }
      );

    const err = await performRequest({
      baseUrl: "https://top.gg/api/v1",
      path: "/projects/1",
      method: "GET",
      headers: {},
      fetchImpl,
    }).catch((e: unknown) => e);

    expect(err).toBeInstanceOf(TopGGAPIError);
    expect((err as TopGGAPIError).code).toBe("PROJECT_NOT_FOUND");
    expect((err as TopGGAPIError).status).toBe(404);
  });
});
