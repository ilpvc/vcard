export type Person = {
    header: string;
    address: string;
    code: string;
    company: string;
    created_at: string;
    email: string;
    first_name: string;
    id: number;
    job: string;
    last_name: string;
    mobile: string;
    social_media: string;
    summary: string;
    telephone: string;
    website: string;
};
export type Social = {
    weixin: {
        name: string;
        status: boolean;
        value: string;
    };
    line: {
        name: string;
        status: boolean;
        value: string;
    };
    whatsapp: {
        name: string;
        status: boolean;
        value: string;
    };
};
