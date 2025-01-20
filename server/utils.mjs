import crypto from 'crypto';

const getCode = (first_name, email, randomNumber) => {
    const hash = crypto.createHash('sha256');
    hash.update(first_name + email + randomNumber);
    const hashHex = hash.digest('hex');
    
    // 获取哈希值的前 8 位作为短链标识符
    const shortLink = hashHex.substring(0, 8);
    
    return shortLink;
};

export { getCode };
