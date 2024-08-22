/**
 * 日期格式化
 * @param dateData
 * @param format
 * @returns
 */
export const formatDate = (dateData: Date | string | number, format = "yyyy-MM-dd HH:mm:ss") => {
  const date = new Date(dateData);
  const dateFormatters = {
    y: (date, format) => {
      const year = date.getFullYear();
      return format.length < 3 ? year % 100 : year;
    },
    M: (date) => date.getMonth() + 1,
    d: (date) => date.getDate(),
    H: (date) => date.getHours(),
    m: (date) => date.getMinutes(),
    s: (date) => date.getSeconds(),
  };
  return format.replace(/([yMdHms])\1*/g, (all, key) => dateFormatters[key](date, all).toString().padStart(all.length, "0"));
};
