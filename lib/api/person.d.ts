import type { Person } from '@/type/person';
export declare function getPersonByCode(code: string): Promise<import("axios").AxiosResponse<any, any>>;
export declare function addPerson(person: Omit<Person, 'id'>): Promise<import("axios").AxiosResponse<any, any>>;
