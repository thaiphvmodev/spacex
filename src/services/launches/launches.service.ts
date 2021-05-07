
import { AxiosResponse } from 'axios';

import { ApiHelper } from '../../utils/http';

class LaunchesServiceRoute {
  static readonly LAUNCHES = '/launches';
}
export interface IQueryParam {
  key: string;
  value: string | number| boolean;
}

export const getLaunches = async (limit?:number, offset?:number, query?: IQueryParam[]) => ApiHelper.get<AxiosResponse>(`${LaunchesServiceRoute.LAUNCHES}?limit=${limit}&offset=${offset}`, undefined,query);
