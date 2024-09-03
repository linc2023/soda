export type Reserved<T> = T & { __brand__?: never };

/**
 *  密码
 * @editor PasswordTypeEditor
 */
export type Password = Reserved<string>;

/**
 *  颜色
 * @editor ColorTypeEditor
 */
export type Color = Reserved<string>;

/**
 * 多行文本
 * @editor TextTypeEditor
 */
export type MultiLineText = string;

/**
 * 图片
 * @editor FileTypeEditor
 */
export type Image = string;

/**
 * 文件
 * @editor FileTypeEditor
 */
export type File = string;

/**
 * 合集
 */
export type Mixin<Types extends any[]> = Types[number];

/**
 * 下拉框
 * @editor SelectTypeEditor
 */
export type OneOf<T extends { label: string; value: string | number | boolean }[]> = T extends { value: infer U }[] ? U : never;

export type A<T> = Reserved<T & string>;
