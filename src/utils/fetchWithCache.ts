type CacheOptions = {
    ttl?: number; // время жизни кэша в миллисекундах
};

export async function fetchWithCache<T>(
    key: string | null, // если null — не сохраняем
    fetcher: () => Promise<T>,
    options: CacheOptions = { ttl: 10 * 60 * 1000 } // 10 минут
): Promise<T> {
    if (key) {
        const cached = localStorage.getItem(key);
        const ttl = options.ttl ?? 0;

        if (cached) {
            try {
                const { timestamp, data } = JSON.parse(cached);
                const isExpired = Date.now() - timestamp > ttl;

                if (!isExpired) return data as T;
            } catch { }
        }
    }

    const data = await fetcher();

    if (key) {
        setTimeout(() => {
            try {
                localStorage.setItem(
                    key,
                    JSON.stringify({ timestamp: Date.now(), data })
                );
            } catch { }
        }, 0);
    }

    return data;
}