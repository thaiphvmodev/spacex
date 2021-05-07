/* eslint-disable class-methods-use-this */
import axios from 'axios';

interface IQueryParam {
  key: string;
  value: string | number | boolean;
}

const apiRouteGenerator = (
  route: string,
  idParam?: number,
  query?: IQueryParam[],
) => {
  let url = `${process.env.REACT_APP_API_URL}${route}`;
  if (idParam) {
    url = `${url}/${idParam}`;
  }
  if (query && query.length > 0) {
    const searchParams = new URLSearchParams();
    for (const item of query) {
      searchParams.append(item.key, item.value as string);
    }
    return `${url}&${searchParams.toString()}`;
  }
  return url;
};

class HttpClientHelper {
  async get<T>(path: string, idParam?: number, query?: IQueryParam[]) {
    try {
      const endpoint = apiRouteGenerator(path, idParam, query);
      const response = await axios.get<T>(endpoint);
      return response;
    } catch (ex) {
      return {} as T;
    }
  }
}

export const ApiHelper = new HttpClientHelper();
