// Lightweight HTTP helper that uses native fetch on server (avoids axios/node FormData issues)
// and axios on client (for consistent behavior/interceptors if needed).

let axiosInstance: any | null = null;

const getAxios = async () => {
  if (axiosInstance) return axiosInstance;
  const mod = await import('axios').then((m) => m.default || m);
  axiosInstance = mod.create({
    timeout: 10000,
    headers: {
      Accept: 'application/json'
    }
  });
  return axiosInstance;
};

export const fetchJson = async <T>(url: string): Promise<T> => {
  // Use native fetch on server to avoid bundling axios/node form-data in SSR
  if (typeof window === 'undefined') {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`Request failed (${res.status}) for ${url}`);
    return res.json() as Promise<T>;
  }
  const http = await getAxios();
  const { data } = await http.get<T>(url, { responseType: 'json' });
  return data;
};
