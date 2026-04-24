import { getDailyThemeByDate } from "../server/data/dailyThemes";

interface ApiResponse {
  status(code: number): { json(payload: unknown): void };
}

export default async function handler(
  _request: unknown,
  response: ApiResponse
): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const theme = await getDailyThemeByDate(today);
  response.status(200).json(theme ?? null);
}
