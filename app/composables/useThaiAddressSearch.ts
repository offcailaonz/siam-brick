type Province = { id: number; name_th: string; name_en?: string };
type District = { id: number; name_th: string; name_en?: string; province_id: number };
type SubDistrict = { id: number; name_th: string; name_en?: string; zip_code: number | string; district_id: number };

export type ThaiAddressSuggestion = {
  subdistrict: string;
  district: string;
  province: string;
  postcode: string;
};

const BASE_LATEST = 'https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest';
const PROVINCE_LATEST_URL = `${BASE_LATEST}/province.json`;
const DISTRICT_LATEST_URL = `${BASE_LATEST}/district.json`;
const SUB_DISTRICT_LATEST_URL = `${BASE_LATEST}/sub_district.json`;

export const useThaiAddressSearch = () => {
  const provinces = useState<Province[]>('thai-address-provinces', () => []);
  const districts = useState<District[]>('thai-address-districts', () => []);
  const subDistricts = useState<SubDistrict[]>('thai-address-subdistricts', () => []);
  const loading = useState<boolean>('thai-address-loading', () => false);
  const error = useState<string | null>('thai-address-error', () => null);
  const lastLoadedAt = useState<number | null>('thai-address-last-loaded', () => null);

  const loadAddressData = async () => {
    // โหลดเฉพาะฝั่ง client เพื่อหลีกเลี่ยง SSR fetch error
    if (typeof window === 'undefined') return;
    if (loading.value || (provinces.value.length && districts.value.length && subDistricts.value.length)) return;
    loading.value = true;
    error.value = null;
    try {
      const fetchJson = async <T>(url: string): Promise<T> => {
        const res = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'force-cache' });
        if (!res.ok) throw new Error(`โหลดข้อมูลจาก ${url} ไม่สำเร็จ (status ${res.status})`);
        return res.json();
      };

      const [pData, dData, sData] = await Promise.all([
        fetchJson<Province[]>(PROVINCE_LATEST_URL),
        fetchJson<District[]>(DISTRICT_LATEST_URL),
        fetchJson<SubDistrict[]>(SUB_DISTRICT_LATEST_URL)
      ]);
      provinces.value = pData ?? [];
      districts.value = dData ?? [];
      subDistricts.value = sData ?? [];
      lastLoadedAt.value = Date.now();
    } catch (err: any) {
      console.error('Thai address data load failed', err);
      error.value = err?.message ?? 'ไม่สามารถโหลดข้อมูลที่อยู่ได้';
    } finally {
      loading.value = false;
    }
  };

  const searchAddress = (query: string, limit = 15): ThaiAddressSuggestion[] => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    if (!provinces.value.length || !districts.value.length || !subDistricts.value.length) {
      // ถ้ายังไม่โหลด ให้สั่งโหลดแล้วค่อยรอรอบถัดไป
      if (!loading.value) loadAddressData();
      return [];
    }
    const districtMap = new Map<number, District>();
    districts.value.forEach((d) => districtMap.set(d.id, d));
    const provinceMap = new Map<number, Province>();
    provinces.value.forEach((p) => provinceMap.set(p.id, p));

    const results: ThaiAddressSuggestion[] = [];
    for (const sub of subDistricts.value) {
      if (results.length >= limit) break;
      const district = districtMap.get(sub.district_id);
      const province = district ? provinceMap.get(district.province_id) : undefined;
      const combined = [
        sub.name_th || '',
        sub.name_en || '',
        district?.name_th || '',
        district?.name_en || '',
        province?.name_th || '',
        province?.name_en || '',
        sub.zip_code || ''
      ]
        .join(' ')
        .toLowerCase();
      if (combined.includes(q)) {
        results.push({
          subdistrict: sub.name_th,
          district: district?.name_th ?? '',
          province: province?.name_th ?? '',
          postcode: String(sub.zip_code ?? '')
        });
      }
    }
    return results;
  };

  return {
    provinces,
    districts,
    subDistricts,
    loading,
    error,
    loadAddressData,
    searchAddress
  };
};
