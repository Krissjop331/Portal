import axios from "axios";

export class OmadaService {
  constructor(
    private baseUrl: string,
    private username: string,
    private password: string,
  ) {}

  async login(): Promise<string> {
    const r = await axios.post(
      `${this.baseUrl}/login`,
      {
        name: this.username,
        password: this.password,
      },
      { withCredentials: true },
    );
    // В ответе придёт token (CSRF)
    return r.data?.result?.token;
  }

  // POST /api/v2/hotspot/extPortal/auth?token=CSRF
  async authorize(token: string, payload: any) {
    const url = `${this.baseUrl}/api/v2/hotspot/extPortal/auth?token=${token}`;
    return axios.post(url, payload, { withCredentials: true });
  }
}
