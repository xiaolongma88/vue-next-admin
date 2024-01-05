import Encrypt from 'encryptlong';

/**
 * RSA 非对称加密工具类
 *
 * @author LiSong
 * @date 2022-11-03 10:24
 */
export const RSAUtils = {
	// 公密钥
	// ras_pub_key: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCYli9WTDvdiny1LRb2BkVg4DptrsyI9qv2J0BtmiIIXwXB85qbdFDcWDzmS6Za9sS5oZCv1Qx5xEGdAO8iwD9rF3+DNIlvlgi47d3jRfjubkOPmRhsQdyP/Uy+pqrChAe6G7G5ht838izpzbZsvSlhr4rtyMVaiXiZMtEzPa/pFwIDAQAB',
	ras_pub_key:
		'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCYli9WTDvdiny1LRb2BkVg4DptrsyI9qv2J0BtmiIIXwXB85qbdFDcWDzmS6Za9sS5oZCv1Qx5xEGdAO8iwD9rF3+DNIlvlgi47d3jRfjubkOPmRhsQdyP/Uy+pqrChAe6G7G5ht838izpzbZsvSlhr4rtyMVaiXiZMtEzPa/pFwIDAQAB',
	/**
	 * 加密方法
	 * @param {String} content 需加密的内容
	 * @param {String} pubKey 加密密钥
	 * @returns {String} 加密后的结果
	 */
	encrypt: (content, pubKey) => {
		pubKey = pubKey || RSAUtils.ras_pub_key;
		let encryptor = new Encrypt();
		encryptor.setPublicKey(pubKey);
		// 如果是对象/数组的话，需要先JSON.stringify转换成字符串
		// const cipherText = encodeURIComponent(jsencrypt.encryptLong(content));
		const result = encryptor.encryptLong(content);
		return result;
	},
};
