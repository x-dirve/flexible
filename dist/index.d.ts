interface Flexible {
    rem: number;
    dpr: number;
    refreshRem(): void;
    rem2px(d: any): number | string;
    px2rem(d: any): number | string;
}
/**提供给外部的调用对象 */
declare const flexible: Partial<Flexible>;
export { flexible };
/**
 * 初始化
 * @param s 项目标识，用于防止同域下的项目互相覆盖
 * @param raw 是否将标识直接用于生成模块特征
 */
export default function init(s?: string, raw?: boolean): void;
