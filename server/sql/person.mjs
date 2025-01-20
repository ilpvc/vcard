import { getCode } from '../utils.mjs'; // 修改为 .mjs 扩展名

const addPerson = () => {
  // SQL 插入语句，使用参数占位符
  const query = `
      INSERT INTO v_person (
        header,
        first_name,
        last_name,
        email,
        mobile,
        telephone,
        company,
        job,
        address,
        website,
        summary,
        social_media,
        code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
  // 返回 SQL
  return query;
};

const getParam = (person) => {
  console.log(person)
  const randomNumber = Math.floor(Math.random() * 1000);
  const code = getCode(person.first_name, person.email, randomNumber); // 使用导入的 getCode 函数
  // 构建与 SQL 参数顺序对应的数组
  const params = [
    person.header || null,         // header: 二进制数据（BLOB），默认为 null
    person.first_name || '',       // first_name: 必填字段，默认为空字符串
    person.last_name || '',        // last_name
    person.email || '',            // email
    person.mobile || '',           // mobile
    person.telephone || '',        // telephone
    person.company || '',          // company
    person.job || '',              // job
    person.address || '',          // address
    person.website || '',          // website
    person.summary || '',          // summary
    person.social_media || '',     // social_media: JSON 字符串或空字符串
    code || ''              // code
  ];

  // 返回参数数组
  return { params, code };
};

export { addPerson, getParam };
