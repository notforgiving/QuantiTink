type CacheOptions = {
    ttl?: number; // время жизни кэша в миллисекундах
};

export async function fetchWithCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = { ttl: 10 * 60 * 1000 } // 10 минут по умолчанию
): Promise<T> {
    const cached = localStorage.getItem(key);
    const ttl = options.ttl ?? 0;

    if (cached) {
        try {
            const { timestamp, data } = JSON.parse(cached);
            const isExpired = Date.now() - timestamp > ttl;

            if (!isExpired) {
                return data as T;
            }
        } catch {
            // если в localStorage мусор — просто игнорим
        }
    }

    // делаем запрос
    const data = await fetcher();

    // сохраняем в localStorage
    localStorage.setItem(
        key,
        JSON.stringify({
            timestamp: Date.now(),
            data,
        })
    );
    console.log('Данные из api', key);
    return data;
}