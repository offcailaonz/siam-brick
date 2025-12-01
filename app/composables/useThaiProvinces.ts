import { computed } from 'vue';
import { fetchJson } from '../../services/http';

export type ThaiProvince = {
  id: number;
  name_th: string;
  name_en?: string;
};

const PROVINCE_URL = 'https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json';

export const useThaiProvinces = () => {
  const provinces = useState<ThaiProvince[]>('thai-provinces', () => []);
  const provincesLoading = useState<boolean>('thai-provinces-loading', () => false);
  const provincesError = useState<string | null>('thai-provinces-error', () => null);

  const loadProvinces = async () => {
    if (provinces.value.length > 0 || provincesLoading.value) return;
    provincesLoading.value = true;
    provincesError.value = null;
    try {
      const data = await fetchJson<ThaiProvince[]>(PROVINCE_URL);
      provinces.value = Array.isArray(data) ? data : [];
    } catch (error: any) {
      provincesError.value = error?.message ?? 'ไม่สามารถโหลดข้อมูลจังหวัดได้';
    } finally {
      provincesLoading.value = false;
    }
  };

  const provinceNames = computed(() => provinces.value.map((p) => p.name_th));

  const searchProvinces = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return provinces.value;
    return provinces.value.filter((p) => p.name_th.toLowerCase().includes(q) || (p.name_en || '').toLowerCase().includes(q));
  };

  return {
    provinces,
    provincesLoading,
    provincesError,
    provinceNames,
    searchProvinces,
    loadProvinces
  };
};
