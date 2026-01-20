import { httpGet } from "./http";

export async function pingHealth(): Promise<string> {

  const res = await httpGet<string>("/health");
  return res || "OK";
}
