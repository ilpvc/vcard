import axios from '../utils/request'
import type {Person} from '@/type/person'

export async function getPersonByCode(code: string) {
    // return await axios.get(`/person?code=${code}`)
    return await axios.get(`/person/${code}`)
}

export async function addPerson(person:Omit<Person, 'id'>) {
    return await axios.post(`/person/add`, person)
}