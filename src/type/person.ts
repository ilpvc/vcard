export type Person = {
    header: string,
    address: string;
    b_address: string;
    code: string;
    company: string;
    created_at: string; // 或 Date 类型，取决于实际需求
    email: string;
    employ_number;
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
        name: string;       // 社交平台名称
        status: boolean;    // 状态（是否启用）
        value: string;      // 值（例如链接或账号）
    },
    line: {
        name: string;       // 社交平台名称
        status: boolean;    // 状态（是否启用）
        value: string;      // 值（例如链接或账号）
    },
    whatsapp: {
        name: string;       // 社交平台名称
        status: boolean;    // 状态（是否启用）
        value: string;      // 值（例如链接或账号）
    }
}
