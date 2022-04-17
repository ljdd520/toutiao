/**
 * 初始化 dayjs 相关配置
 */

import dayjs from 'dayjs'
// 配置使用中文语言包
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'

// 将处理相对时间的代码包装为全局过滤器
// 之后就可以在任何组件中使用
// 使用方式 {{ xxx| relativeTime }}
// 配置使用处理相对时间
dayjs.extend(relativeTime)

dayjs.locale('zh-cn')

export default dayjs
