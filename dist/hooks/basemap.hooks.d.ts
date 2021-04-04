import Basemap from '../plugins/basemap/basemap';
import { Ref } from 'vue';
/** 底图控制Key值钩子 */
export declare function useKey(basemap: Basemap): Ref<string>;
/** 底图控制可见性钩子 */
export declare function useVisible(basemap: Basemap): Ref<boolean>;
/** 底图控制钩子 */
declare function useBasemap(basemap: Basemap): [Ref<string>, Ref<boolean>, string[]];
export default useBasemap;
