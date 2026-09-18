import axios, { AxiosRequestConfig, Method } from "axios";

type AxiosMethod = "POST" | "GET";

export async function useAxios(
  url: string,
  method: AxiosMethod,
  data?: unknown,
  cookies?: string[],
) {
  const config: AxiosRequestConfig = {
    url,
    method: method as Method,
    headers: {
      "User-Agent": "github-programmers-rank",
      Accept: "application/json",
      "Cache-Control": "no-cache",
    },
    validateStatus: () => true,
  };

  if (data !== undefined) {
    config.data = data;
  }

  if (cookies?.length) {
    config.headers = {
      ...config.headers,
      Cookie: cookies.join("; "),
    };
  }

  return axios(config);
}
