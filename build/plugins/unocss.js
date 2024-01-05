import Unocss from 'unocss/vite'
import { presetUno, presetAttributify, presetIcons } from 'unocss'

/**
 * 获取Unocss配置
 * @returns {Array} 获取Unocss配置
 */
export function configUnocss() {
  return Unocss({
    presets: [presetUno(), presetAttributify(), presetIcons()],
  })
}
