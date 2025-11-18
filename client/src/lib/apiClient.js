// lib/apiClient.js
const rawEnvBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "";
export const baseURL = rawEnvBaseUrl.replace(/\/$/, "");

const missingEnvMessage =
  "SummaryApi: NEXT_PUBLIC_API_URL is not defined. Falling back to relative URLs — set this before deploying.";

if (!baseURL) {
  if (typeof window === "undefined") {
    console.warn(missingEnvMessage);
  } else {
    console.error(missingEnvMessage);
  }
}

function normalizePath(path = "") {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function buildUrl(path, params) {
  let url = baseURL ? `${baseURL}${normalizePath(path)}` : normalizePath(path);
  if (params && Object.keys(params).length) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, item));
      } else {
        searchParams.append(key, value);
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += url.includes("?") ? `&${queryString}` : `?${queryString}`;
    }
  }
  return url;
}

export async function apiFetch(
  path,
  {
    method = "GET",
    body,
    headers = {},
    params,
    cache = "no-store",
    credentials = "include",
    signal,
    timeout = 20000
  } = {}
) {
  const controller = signal ? null : new AbortController();
  const requestSignal = signal ?? controller.signal;

  const init = {
    method,
    headers: {
      Accept: "application/json",
      ...headers
    },
    cache,
    credentials,
    signal: requestSignal
  };

  const upperMethod = method.toUpperCase();

  if (body !== undefined) {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    if (isFormData) {
      init.body = body;
      delete init.headers["Content-Type"];
    } else if (!["GET", "HEAD"].includes(upperMethod)) {
      init.headers["Content-Type"] = init.headers["Content-Type"] ?? "application/json";
      init.body = typeof body === "string" ? body : JSON.stringify(body);
    }
  }

  const requestUrl = buildUrl(path, params);

  let timeoutId;
  if (!signal && timeout > 0) {
    timeoutId = setTimeout(() => {
      controller?.abort(`Request timeout after ${timeout}ms`);
    }, timeout);
  }

  try {
    const response = await fetch(requestUrl, init);
    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok) {
      let errorPayload = null;
      if (contentType.includes("application/json")) {
        errorPayload = await response.json().catch(() => null);
      } else {
        errorPayload = await response.text().catch(() => null);
      }

      const errorMessage =
        errorPayload?.message ||
        errorPayload?.error ||
        (typeof errorPayload === "string" ? errorPayload : null) ||
        `${response.status} ${response.statusText}`;

      const error = new Error(errorMessage);
      error.status = response.status;
      error.payload = errorPayload;
      throw error;
    }

    if (response.status === 204) return null;
    if (contentType.includes("application/json")) {
      return await response.json();
    }

    return await response.text();
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export async function callSummaryApi(
  endpoint,
  { payload, params, headers, cache = "no-store", credentials = "include", signal, timeout } = {}
) {
  if (!endpoint?.url) {
    throw new Error("callSummaryApi: endpoint definition must include a url.");
  }

  const method = endpoint.method?.toUpperCase?.() ?? "GET";
  const isBodyMethod = !["GET", "HEAD"].includes(method);
  const finalBody = isBodyMethod ? payload : undefined;
  const finalParams =
    !isBodyMethod && payload && typeof payload === "object"
      ? { ...(params || {}), ...payload }
      : params;

  return apiFetch(endpoint.url, {
    method,
    body: finalBody,
    params: finalParams,
    headers,
    cache,
    credentials,
    signal,
    timeout
  });
}