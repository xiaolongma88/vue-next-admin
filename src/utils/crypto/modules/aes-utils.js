import CryptoJS from 'crypto-js';

/**
 * AES 对称加密工具类
 *
 * @author LiSong
 * @date 2022-11-03 10:24
 */
export const AESUtils = {
	// 缓存的iv
	aes_pub_iv: 'Qwe145Fjkf9fnBfT',
	// 缓存密钥
	aes_pub_key: '',
	// CBC模式
	aes_cbc_config: {
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7,
	},
	// CTR模式
	aes_ctr_config: {
		mode: CryptoJS.mode.CTR,
		padding: CryptoJS.pad.NoPadding,
	},
	/**
	 * 生成密钥
	 *
	 * @returns String 生成的密钥
	 */
	generateKey: () => {
		const key = CryptoJS.lib.WordArray.random(64 / 8).toString();
		AESUtils.aes_pub_key = key;
		return key;
	},
	/**
	 * 加密方法
	 *
	 * @param {String|Object} value 需加密数据
	 * @param {String} key 加密密钥
	 * @param {String} iv 加密偏移量
	 * @returns {String} 加密后的结果
	 */
	encrypt: (value, key, iv) => {
		iv = iv || AESUtils.aes_pub_iv;
		key = key || AESUtils.aes_pub_key;
		if (typeof value === 'object' || value instanceof Object) {
			value = JSON.stringify(value);
		}
		const encIv = CryptoJS.enc.Utf8.parse(iv);
		const encKey = CryptoJS.enc.Utf8.parse(key);
		const encValue = CryptoJS.enc.Utf8.parse(value);
		const encConfig = { iv: encIv, ...AESUtils.aes_cbc_config };
		return CryptoJS.AES.encrypt(encValue, encKey, encConfig).toString();
	},
	/**
	 * 解密方法
	 *
	 * @param {String|Object} value 需解密数据
	 * @param {String} key 解密密钥
	 * @param {String} iv 解密偏移量
	 * @returns {String} 解密后的结果
	 */
	decrypt: (value, key, iv) => {
		iv = iv || AESUtils.aes_pub_iv;
		key = key || AESUtils.aes_pub_key;
		const decIv = CryptoJS.enc.Utf8.parse(iv);
		const decKey = CryptoJS.enc.Utf8.parse(key);
		const decConfig = { iv: decIv, ...AESUtils.aes_cbc_config };
		const decrypted = CryptoJS.AES.decrypt(value, decKey, decConfig);
		let decResult = CryptoJS.enc.Utf8.stringify(decrypted).toString();
		// 判断是否是数组或对象
		if (decResult.charAt(0) === '{' || decResult.charAt(0) === '[') {
			decResult = JSON.parse(decResult);
		}
		return decResult && decResult != 'null' && decResult != null ? decResult : '';
	},
};
