import Collection, { Options as ICollectionOptions } from 'ol/Collection';
/**
 * 创建集合
 * @param arr 数组
 * @param options 配置项
 * @returns 集合
 */
export declare function createCollection<T>(arr: T[], options?: ICollectionOptions): Collection<T>;
