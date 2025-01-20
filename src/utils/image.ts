export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // 读取文件完成时触发
        reader.onload = () => {
            // reader.result 是 Base64 编码的字符串
            resolve(reader.result as string);
        };

        // 读取文件出错时触发
        reader.onerror = (error) => {
            reject(error);
        };

        // 开始读取文件
        reader.readAsDataURL(file);
    });
}