import { AESUtils } from './modules/aes-utils';
import { RSAUtils } from './modules/rsa-utils';
import { CRYPTO_NAME } from './cfg/crypto-config';

const CryptoUtils = {
	getCryptoSecretKey() {
		return localStorage.getItem(CRYPTO_NAME);
	},
	/**
	 * 设置加密的key
	 *
	 * @returns {Object}
	 * {
	 *  aesKey: 生成的aesKey
	 *  rasKey: 通过rsa加密的aesKey
	 * }
	 */
	setCryptoSecretKey(aesKey) {
		// const aesKey = AESUtils.generateKey()
		localStorage.setItem(CRYPTO_NAME, aesKey);
		const rasKey = RSAUtils.encrypt(aesKey);
		return { aesKey, rasKey };
	},
	/**
	 * 移除缓存的加密密钥
	 */
	removeCryptoSecretKey() {
		localStorage.removeItem(CRYPTO_NAME);
	},
	// 加密数据
	encryptValue(value) {
		return value ? AESUtils.encrypt(value, CryptoUtils.getCryptoSecretKey()) : '';
	},
	// 解密数据
	decryptValue(value) {
		const secretText = value.split(' ')[1];
		if (secretText) {
			return AESUtils.decrypt(secretText, CryptoUtils.getCryptoSecretKey());
		} else {
			return '';
		}
	},
};

export { AESUtils, RSAUtils, CryptoUtils };
