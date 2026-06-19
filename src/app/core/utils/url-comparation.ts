export function areUrlsEqual(urlA: string, urlB: string): boolean {
  try {
    const normalize = (urlString: string): string => {
      const url = new URL(urlString);

      // Ordenar los parámetros de búsqueda alfabéticamente
      url.searchParams.sort();

      // Remover la barra diagonal del final del path si existe
      let pathname = url.pathname;
      if (pathname.endsWith('/') && pathname.length > 1) {
        pathname = pathname.slice(0, -1);
      }

      // Retornar la URL reconstruida y limpia (en minúsculas el host)
      return `${url.protocol}//${url.host}${pathname}${url.search}`.toLowerCase();
    };

    return normalize(urlA) === normalize(urlB);
  } catch (error) {
    // Si alguna URL está mal formada, fallamos de forma segura comparando strings crudos
    return urlA.trim() === urlB.trim();
  }
}
