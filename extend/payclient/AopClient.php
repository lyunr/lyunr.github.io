<?php
// alipay类

declare(strict_types=1);

namespace payclient;
/**
 * 加密方法
 * @param string $str
 * @return string
 */
function encrypt($str, $screct_key)
{
    //AES, 128 模式加密数据 CBC
    $screct_key = base64_decode($screct_key);
    $str = trim($str);
    $str = addPKCS7Padding($str);

    //设置全0的IV

    $iv = str_repeat("\0", 16);
    $encrypt_str = openssl_encrypt($str, 'aes-128-cbc', $screct_key, OPENSSL_NO_PADDING, $iv);
    return base64_encode($encrypt_str);
}

/**
 * 解密方法
 * @param string $str
 * @return string
 */
function decrypt($str, $screct_key)
{
    //AES, 128 模式加密数据 CBC
    $str = base64_decode($str);
    $screct_key = base64_decode($screct_key);

    //设置全0的IV
    $iv = str_repeat("\0", 16);
    $decrypt_str = openssl_decrypt($str, 'aes-128-cbc', $screct_key, OPENSSL_NO_PADDING, $iv);
    $decrypt_str = stripPKSC7Padding($decrypt_str);
    return $decrypt_str;
}

/**
 * 填充算法
 * @param string $source
 * @return string
 */
function addPKCS7Padding($source)
{
    $source = trim($source);
    $block = 16;

    $pad = $block - (strlen($source) % $block);
    if ($pad <= $block) {
        $char = chr($pad);
        $source .= str_repeat($char, $pad);
    }
    return $source;
}

/**
 * 移去填充算法
 * @param string $source
 * @return string
 */
function stripPKSC7Padding($source)
{
    $char = substr($source, -1);
    $num = ord($char);
    if ($num == 62) return $source;
    $source = substr($source, 0, -$num);
    return $source;
}

class EncryptParseItem
{
    public $startIndex;

    public $endIndex;

    public $encryptContent;
}

class EncryptResponseData
{
    public $realContent;

    public $returnContent;
}

class SignData
{
    public $signSourceData = null;

    public $sign = null;
}

class AlipayConfig
{
    /**
     * 网关地址
     * 线上：https://openapi.alipay.com/gateway.do
     * 沙箱：https://openapi.alipaydev.com/gateway.do
     */
    private $serverUrl;

    /**
     * 开放平台上创建的应用的ID
     */
    private $appId;

    /**
     * 报文格式，推荐：json
     */
    private $format = "json";

    /**
     * 字符串编码，推荐：utf-8
     */
    private $charset = "utf-8";

    /**
     * 签名算法类型，推荐：RSA2
     */
    private $signType = "RSA2";

    /**
     * 商户私钥
     */
    private $privateKey;

    /**
     * 支付宝公钥字符串（公钥模式下设置，证书模式下无需设置）
     */
    private $alipayPublicKey;

    /**
     * 商户应用公钥证书路径（证书模式下设置，公钥模式下无需设置）
     */
    private $appCertPath;

    /**
     * 支付宝公钥证书路径（证书模式下设置，公钥模式下无需设置）
     */
    private $alipayPublicCertPath;

    /**
     * 支付宝根证书路径（证书模式下设置，公钥模式下无需设置）
     */
    private $rootCertPath;

    /**
     * 指定商户公钥应用证书内容字符串，该字段与appCertPath只需指定一个，优先以该字段的值为准（证书模式下设置，公钥模式下无需设置）
     */
    private $appCertContent;

    /**
     * 指定支付宝公钥证书内容字符串，该字段与alipayPublicCertPath只需指定一个，优先以该字段的值为准（证书模式下设置，公钥模式下无需设置）
     */
    private $alipayPublicCertContent;

    /**
     * 指定根证书内容字符串，该字段与rootCertPath只需指定一个，优先以该字段的值为准（证书模式下设置，公钥模式下无需设置）
     */
    private $rootCertContent;

    /**
     * 敏感信息对称加密算法类型，推荐：AES
     */
    private $encryptType = "AES";

    /**
     * 敏感信息对称加密算法密钥
     */
    private $encryptKey;

    /**
     * 跳过加验签（小程序云免鉴权）
     */
    private $skipSign = false;


    public function getServerUrl()
    {
        return $this->serverUrl;
    }

    public function setServerUrl($serverUrl)
    {
        $this->serverUrl = $serverUrl;
    }
    public function getAppId()
    {
        return $this->appId;
    }
    public function setAppId($appId)
    {
        $this->appId = $appId;
    }
    public function getFormat()
    {
        return $this->format;
    }
    public function setFormat($format)
    {
        $this->format = $format;
    }
    public function getCharset()
    {
        return $this->charset;
    }

    public function setCharset($charset)
    {
        $this->charset = $charset;
    }

    public function getSignType()
    {
        return $this->signType;
    }

    public function setSignType($signType)
    {
        $this->signType = $signType;
    }
    public function getEncryptKey()
    {
        return $this->encryptKey;
    }

    public function setEncryptKey($encryptKey)
    {
        $this->encryptKey = $encryptKey;
    }
    public function getEncryptType()
    {
        return $this->encryptType;
    }
    public function setEncryptType($encryptType)
    {
        $this->encryptType = $encryptType;
    }
    public function getPrivateKey()
    {
        return $this->privateKey;
    }

    public function setPrivateKey($privateKey)
    {
        $this->privateKey = $privateKey;
    }
    public function getAlipayPublicKey()
    {
        return $this->alipayPublicKey;
    }
    public function setAlipayPublicKey($alipayPublicKey)
    {
        $this->alipayPublicKey = $alipayPublicKey;
    }
    public function getAppCertPath()
    {
        return $this->appCertPath;
    }

    public function setAppCertPath($appCertPath)
    {
        $this->appCertPath = $appCertPath;
    }

    public function getAlipayPublicCertPath()
    {
        return $this->alipayPublicCertPath;
    }
    public function setAlipayPublicCertPath($alipayPublicCertPath)
    {
        $this->alipayPublicCertPath = $alipayPublicCertPath;
    }

    public function getRootCertPath()
    {
        return $this->rootCertPath;
    }
    public function setRootCertPath($rootCertPath)
    {
        $this->rootCertPath = $rootCertPath;
    }
    public function getAppCertContent()
    {
        return $this->appCertContent;
    }
    public function setAppCertContent($appCertContent)
    {
        $this->appCertContent = $appCertContent;
    }
    public function getAlipayPublicCertContent()
    {
        return $this->alipayPublicCertContent;
    }
    public function setAlipayPublicCertContent($alipayPublicCertContent)
    {
        $this->alipayPublicCertContent = $alipayPublicCertContent;
    }
    public function getRootCertContent()
    {
        return $this->rootCertContent;
    }

    public function setRootCertContent($rootCertContent)
    {
        $this->rootCertContent = $rootCertContent;
    }

    public function isSkipSign()
    {
        return $this->skipSign;
    }

    public function setSkipSign(bool $skipSign)
    {
        $this->skipSign = $skipSign;
    }
}


/**
 * 验证支付宝公钥证书是否可信
 * @param $alipayCert 支付宝公钥证书
 * @param $rootCert 支付宝根证书
 */
function isTrusted($alipayCert, $rootCert)
{
    $alipayCerts = readPemCertChain($alipayCert);
    $rootCerts = readPemCertChain($rootCert);
    if (verifyCertChain($alipayCerts, $rootCerts)) {
        return verifySignature($alipayCert, $rootCert);
    } else {
        return false;
    }
}

function verifySignature($alipayCert, $rootCert)
{
    $alipayCertArray = explode("-----END CERTIFICATE-----", $alipayCert);
    $rootCertArray = explode("-----END CERTIFICATE-----", $rootCert);
    $length = count($rootCertArray) - 1;
    $checkSign = isCertSigner($alipayCertArray[0] . "-----END CERTIFICATE-----", $alipayCertArray[1] . "-----END CERTIFICATE-----");
    if (!$checkSign) {
        $checkSign = isCertSigner($alipayCertArray[1] . "-----END CERTIFICATE-----", $alipayCertArray[0] . "-----END CERTIFICATE-----");
        if ($checkSign) {
            $issuer = openssl_x509_parse($alipayCertArray[0] . "-----END CERTIFICATE-----")['issuer'];
            for ($i = 0; $i < $length; $i++) {
                $subject = openssl_x509_parse($rootCertArray[$i] . "-----END CERTIFICATE-----")['subject'];
                if ($issuer == $subject) {
                    isCertSigner($alipayCertArray[0] . "-----END CERTIFICATE-----", $rootCertArray[$i] . $rootCertArray);
                    return $checkSign;
                }
            }
        } else {
            return $checkSign;
        }
    } else {
        $issuer = openssl_x509_parse($alipayCertArray[1] . "-----END CERTIFICATE-----")['issuer'];
        for ($i = 0; $i < $length; $i++) {
            $subject = openssl_x509_parse($rootCertArray[$i] . "-----END CERTIFICATE-----")['subject'];
            if ($issuer == $subject) {
                $checkSign = isCertSigner($alipayCertArray[1] . "-----END CERTIFICATE-----", $rootCertArray[$i] . "-----END CERTIFICATE-----");
                return $checkSign;
            }
        }
        return $checkSign;
    }
}

function readPemCertChain($cert)
{
    $array = explode("-----END CERTIFICATE-----", $cert);
    $certs[] = null;
    for ($i = 0; $i < count($array) - 1; $i++) {
        $certs[$i] = openssl_x509_parse($array[$i] . "-----END CERTIFICATE-----");
    }
    return $certs;
}

function verifyCert($prev, $rootCerts)
{
    $nowTime = time();
    if ($nowTime < $prev['validFrom_time_t']) {
        echo "证书未激活";
        return false;
    }
    if ($nowTime > $prev['validTo_time_t']) {
        echo "证书已经过期";
        return false;
    }
    $subjectMap = null;
    for ($i = 0; $i < count($rootCerts); $i++) {
        $subjectDN = array2string($rootCerts[$i]['subject']);
        $subjectMap[$subjectDN] = $rootCerts[$i];
    }
    $issuerDN = array2string(($prev['issuer']));
    if (!array_key_exists($issuerDN, $subjectMap)) {
        echo "证书链验证失败";
        return false;
    }
    return true;
}

/**
 * 验证证书链是否是信任证书库中证书签发的
 * @param $alipayCerts 目标验证证书列表
 * @param $rootCerts 可信根证书列表
 */
function verifyCertChain($alipayCerts, $rootCerts)
{
    $sorted = sortByDn($alipayCerts);
    if (!$sorted) {
        echo "证书链验证失败：不是完整的证书链";
        return false;
    }
    //先验证第一个证书是不是信任库中证书签发的
    $prev = $alipayCerts[0];
    $firstOK = verifyCert($prev, $rootCerts);
    $length = count($alipayCerts);
    if (!$firstOK || $length == 1) {
        return $firstOK;
    }

    $nowTime = time();
    //验证证书链
    for ($i = 1; $i < $length; $i++) {
        $cert = $alipayCerts[$i];
        if ($nowTime < $cert['validFrom_time_t']) {
            echo "证书未激活";
            return false;
        }
        if ($nowTime > $cert['validTo_time_t']) {
            echo "证书已经过期";
            return false;
        }
    }
    return true;
}

/**
 * 将证书链按照完整的签发顺序进行排序，排序后证书链为：[issuerA, subjectA]-[issuerA, subjectB]-[issuerB, subjectC]-[issuerC, subjectD]...
 * @param $certs 证书链
 */
function sortByDn(&$certs)
{
    //是否包含自签名证书
    $hasSelfSignedCert = false;
    $subjectMap = null;
    $issuerMap = null;
    for ($i = 0; $i < count($certs); $i++) {
        if (isSelfSigned($certs[$i])) {
            if ($hasSelfSignedCert) {
                return false;
            }
            $hasSelfSignedCert = true;
        }
        $subjectDN = array2string($certs[$i]['subject']);
        $issuerDN = array2string(($certs[$i]['issuer']));
        $subjectMap[$subjectDN] = $certs[$i];
        $issuerMap[$issuerDN] = $certs[$i];
    }
    $certChain = null;
    addressingUp($subjectMap, $certChain, $certs[0]);
    addressingDown($issuerMap, $certChain, $certs[0]);

    //说明证书链不完整
    if (count($certs) != count($certChain)) {
        return false;
    }
    //将证书链复制到原先的数据
    for ($i = 0; $i < count($certs); $i++) {
        $certs[$i] = $certChain[count($certs) - $i - 1];
    }
    return true;
}

/**
 * 验证证书是否是自签发的
 * @param $cert 目标证书
 */
function isSelfSigned($cert)
{
    $subjectDN = array2string($cert['subject']);
    $issuerDN = array2string($cert['issuer']);
    return ($subjectDN == $issuerDN);
}


function array2string($array)
{
    $string = [];
    if ($array && is_array($array)) {
        foreach ($array as $key => $value) {
            $string[] = $key . '=' . $value;
        }
    }
    return implode(',', $string);
}

/**
 * 向上构造证书链
 * @param $subjectMap 主题和证书的映射
 * @param $certChain 证书链
 * @param $current 当前需要插入证书链的证书，include
 */
function addressingUp($subjectMap, &$certChain, $current)
{
    $certChain[] = $current;
    if (isSelfSigned($current)) {
        return;
    }
    $issuerDN = array2string($current['issuer']);

    if (!array_key_exists($issuerDN, $subjectMap)) {
        return;
    }
    addressingUp($subjectMap, $certChain, $subjectMap[$issuerDN]);
}

/**
 * 向下构造证书链
 * @param $issuerMap 签发者和证书的映射
 * @param $certChain 证书链
 * @param $current 当前需要插入证书链的证书，exclude
 */
function addressingDown($issuerMap, &$certChain, $current)
{
    $subjectDN = array2string($current['subject']);
    if (!array_key_exists($subjectDN, $issuerMap)) {
        return $certChain;
    }
    $certChain[] = $issuerMap[$subjectDN];
    addressingDown($issuerMap, $certChain, $issuerMap[$subjectDN]);
}


/**
 * Extract signature from der encoded cert.
 * Expects x509 der encoded certificate consisting of a section container
 * containing 2 sections and a bitstream.  The bitstream contains the
 * original encrypted signature, encrypted by the public key of the issuing
 * signer.
 * @param string $der
 * @return string on success
 * @return bool false on failures
 */
function extractSignature($der = false)
{
    if (strlen($der) < 5) {
        return false;
    }
    // skip container sequence
    $der = substr($der, 4);
    // now burn through two sequences and the return the final bitstream
    while (strlen($der) > 1) {
        $class = ord($der[0]);
        $classHex = dechex($class);
        switch ($class) {
                // BITSTREAM
            case 0x03:
                $len = ord($der[1]);
                $bytes = 0;
                if ($len & 0x80) {
                    $bytes = $len & 0x0f;
                    $len = 0;
                    for ($i = 0; $i < $bytes; $i++) {
                        $len = ($len << 8) | ord($der[$i + 2]);
                    }
                }
                return substr($der, 3 + $bytes, $len);
                break;
                // SEQUENCE
            case 0x30:
                $len = ord($der[1]);
                $bytes = 0;
                if ($len & 0x80) {
                    $bytes = $len & 0x0f;
                    $len = 0;
                    for ($i = 0; $i < $bytes; $i++) {
                        $len = ($len << 8) | ord($der[$i + 2]);
                    }
                }
                $contents = substr($der, 2 + $bytes, $len);
                $der = substr($der, 2 + $bytes + $len);
                break;
            default:
                return false;
                break;
        }
    }
    return false;
}

/**
 * Get signature algorithm oid from der encoded signature data.
 * Expects decrypted signature data from a certificate in der format.
 * This ASN1 data should contain the following structure:
 * SEQUENCE
 *    SEQUENCE
 *       OID    (signature algorithm)
 *       NULL
 * OCTET STRING (signature hash)
 * @return bool false on failures
 * @return string oid
 */
function getSignatureAlgorithmOid($der = null)
{
    // Validate this is the der we need...
    if (!is_string($der) or strlen($der) < 5) {
        return false;
    }
    $bit_seq1 = 0;
    $bit_seq2 = 2;
    $bit_oid = 4;
    if (ord($der[$bit_seq1]) !== 0x30) {
        die('Invalid DER passed to getSignatureAlgorithmOid()');
    }
    if (ord($der[$bit_seq2]) !== 0x30) {
        die('Invalid DER passed to getSignatureAlgorithmOid()');
    }
    if (ord($der[$bit_oid]) !== 0x06) {
        die('Invalid DER passed to getSignatureAlgorithmOid');
    }
    // strip out what we don't need and get the oid
    $der = substr($der, $bit_oid);
    // Get the oid
    $len = ord($der[1]);
    $bytes = 0;
    if ($len & 0x80) {
        $bytes = $len & 0x0f;
        $len = 0;
        for ($i = 0; $i < $bytes; $i++) {
            $len = ($len << 8) | ord($der[$i + 2]);
        }
    }
    $oid_data = substr($der, 2 + $bytes, $len);
    // Unpack the OID
    $oid = floor(ord($oid_data[0]) / 40);
    $oid .= '.' . ord($oid_data[0]) % 40;
    $value = 0;
    $i = 1;
    while ($i < strlen($oid_data)) {
        $value = $value << 7;
        $value = $value | (ord($oid_data[$i]) & 0x7f);
        if (!(ord($oid_data[$i]) & 0x80)) {
            $oid .= '.' . $value;
            $value = 0;
        }
        $i++;
    }
    return $oid;
}

/**
 * Get signature hash from der encoded signature data.
 * Expects decrypted signature data from a certificate in der format.
 * This ASN1 data should contain the following structure:
 * SEQUENCE
 *    SEQUENCE
 *       OID    (signature algorithm)
 *       NULL
 * OCTET STRING (signature hash)
 * @return bool false on failures
 * @return string hash
 */
function getSignatureHash($der = null)
{
    // Validate this is the der we need...
    if (!is_string($der) or strlen($der) < 5) {
        return false;
    }
    if (ord($der[0]) !== 0x30) {
        die('Invalid DER passed to getSignatureHash()');
    }
    // strip out the container sequence
    $der = substr($der, 2);
    if (ord($der[0]) !== 0x30) {
        die('Invalid DER passed to getSignatureHash()');
    }
    // Get the length of the first sequence so we can strip it out.
    $len = ord($der[1]);
    $bytes = 0;
    if ($len & 0x80) {
        $bytes = $len & 0x0f;
        $len = 0;
        for ($i = 0; $i < $bytes; $i++) {
            $len = ($len << 8) | ord($der[$i + 2]);
        }
    }
    $der = substr($der, 2 + $bytes + $len);
    // Now we should have an octet string
    if (ord($der[0]) !== 0x04) {
        die('Invalid DER passed to getSignatureHash()');
    }
    $len = ord($der[1]);
    $bytes = 0;
    if ($len & 0x80) {
        $bytes = $len & 0x0f;
        $len = 0;
        for ($i = 0; $i < $bytes; $i++) {
            $len = ($len << 8) | ord($der[$i + 2]);
        }
    }
    return bin2hex(substr($der, 2 + $bytes, $len));
}

/**
 * Determine if one cert was used to sign another
 * Note that more than one CA cert can give a positive result, some certs
 * re-issue signing certs after having only changed the expiration dates.
 * @param string $cert - PEM encoded cert
 * @param string $caCert - PEM encoded cert that possibly signed $cert
 * @return bool
 */
function isCertSigner($certPem = null, $caCertPem = null)
{
    if (!function_exists('openssl_pkey_get_public')) {
        die('Need the openssl_pkey_get_public() function.');
    }
    if (!function_exists('openssl_public_decrypt')) {
        die('Need the openssl_public_decrypt() function.');
    }
    if (!function_exists('hash')) {
        die('Need the php hash() function.');
    }
    if (empty($certPem) or empty($caCertPem)) {
        return false;
    }
    // Convert the cert to der for feeding to extractSignature.
    $certDer = pemToDer($certPem);
    if (!is_string($certDer)) {
        die('invalid certPem');
    }
    // Grab the encrypted signature from the der encoded cert.
    $encryptedSig = extractSignature($certDer);
    if (!is_string($encryptedSig)) {
        die('Failed to extract encrypted signature from certPem.');
    }
    // Extract the public key from the ca cert, which is what has
    // been used to encrypt the signature in the cert.
    $pubKey = openssl_pkey_get_public($caCertPem);
    if ($pubKey === false) {
        die('Failed to extract the public key from the ca cert.');
    }
    // Attempt to decrypt the encrypted signature using the CA's public
    // key, returning the decrypted signature in $decryptedSig.  If
    // it can't be decrypted, this ca was not used to sign it for sure...
    $rc = openssl_public_decrypt($encryptedSig, $decryptedSig, $pubKey);
    if ($rc === false) {
        return false;
    }
    // We now have the decrypted signature, which is der encoded
    // asn1 data containing the signature algorithm and signature hash.
    // Now we need what was originally hashed by the issuer, which is
    // the original DER encoded certificate without the issuer and
    // signature information.
    $origCert = stripSignerAsn($certDer);
    if ($origCert === false) {
        die('Failed to extract unsigned cert.');
    }
    // Get the oid of the signature hash algorithm, which is required
    // to generate our own hash of the original cert.  This hash is
    // what will be compared to the issuers hash.
    $oid = getSignatureAlgorithmOid($decryptedSig);
    if ($oid === false) {
        die('Failed to determine the signature algorithm.');
    }
    switch ($oid) {
        case '1.2.840.113549.2.2':
            $algo = 'md2';
            break;
        case '1.2.840.113549.2.4':
            $algo = 'md4';
            break;
        case '1.2.840.113549.2.5':
            $algo = 'md5';
            break;
        case '1.3.14.3.2.18':
            $algo = 'sha';
            break;
        case '1.3.14.3.2.26':
            $algo = 'sha1';
            break;
        case '2.16.840.1.101.3.4.2.1':
            $algo = 'sha256';
            break;
        case '2.16.840.1.101.3.4.2.2':
            $algo = 'sha384';
            break;
        case '2.16.840.1.101.3.4.2.3':
            $algo = 'sha512';
            break;
        default:
            die('Unknown signature hash algorithm oid: ' . $oid);
            break;
    }
    // Get the issuer generated hash from the decrypted signature.
    $decryptedHash = getSignatureHash($decryptedSig);
    // Ok, hash the original unsigned cert with the same algorithm
    // and if it matches $decryptedHash we have a winner.
    $certHash = hash($algo, $origCert);
    return ($decryptedHash === $certHash);
}

/**
 * Convert pem encoded certificate to DER encoding
 * @return string $derEncoded on success
 * @return bool false on failures
 */
function pemToDer($pem = null)
{
    if (!is_string($pem)) {
        return false;
    }
    $cert_split = preg_split('/(-----((BEGIN)|(END)) CERTIFICATE-----)/', $pem);
    if (!isset($cert_split[1])) {
        return false;
    }
    return base64_decode($cert_split[1]);
}

/**
 * Obtain der cert with issuer and signature sections stripped.
 * @param string $der - der encoded certificate
 * @return string $der on success
 * @return bool false on failures.
 */
function stripSignerAsn($der = null)
{
    if (!is_string($der) or strlen($der) < 8) {
        return false;
    }
    $bit = 4;
    $len = ord($der[($bit + 1)]);
    $bytes = 0;
    if ($len & 0x80) {
        $bytes = $len & 0x0f;
        $len = 0;
        for ($i = 0; $i < $bytes; $i++) {
            $len = ($len << 8) | ord($der[$bit + $i + 2]);
        }
    }
    return substr($der, 4, $len + 4);
}
/**
 * ALIPAY API: alipay.data.bill.accountlog.query request
 *
 * @author auto create
 * @since 1.0, 2024-07-04 15:51:37
 */
class AlipayDataBillAccountlogQueryRequest
{
    /** 
     * 支付宝商家账户账务明细查询
     **/
    private $bizContent;

    private $apiParas = array();
    private $terminalType;
    private $terminalInfo;
    private $prodCode;
    private $apiVersion = "1.0";
    private $notifyUrl;
    private $returnUrl;
    private $needEncrypt = false;


    public function setBizContent($bizContent)
    {
        $this->bizContent = $bizContent;
        $this->apiParas["biz_content"] = $bizContent;
    }

    public function getBizContent()
    {
        return $this->bizContent;
    }

    public function getApiMethodName()
    {
        return "alipay.data.bill.accountlog.query";
    }

    public function setNotifyUrl($notifyUrl)
    {
        $this->notifyUrl = $notifyUrl;
    }

    public function getNotifyUrl()
    {
        return $this->notifyUrl;
    }

    public function setReturnUrl($returnUrl)
    {
        $this->returnUrl = $returnUrl;
    }

    public function getReturnUrl()
    {
        return $this->returnUrl;
    }

    public function getApiParas()
    {
        return $this->apiParas;
    }

    public function getTerminalType()
    {
        return $this->terminalType;
    }

    public function setTerminalType($terminalType)
    {
        $this->terminalType = $terminalType;
    }

    public function getTerminalInfo()
    {
        return $this->terminalInfo;
    }

    public function setTerminalInfo($terminalInfo)
    {
        $this->terminalInfo = $terminalInfo;
    }

    public function getProdCode()
    {
        return $this->prodCode;
    }

    public function setProdCode($prodCode)
    {
        $this->prodCode = $prodCode;
    }

    public function setApiVersion($apiVersion)
    {
        $this->apiVersion = $apiVersion;
    }

    public function getApiVersion()
    {
        return $this->apiVersion;
    }

    public function setNeedEncrypt($needEncrypt)
    {

        $this->needEncrypt = $needEncrypt;
    }

    public function getNeedEncrypt()
    {
        return $this->needEncrypt;
    }
}

class AopClient
{
    //应用ID
    public $appId;

    //私钥文件路径
    public $rsaPrivateKeyFilePath;

    //私钥值
    public $rsaPrivateKey;

    //网关
    public $gatewayUrl = "https://openapi.alipay.com/gateway.do";
    //返回数据格式
    public $format = "json";
    //api版本
    public $apiVersion = "1.0";

    // 表单提交字符集编码
    public $postCharset = "UTF-8";

    //使用文件读取文件格式，请只传递该值
    public $alipayPublicKey = null;

    //使用读取字符串格式，请只传递该值
    public $alipayrsaPublicKey;


    public $debugInfo = false;

    private $fileCharset = "UTF-8";

    private $RESPONSE_SUFFIX = "_response";

    private $ERROR_RESPONSE = "error_response";

    private $SIGN_NODE_NAME = "sign";


    //加密XML节点名称
    private $ENCRYPT_XML_NODE_NAME = "response_encrypted";

    private $needEncrypt = false;


    //签名类型
    public $signType = "RSA";


    //加密密钥和类型

    public $encryptKey;

    public $encryptType = "AES";

    public $skipSign = false;

    private $targetServiceUrl = "";

    protected $alipaySdkVersion = "alipay-sdk-PHP-4.20.214.ALL";
    function __construct()
    {
        //根据参数个数和参数类型 来做相应的判断
        if (func_num_args() == 1 && func_get_arg(0) instanceof AlipayConfig) {
            $config = func_get_arg(0);
            $this->appId = $config->getAppId();
            $this->format = $config->getFormat();
            $this->gatewayUrl = $config->getServerUrl();
            $this->signType = $config->getSignType();
            $this->postCharset = $config->getCharset();
            $this->rsaPrivateKey = $config->getPrivateKey();
            $this->alipayrsaPublicKey = $config->getAlipayPublicKey();
            $this->skipSign = $config->isSkipSign();
        }
    }
    public function generateSign($params, $signType = "RSA")
    {
        $params = array_filter($params);
        $params['sign_type'] = $signType;
        return $this->sign($this->getSignContent($params), $signType);
    }

    public function rsaSign($params, $signType = "RSA")
    {
        return $this->sign($this->getSignContent($params), $signType);
    }

    public function getSignContent($params)
    {
        ksort($params);
        unset($params['sign']);

        $stringToBeSigned = "";
        $i = 0;
        foreach ($params as $k => $v) {
            if ("@" != substr($v, 0, 1)) {

                // 转换成目标字符集
                $v = $this->characet($v, $this->postCharset);

                if ($i == 0) {
                    $stringToBeSigned .= "$k" . "=" . "$v";
                } else {
                    $stringToBeSigned .= "&" . "$k" . "=" . "$v";
                }
                $i++;
            }
        }

        unset($k, $v);
        return $stringToBeSigned;
    }


    //此方法对value做urlencode
    public function getSignContentUrlencode($params)
    {
        ksort($params);

        $stringToBeSigned = "";
        $i = 0;
        foreach ($params as $k => $v) {
            if (false === $this->checkEmpty($v) && "@" != substr($v, 0, 1)) {

                // 转换成目标字符集
                $v = $this->characet($v, $this->postCharset);

                if ($i == 0) {
                    $stringToBeSigned .= "$k" . "=" . urlencode($v);
                } else {
                    $stringToBeSigned .= "&" . "$k" . "=" . urlencode($v);
                }
                $i++;
            }
        }

        unset($k, $v);
        return $stringToBeSigned;
    }

    protected function sign($data, $signType = "RSA")
    {
        if ($this->checkEmpty($this->rsaPrivateKeyFilePath)) {
            $priKey = $this->rsaPrivateKey;
            $res = "-----BEGIN RSA PRIVATE KEY-----\n" .
                wordwrap($priKey, 64, "\n", true) .
                "\n-----END RSA PRIVATE KEY-----";
        } else {
            $priKey = file_get_contents($this->rsaPrivateKeyFilePath);
            $res = openssl_get_privatekey($priKey);
        }

        ($res) or die('您使用的私钥格式错误，请检查RSA私钥配置');

        if ("RSA2" == $signType) {
            openssl_sign($data, $sign, $res, OPENSSL_ALGO_SHA256);
        } else {
            openssl_sign($data, $sign, $res);
        }

        if (!$this->checkEmpty($this->rsaPrivateKeyFilePath)) {
            openssl_free_key($res);
        }
        $sign = base64_encode($sign);
        return $sign;
    }

    /**
     * RSA单独签名方法，未做字符串处理,字符串处理见getSignContent()
     * @param $data 待签名字符串
     * @param $privatekey 商户私钥，根据keyfromfile来判断是读取字符串还是读取文件，false:填写私钥字符串去回车和空格 true:填写私钥文件路径
     * @param $signType 签名方式，RSA:SHA1     RSA2:SHA256
     * @param $keyfromfile 私钥获取方式，读取字符串还是读文件
     * @return string
     */
    public function alonersaSign($data, $privatekey, $signType = "RSA", $keyfromfile = false)
    {

        if (!$keyfromfile) {
            $priKey = $privatekey;
            $res = "-----BEGIN RSA PRIVATE KEY-----\n" .
                wordwrap($priKey, 64, "\n", true) .
                "\n-----END RSA PRIVATE KEY-----";
        } else {
            $priKey = file_get_contents($privatekey);
            $res = openssl_get_privatekey($priKey);
        }

        ($res) or die('您使用的私钥格式错误，请检查RSA私钥配置');

        if ("RSA2" == $signType) {
            openssl_sign($data, $sign, $res, OPENSSL_ALGO_SHA256);
        } else {
            openssl_sign($data, $sign, $res);
        }

        if ($keyfromfile) {
            openssl_free_key($res);
        }
        $sign = base64_encode($sign);
        return $sign;
    }


    protected function curl($url, $postFields = null)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_FAILONERROR, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        $postBodyString = "";
        $encodeArray = array();
        $postMultipart = false;


        if (is_array($postFields) && 0 < count($postFields)) {

            foreach ($postFields as $k => $v) {
                if ("@" != substr($v, 0, 1)) //判断是不是文件上传
                {

                    $postBodyString .= "$k=" . urlencode($this->characet($v, $this->postCharset)) . "&";
                    $encodeArray[$k] = $this->characet($v, $this->postCharset);
                } else //文件上传用multipart/form-data，否则用www-form-urlencoded
                {
                    $postMultipart = true;
                    $encodeArray[$k] = new \CURLFile(substr($v, 1));
                }
            }
            unset($k, $v);
            curl_setopt($ch, CURLOPT_POST, true);
            if ($postMultipart) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, $encodeArray);
            } else {
                curl_setopt($ch, CURLOPT_POSTFIELDS, substr($postBodyString, 0, -1));
            }
        }

        if (!$postMultipart) {
            $headers = array('content-type: application/x-www-form-urlencoded;charset=' . $this->postCharset);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        }

        $reponse = curl_exec($ch);

        if (curl_errno($ch)) {

            throw new \Exception(curl_error($ch), 0);
        } else {
            $httpStatusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            if (200 !== $httpStatusCode) {
                throw new \Exception($reponse, $httpStatusCode);
            }
        }

        curl_close($ch);
        return $reponse;
    }

    protected function getMillisecond()
    {
        list($s1, $s2) = explode(' ', microtime());
        return (float)sprintf('%.0f', (floatval($s1) + floatval($s2)) * 1000);
    }


    protected function logCommunicationError($apiName, $requestUrl, $errorCode, $responseTxt)
    {
        $logData = array(
            date("Y-m-d H:i:s"),
            $apiName,
            $this->appId,
            PHP_OS,
            $this->alipaySdkVersion,
            $requestUrl,
            $errorCode,
            str_replace("\n", "", $responseTxt)
        );

        echo json_encode($logData);
    }

    /**
     * 生成用于调用收银台SDK的字符串
     * @param $request SDK接口的请求参数对象
     * @param $appAuthToken 三方应用授权token
     * @return string
     */
    public function sdkExecute($request, $appAuthToken = null)
    {

        $this->setupCharsets($request);

        $params['app_id'] = $this->appId;
        $params['method'] = $request->getApiMethodName();
        $params['format'] = $this->format;
        $params['sign_type'] = $this->signType;
        $params['timestamp'] = date("Y-m-d H:i:s");
        $params['alipay_sdk'] = $this->alipaySdkVersion;
        $params['charset'] = $this->postCharset;

        $version = $request->getApiVersion();
        $params['version'] = $this->checkEmpty($version) ? $this->apiVersion : $version;

        if ($notify_url = $request->getNotifyUrl()) {
            $params['notify_url'] = $notify_url;
        }

        $params['app_auth_token'] = $appAuthToken;

        $dict = $request->getApiParas();
        $params['biz_content'] = $dict['biz_content'];

        ksort($params);

        if (!$this->skipSign) {
            $params['sign'] = $this->generateSign($params, $this->signType);
        }

        foreach ($params as &$value) {
            $value = $this->characet($value, $params['charset']);
        }

        return http_build_query($params);
    }

    /**
     * 页面提交执行方法
     * @param $request 跳转类接口的request
     * @param string $httpmethod 提交方式,两个值可选：post、get;
     * @param null $appAuthToken 三方应用授权token
     * @return 构建好的、签名后的最终跳转URL（GET）或String形式的form（POST）
     * @throws Exception
     */
    public function pageExecute($request, $httpmethod = "POST", $appAuthToken = null)
    {

        $this->setupCharsets($request);

        if (strcasecmp($this->fileCharset, $this->postCharset)) {

            // writeLog("本地文件字符集编码与表单提交编码不一致，请务必设置成一样，属性名分别为postCharset!");
            throw new \Exception("文件编码：[" . $this->fileCharset . "] 与表单提交编码：[" . $this->postCharset . "]两者不一致!");
        }

        $iv = null;

        if (!$this->checkEmpty($request->getApiVersion())) {
            $iv = $request->getApiVersion();
        } else {
            $iv = $this->apiVersion;
        }

        //组装系统参数
        $sysParams["app_id"] = $this->appId;
        $sysParams["version"] = $iv;
        $sysParams["format"] = $this->format;
        $sysParams["sign_type"] = $this->signType;
        $sysParams["method"] = $request->getApiMethodName();
        $sysParams["timestamp"] = date("Y-m-d H:i:s");
        $sysParams["alipay_sdk"] = $this->alipaySdkVersion;
        if (!$this->checkEmpty($request->getTerminalType())) {
            $sysParams["terminal_type"] = $request->getTerminalType();
        }
        if (!$this->checkEmpty($request->getTerminalInfo())) {
            $sysParams["terminal_info"] = $request->getTerminalInfo();
        }
        if (!$this->checkEmpty($request->getProdCode())) {
            $sysParams["prod_code"] = $request->getProdCode();
        }
        if (!$this->checkEmpty($request->getNotifyUrl())) {
            $sysParams["notify_url"] = $request->getNotifyUrl();
        }
        if (!$this->checkEmpty($request->getReturnUrl())) {
            $sysParams["return_url"] = $request->getReturnUrl();
        }
        $sysParams["charset"] = $this->postCharset;
        if (!$this->checkEmpty($appAuthToken)) {
            $sysParams["app_auth_token"] = $appAuthToken;
        }

        //获取业务参数
        $apiParams = $request->getApiParas();

        if (method_exists($request, "getNeedEncrypt") && $request->getNeedEncrypt()) {

            $sysParams["encrypt_type"] = $this->encryptType;

            if ($this->checkEmpty($apiParams['biz_content'])) {

                throw new \Exception(" api request Fail! The reason : encrypt request is not supperted!");
            }

            if ($this->checkEmpty($this->encryptKey) || $this->checkEmpty($this->encryptType)) {

                throw new \Exception(" encryptType and encryptKey must not null! ");
            }

            if ("AES" != $this->encryptType) {

                throw new \Exception("加密类型只支持AES");
            }

            // 执行加密
            $enCryptContent = encrypt($apiParams['biz_content'], $this->encryptKey);
            $apiParams['biz_content'] = $enCryptContent;
        }

        //print_r($apiParams);
        $totalParams = array_merge($apiParams, $sysParams);

        //待签名字符串
        $preSignStr = $this->getSignContent($totalParams);

        if (!$this->skipSign) {
            //签名
            $totalParams["sign"] = $this->generateSign($totalParams, $this->signType);
        }

        if ("GET" == strtoupper($httpmethod)) {

            //value做urlencode
            $preString = $this->getSignContentUrlencode($totalParams);
            //拼接GET请求串
            $requestUrl = $this->gatewayUrl . "?" . $preString;

            return $requestUrl;
        } else {
            //拼接表单字符串
            return $this->buildRequestForm($totalParams);
        }
    }


    /**
     * 建立请求，以表单HTML形式构造（默认）
     * @param $para_temp 请求参数数组
     * @return 提交表单HTML文本
     */
    protected function buildRequestForm($para_temp)
    {

        $sHtml = "<form id='alipaysubmit' name='alipaysubmit' action='" . $this->gatewayUrl . "?charset=" . trim($this->postCharset) . "' method='POST'>";
        while (list($key, $val) = $this->fun_adm_each($para_temp)) {
            if (false === $this->checkEmpty($val)) {
                //$val = $this->characet($val, $this->postCharset);
                $val = str_replace("'", "&apos;", $val);
                //$val = str_replace("\"","&quot;",$val);
                $sHtml .= "<input type='hidden' name='" . $key . "' value='" . $val . "'/>";
            }
        }

        //submit按钮控件请不要含有name属性
        $sHtml = $sHtml . "<input type='submit' value='ok' style='display:none;''></form>";

        $sHtml = $sHtml . "<script>document.forms['alipaysubmit'].submit();</script>";

        return $sHtml;
    }

    protected function fun_adm_each(&$array)
    {
        $res = array();
        $key = key($array);
        if ($key !== null) {
            next($array);
            $res[1] = $res['value'] = $array[$key];
            $res[0] = $res['key'] = $key;
        } else {
            $res = false;
        }
        return $res;
    }


    public function execute($request, $authToken = null, $appInfoAuthtoken = null, $targetAppId = null)
    {

        $this->setupCharsets($request);

        //如果两者编码不一致，会出现签名验签或者乱码
        if (strcasecmp($this->fileCharset, $this->postCharset)) {

            // writeLog("本地文件字符集编码与表单提交编码不一致，请务必设置成一样，属性名分别为postCharset!");
            throw new \Exception("文件编码：[" . $this->fileCharset . "] 与表单提交编码：[" . $this->postCharset . "]两者不一致!");
        }

        $iv = null;

        if (!$this->checkEmpty($request->getApiVersion())) {
            $iv = $request->getApiVersion();
        } else {
            $iv = $this->apiVersion;
        }


        //组装系统参数
        $sysParams["app_id"] = $this->appId;
        $sysParams["version"] = $iv;
        $sysParams["format"] = $this->format;
        $sysParams["sign_type"] = $this->signType;
        $sysParams["method"] = $request->getApiMethodName();
        $sysParams["timestamp"] = date("Y-m-d H:i:s");
        if (!$this->checkEmpty($authToken)) {
            $sysParams["auth_token"] = $authToken;
        }
        $sysParams["alipay_sdk"] = $this->alipaySdkVersion;
        if (!$this->checkEmpty($request->getTerminalType())) {
            $sysParams["terminal_type"] = $request->getTerminalType();
        }
        if (!$this->checkEmpty($request->getTerminalInfo())) {
            $sysParams["terminal_info"] = $request->getTerminalInfo();
        }
        if (!$this->checkEmpty($request->getProdCode())) {
            $sysParams["prod_code"] = $request->getProdCode();
        }
        if (!$this->checkEmpty($request->getNotifyUrl())) {
            $sysParams["notify_url"] = $request->getNotifyUrl();
        }
        $sysParams["charset"] = $this->postCharset;
        if (!$this->checkEmpty($appInfoAuthtoken)) {
            $sysParams["app_auth_token"] = $appInfoAuthtoken;
        }
        if (!$this->checkEmpty($targetAppId)) {
            $sysParams["target_app_id"] = $targetAppId;
        }
        if (!$this->checkEmpty($this->targetServiceUrl)) {
            $sysParams["ws_service_url"] = $this->targetServiceUrl;
        }


        //获取业务参数
        $apiParams = $request->getApiParas();

        if (method_exists($request, "getNeedEncrypt") && $request->getNeedEncrypt()) {

            $sysParams["encrypt_type"] = $this->encryptType;

            if ($this->checkEmpty($apiParams['biz_content'])) {

                throw new \Exception(" api request Fail! The reason : encrypt request is not supperted!");
            }

            if ($this->checkEmpty($this->encryptKey) || $this->checkEmpty($this->encryptType)) {

                throw new \Exception(" encryptType and encryptKey must not null! ");
            }

            if ("AES" != $this->encryptType) {

                throw new \Exception("加密类型只支持AES");
            }

            // 执行加密
            $enCryptContent = encrypt($apiParams['biz_content'], $this->encryptKey);
            $apiParams['biz_content'] = $enCryptContent;
        }

        if (!$this->skipSign) {
            //签名
            $sysParams["sign"] = $this->generateSign(array_merge($apiParams, $sysParams), $this->signType);
        }

        //系统参数放入GET请求串
        $requestUrl = $this->gatewayUrl . "?";
        foreach ($sysParams as $sysParamKey => $sysParamValue) {
            if ($sysParamValue != null) {
                $requestUrl .= "$sysParamKey=" . urlencode($this->characet($sysParamValue, $this->postCharset)) . "&";
            }
        }
        $requestUrl = substr($requestUrl, 0, -1);


        //发起HTTP请求
        try {
            $resp = $this->curl($requestUrl, $apiParams);
        } catch (Exception $e) {

            $this->logCommunicationError($sysParams["method"], $requestUrl, "HTTP_ERROR_" . $e->getCode(), $e->getMessage());
            return false;
        }

        //解析AOP返回结果
        $respWellFormed = false;


        // 将返回结果转换本地文件编码
        $r = iconv($this->postCharset, $this->fileCharset . "//IGNORE", $resp);


        $signData = null;

        if ("json" == strtolower($this->format)) {
            $respObject = json_decode($r);
            if (null !== $respObject) {
                $respWellFormed = true;
                $signData = $this->parserJSONSignData($request, $resp, $respObject);
            }
        } else if ("xml" == $this->format) {
            $disableLibxmlEntityLoader = libxml_disable_entity_loader(true);
            $respObject = @simplexml_load_string($resp);
            if (false !== $respObject) {
                $respWellFormed = true;

                $signData = $this->parserXMLSignData($request, $resp);
            }
            libxml_disable_entity_loader($disableLibxmlEntityLoader);
        }


        //返回的HTTP文本不是标准JSON或者XML，记下错误日志
        if (false === $respWellFormed) {
            var_dump(333);
            $this->logCommunicationError($sysParams["method"], $requestUrl, "HTTP_RESPONSE_NOT_WELL_FORMED", $resp);
            return false;
        }

        // 验签
        $this->checkResponseSign($request, $signData, $resp, $respObject);

        // 解密
        if (method_exists($request, "getNeedEncrypt") && $request->getNeedEncrypt()) {

            if ("json" == strtolower($this->format)) {


                $resp = $this->encryptJSONSignSource($request, $resp);

                // 将返回结果转换本地文件编码
                $r = iconv($this->postCharset, $this->fileCharset . "//IGNORE", $resp);
                $respObject = json_decode($r);
            } else {

                $resp = $this->encryptXMLSignSource($request, $resp);

                $r = iconv($this->postCharset, $this->fileCharset . "//IGNORE", $resp);
                $disableLibxmlEntityLoader = libxml_disable_entity_loader(true);
                $respObject = @simplexml_load_string($r);
                libxml_disable_entity_loader($disableLibxmlEntityLoader);
            }
        }

        return $respObject;
    }

    /**
     * 转换字符集编码
     * @param $data
     * @param $targetCharset
     * @return string
     */
    function characet($data, $targetCharset)
    {

        if (!empty($data)) {
            $fileType = $this->fileCharset;
            if (strcasecmp($fileType, $targetCharset) != 0) {
                $data = mb_convert_encoding($data, $targetCharset, $fileType);
                //				$data = iconv($fileType, $targetCharset.'//IGNORE', $data);
            }
        }


        return $data;
    }

    public function exec($paramsArray)
    {
        if (!isset($paramsArray["method"])) {
            trigger_error("No api name passed");
        }
        $inflector = new LtInflector;
        $inflector->conf["separator"] = ".";
        $requestClassName = ucfirst($inflector->camelize(substr($paramsArray["method"], 7))) . "Request";
        if (!class_exists($requestClassName)) {
            trigger_error("No such api: " . $paramsArray["method"]);
        }

        $session = isset($paramsArray["session"]) ? $paramsArray["session"] : null;

        $req = new $requestClassName;
        foreach ($paramsArray as $paraKey => $paraValue) {
            $inflector->conf["separator"] = "_";
            $setterMethodName = $inflector->camelize($paraKey);
            $inflector->conf["separator"] = ".";
            $setterMethodName = "set" . $inflector->camelize($setterMethodName);
            if (method_exists($req, $setterMethodName)) {
                $req->$setterMethodName($paraValue);
            }
        }
        return $this->execute($req, $session);
    }

    /**
     * 校验$value是否非空
     *  if not set ,return true;
     *    if is null , return true;
     **/
    protected function checkEmpty($value)
    {
        if (!isset($value))
            return true;
        if ($value === null)
            return true;
        if (trim($value) === "")
            return true;

        return false;
    }

    /** rsaCheckV1 & rsaCheckV2
     *  验证签名
     *  在使用本方法前，必须初始化AopClient且传入公钥参数。
     *  公钥是否是读取字符串还是读取文件，是根据初始化传入的值判断的。
     **/
    public function rsaCheckV1($params, $rsaPublicKeyFilePath, $signType = 'RSA')
    {
        $sign = $params['sign'];
        unset($params['sign']);
        unset($params['sign_type']);
        return $this->verify($this->getSignContent($params), $sign, $rsaPublicKeyFilePath, $signType);
    }

    public function rsaCheckV2($params, $rsaPublicKeyFilePath, $signType = 'RSA')
    {
        $sign = $params['sign'];
        unset($params['sign']);
        return $this->verify($this->getSignContent($params), $sign, $rsaPublicKeyFilePath, $signType);
    }

    function verify($data, $sign, $rsaPublicKeyFilePath, $signType = 'RSA')
    {

        if ($this->checkEmpty($this->alipayPublicKey)) {

            $pubKey = $this->alipayrsaPublicKey;
            $res = "-----BEGIN PUBLIC KEY-----\n" .
                wordwrap($pubKey, 64, "\n", true) .
                "\n-----END PUBLIC KEY-----";
        } else {
            //读取公钥文件
            $pubKey = file_get_contents($rsaPublicKeyFilePath);
            //转换为openssl格式密钥
            $res = openssl_get_publickey($pubKey);
        }

        ($res) or die('支付宝RSA公钥错误。请检查公钥文件格式是否正确');

        //调用openssl内置方法验签，返回bool值

        $result = FALSE;
        if ("RSA2" == $signType) {
            $result = (openssl_verify($data, base64_decode($sign), $res, OPENSSL_ALGO_SHA256) === 1);
        } else {
            $result = (openssl_verify($data, base64_decode($sign), $res) === 1);
        }

        if (!$this->checkEmpty($this->alipayPublicKey)) {
            //释放资源
            openssl_free_key($res);
        }

        return $result;
    }

    /**
     *  在使用本方法前，必须初始化AopClient且传入公私钥参数。
     *  公钥是否是读取字符串还是读取文件，是根据初始化传入的值判断的。
     **/
    public function checkSignAndDecrypt($params, $rsaPublicKeyPem, $rsaPrivateKeyPem, $isCheckSign, $isDecrypt, $signType = 'RSA')
    {
        $charset = $params['charset'];
        $bizContent = $params['biz_content'];
        if ($isCheckSign) {
            if (!$this->rsaCheckV2($params, $rsaPublicKeyPem, $signType)) {
                echo "<br/>checkSign failure<br/>";
                exit;
            }
        }
        if ($isDecrypt) {
            return $this->rsaDecrypt($bizContent, $rsaPrivateKeyPem, $charset);
        }

        return $bizContent;
    }

    /**
     *  在使用本方法前，必须初始化AopClient且传入公私钥参数。
     *  公钥是否是读取字符串还是读取文件，是根据初始化传入的值判断的。
     **/
    public function encryptAndSign($bizContent, $rsaPublicKeyPem, $rsaPrivateKeyPem, $charset, $isEncrypt, $isSign, $signType = 'RSA')
    {
        // 加密，并签名
        if ($isEncrypt && $isSign) {
            $encrypted = $this->rsaEncrypt($bizContent, $rsaPublicKeyPem, $charset);
            $sign = $this->sign($encrypted, $signType);
            $response = "<?xml version=\"1.0\" encoding=\"$charset\"?><alipay><response>$encrypted</response><encryption_type>RSA</encryption_type><sign>$sign</sign><sign_type>$signType</sign_type></alipay>";
            return $response;
        }
        // 加密，不签名
        if ($isEncrypt && (!$isSign)) {
            $encrypted = $this->rsaEncrypt($bizContent, $rsaPublicKeyPem, $charset);
            $response = "<?xml version=\"1.0\" encoding=\"$charset\"?><alipay><response>$encrypted</response><encryption_type>$signType</encryption_type></alipay>";
            return $response;
        }
        // 不加密，但签名
        if ((!$isEncrypt) && $isSign) {
            $sign = $this->sign($bizContent, $signType);
            $response = "<?xml version=\"1.0\" encoding=\"$charset\"?><alipay><response>$bizContent</response><sign>$sign</sign><sign_type>$signType</sign_type></alipay>";
            return $response;
        }
        // 不加密，不签名
        $response = "<?xml version=\"1.0\" encoding=\"$charset\"?>$bizContent";
        return $response;
    }

    /**
     *  在使用本方法前，必须初始化AopClient且传入公私钥参数。
     *  公钥是否是读取字符串还是读取文件，是根据初始化传入的值判断的。
     **/
    public function rsaEncrypt($data, $rsaPublicKeyFilePath, $charset)
    {
        if ($this->checkEmpty($this->alipayPublicKey)) {
            //读取字符串
            $pubKey = $this->alipayrsaPublicKey;
            $res = "-----BEGIN PUBLIC KEY-----\n" .
                wordwrap($pubKey, 64, "\n", true) .
                "\n-----END PUBLIC KEY-----";
        } else {
            //读取公钥文件
            $pubKey = file_get_contents($rsaPublicKeyFilePath);
            //转换为openssl格式密钥
            $res = openssl_get_publickey($pubKey);
        }

        ($res) or die('支付宝RSA公钥错误。请检查公钥文件格式是否正确');
        $blocks = $this->splitCN($data, 0, 30, $charset);
        $chrtext  = null;
        $encodes  = array();
        foreach ($blocks as $n => $block) {
            if (!openssl_public_encrypt($block, $chrtext, $res)) {
                echo "<br/>" . openssl_error_string() . "<br/>";
            }
            $encodes[] = $chrtext;
        }
        $chrtext = implode(",", $encodes);

        return base64_encode($chrtext);
    }

    /**
     *  在使用本方法前，必须初始化AopClient且传入公私钥参数。
     *  公钥是否是读取字符串还是读取文件，是根据初始化传入的值判断的。
     **/
    public function rsaDecrypt($data, $rsaPrivateKeyPem, $charset)
    {

        if ($this->checkEmpty($this->rsaPrivateKeyFilePath)) {
            //读字符串
            $priKey = $this->rsaPrivateKey;
            $res = "-----BEGIN RSA PRIVATE KEY-----\n" .
                wordwrap($priKey, 64, "\n", true) .
                "\n-----END RSA PRIVATE KEY-----";
        } else {
            $priKey = file_get_contents($this->rsaPrivateKeyFilePath);
            $res = openssl_get_privatekey($priKey);
        }
        ($res) or die('您使用的私钥格式错误，请检查RSA私钥配置');
        //转换为openssl格式密钥
        $decodes = explode(',', $data);
        $strnull = "";
        $dcyCont = "";
        foreach ($decodes as $n => $decode) {
            if (!openssl_private_decrypt($decode, $dcyCont, $res)) {
                echo "<br/>" . openssl_error_string() . "<br/>";
            }
            $strnull .= $dcyCont;
        }
        return $strnull;
    }

    function splitCN($cont, $n, $subnum, $charset)
    {
        //$len = strlen($cont) / 3;
        $arrr = array();
        for ($i = $n; $i < strlen($cont); $i += $subnum) {
            $res = $this->subCNchar($cont, $i, $subnum, $charset);
            if (!empty($res)) {
                $arrr[] = $res;
            }
        }

        return $arrr;
    }

    function subCNchar($str, $start, $length, $charset = "gbk")
    {
        if (strlen($str) <= $length) {
            return $str;
        }
        $re['utf-8'] = "/[\x01-\x7f]|[\xc2-\xdf][\x80-\xbf]|[\xe0-\xef][\x80-\xbf]{2}|[\xf0-\xff][\x80-\xbf]{3}/";
        $re['gb2312'] = "/[\x01-\x7f]|[\xb0-\xf7][\xa0-\xfe]/";
        $re['gbk'] = "/[\x01-\x7f]|[\x81-\xfe][\x40-\xfe]/";
        $re['big5'] = "/[\x01-\x7f]|[\x81-\xfe]([\x40-\x7e]|\xa1-\xfe])/";
        preg_match_all($re[$charset], $str, $match);
        $slice = join("", array_slice($match[0], $start, $length));
        return $slice;
    }

    function parserResponseSubCode($request, $responseContent, $respObject, $format)
    {

        if ("json" == strtolower($format)) {

            $apiName = $request->getApiMethodName();
            $rootNodeName = str_replace(".", "_", $apiName) . $this->RESPONSE_SUFFIX;
            $errorNodeName = $this->ERROR_RESPONSE;

            $rootIndex = strpos($responseContent, $rootNodeName);
            $errorIndex = strpos($responseContent, $errorNodeName);

            if ($rootIndex > 0) {
                // 内部节点对象
                $rInnerObject = $respObject->$rootNodeName;
            } elseif ($errorIndex > 0) {

                $rInnerObject = $respObject->$errorNodeName;
            } else {
                return null;
            }

            // 存在属性则返回对应值
            if (isset($rInnerObject->sub_code)) {

                return $rInnerObject->sub_code;
            } else {

                return null;
            }
        } elseif ("xml" == $format) {

            // xml格式sub_code在同一层级
            return $respObject->sub_code;
        }
    }

    function parserJSONSignData($request, $responseContent, $responseJSON)
    {

        $signData = new SignData();

        $signData->sign = $this->parserJSONSign($responseJSON);
        $signData->signSourceData = $this->parserJSONSignSource($request, $responseContent);


        return $signData;
    }

    function parserJSONSignSource($request, $responseContent)
    {

        $apiName = $request->getApiMethodName();
        $rootNodeName = str_replace(".", "_", $apiName) . $this->RESPONSE_SUFFIX;

        $rootIndex = strpos($responseContent, $rootNodeName);
        $errorIndex = strpos($responseContent, $this->ERROR_RESPONSE);


        if ($rootIndex > 0) {

            return $this->parserJSONSource($responseContent, $rootNodeName, $rootIndex);
        } else if ($errorIndex > 0) {

            return $this->parserJSONSource($responseContent, $this->ERROR_RESPONSE, $errorIndex);
        } else {

            return null;
        }
    }

    function parserJSONSource($responseContent, $nodeName, $nodeIndex)
    {
        $signDataStartIndex = $nodeIndex + strlen($nodeName) + 2;
        $signIndex = strrpos($responseContent, "\"" . $this->SIGN_NODE_NAME . "\"");
        // 签名前-逗号
        $signDataEndIndex = $signIndex - 1;
        $indexLen = $signDataEndIndex - $signDataStartIndex;
        if ($indexLen < 0) {

            return null;
        }

        return substr($responseContent, $signDataStartIndex, $indexLen);
    }

    function parserJSONSign($responseJSon)
    {

        return $responseJSon->sign;
    }

    function parserXMLSignData($request, $responseContent)
    {


        $signData = new SignData();

        $signData->sign = $this->parserXMLSign($responseContent);
        $signData->signSourceData = $this->parserXMLSignSource($request, $responseContent);


        return $signData;
    }

    function parserXMLSignSource($request, $responseContent)
    {


        $apiName = $request->getApiMethodName();
        $rootNodeName = str_replace(".", "_", $apiName) . $this->RESPONSE_SUFFIX;


        $rootIndex = strpos($responseContent, $rootNodeName);
        $errorIndex = strpos($responseContent, $this->ERROR_RESPONSE);
        //		$this->echoDebug("<br/>rootNodeName:" . $rootNodeName);
        //		$this->echoDebug("<br/> responseContent:<xmp>" . $responseContent . "</xmp>");


        if ($rootIndex > 0) {

            return $this->parserXMLSource($responseContent, $rootNodeName, $rootIndex);
        } else if ($errorIndex > 0) {

            return $this->parserXMLSource($responseContent, $this->ERROR_RESPONSE, $errorIndex);
        } else {

            return null;
        }
    }

    function parserXMLSource($responseContent, $nodeName, $nodeIndex)
    {
        $signDataStartIndex = $nodeIndex + strlen($nodeName) + 1;
        $signIndex = strrpos($responseContent, "<" . $this->SIGN_NODE_NAME . ">");
        // 签名前-逗号
        $signDataEndIndex = $signIndex - 1;
        $indexLen = $signDataEndIndex - $signDataStartIndex + 1;

        if ($indexLen < 0) {
            return null;
        }


        return substr($responseContent, $signDataStartIndex, $indexLen);
    }

    function parserXMLSign($responseContent)
    {
        $signNodeName = "<" . $this->SIGN_NODE_NAME . ">";
        $signEndNodeName = "</" . $this->SIGN_NODE_NAME . ">";

        $indexOfSignNode = strpos($responseContent, $signNodeName);
        $indexOfSignEndNode = strpos($responseContent, $signEndNodeName);


        if ($indexOfSignNode < 0 || $indexOfSignEndNode < 0) {
            return null;
        }

        $nodeIndex = ($indexOfSignNode + strlen($signNodeName));

        $indexLen = $indexOfSignEndNode - $nodeIndex;

        if ($indexLen < 0) {
            return null;
        }

        // 签名
        return substr($responseContent, $nodeIndex, $indexLen);
    }

    /**
     * 验签
     * @param $request
     * @param $signData
     * @param $resp
     * @param $respObject
     * @throws Exception
     */
    public function checkResponseSign($request, $signData, $resp, $respObject)
    {
        if ($this->skipSign) {
            return;
        }

        if (!$this->checkEmpty($this->alipayPublicKey) || !$this->checkEmpty($this->alipayrsaPublicKey)) {


            if ($signData == null || $this->checkEmpty($signData->sign) || $this->checkEmpty($signData->signSourceData)) {

                throw new \Exception(" check sign Fail! The reason : signData is Empty");
            }


            // 获取结果sub_code
            $responseSubCode = $this->parserResponseSubCode($request, $resp, $respObject, $this->format);


            if (!$this->checkEmpty($responseSubCode) || ($this->checkEmpty($responseSubCode) && !$this->checkEmpty($signData->sign))) {

                $checkResult = $this->verify($signData->signSourceData, $signData->sign, $this->alipayPublicKey, $this->signType);


                if (!$checkResult) {

                    if (strpos($signData->signSourceData, "\\/") > 0) {

                        $signData->signSourceData = str_replace("\\/", "/", $signData->signSourceData);

                        $checkResult = $this->verify($signData->signSourceData, $signData->sign, $this->alipayPublicKey, $this->signType);

                        if (!$checkResult) {
                            throw new \Exception("check sign Fail! [sign=" . $signData->sign . ", signSourceData=" . $signData->signSourceData . "]");
                        }
                    } else {

                        throw new \Exception("check sign Fail! [sign=" . $signData->sign . ", signSourceData=" . $signData->signSourceData . "]");
                    }
                }
            }
        }
    }

    private function setupCharsets($request)
    {
        if ($this->checkEmpty($this->postCharset)) {
            $this->postCharset = 'UTF-8';
        }
        $str = preg_match('/[\x80-\xff]/', $this->appId) ? $this->appId : print_r($request, true);
        $this->fileCharset = mb_detect_encoding($str, "UTF-8, GBK") == 'UTF-8' ? 'UTF-8' : 'GBK';
    }

    // 获取加密内容

    private function encryptJSONSignSource($request, $responseContent)
    {

        $parsetItem = $this->parserEncryptJSONSignSource($request, $responseContent);

        $bodyIndexContent = substr($responseContent, 0, $parsetItem->startIndex);
        $bodyEndContent = substr($responseContent, $parsetItem->endIndex, strlen($responseContent) + 1 - $parsetItem->endIndex);

        $bizContent = decrypt($parsetItem->encryptContent, $this->encryptKey);
        return $bodyIndexContent . $bizContent . $bodyEndContent;
    }


    private function parserEncryptJSONSignSource($request, $responseContent)
    {

        $apiName = $request->getApiMethodName();
        $rootNodeName = str_replace(".", "_", $apiName) . $this->RESPONSE_SUFFIX;

        $rootIndex = strpos($responseContent, $rootNodeName);
        $errorIndex = strpos($responseContent, $this->ERROR_RESPONSE);


        if ($rootIndex > 0) {

            return $this->parserEncryptJSONItem($responseContent, $rootNodeName, $rootIndex);
        } else if ($errorIndex > 0) {

            return $this->parserEncryptJSONItem($responseContent, $this->ERROR_RESPONSE, $errorIndex);
        } else {

            return null;
        }
    }


    private function parserEncryptJSONItem($responseContent, $nodeName, $nodeIndex)
    {
        $signDataStartIndex = $nodeIndex + strlen($nodeName) + 2;
        $signIndex = strpos($responseContent, "\"" . $this->SIGN_NODE_NAME . "\"");
        // 签名前-逗号
        $signDataEndIndex = $signIndex - 1;

        if ($signDataEndIndex < 0) {

            $signDataEndIndex = strlen($responseContent) - 1;
        }

        $indexLen = $signDataEndIndex - $signDataStartIndex;

        $encContent = substr($responseContent, $signDataStartIndex + 1, $indexLen - 2);


        $encryptParseItem = new EncryptParseItem();

        $encryptParseItem->encryptContent = $encContent;
        $encryptParseItem->startIndex = $signDataStartIndex;
        $encryptParseItem->endIndex = $signDataEndIndex;

        return $encryptParseItem;
    }

    // 获取加密内容

    private function encryptXMLSignSource($request, $responseContent)
    {

        $parsetItem = $this->parserEncryptXMLSignSource($request, $responseContent);

        $bodyIndexContent = substr($responseContent, 0, $parsetItem->startIndex);
        $bodyEndContent = substr($responseContent, $parsetItem->endIndex, strlen($responseContent) + 1 - $parsetItem->endIndex);
        $bizContent = decrypt($parsetItem->encryptContent, $this->encryptKey);

        return $bodyIndexContent . $bizContent . $bodyEndContent;
    }

    private function parserEncryptXMLSignSource($request, $responseContent)
    {


        $apiName = $request->getApiMethodName();
        $rootNodeName = str_replace(".", "_", $apiName) . $this->RESPONSE_SUFFIX;


        $rootIndex = strpos($responseContent, $rootNodeName);
        $errorIndex = strpos($responseContent, $this->ERROR_RESPONSE);
        //		$this->echoDebug("<br/>rootNodeName:" . $rootNodeName);
        //		$this->echoDebug("<br/> responseContent:<xmp>" . $responseContent . "</xmp>");


        if ($rootIndex > 0) {

            return $this->parserEncryptXMLItem($responseContent, $rootNodeName, $rootIndex);
        } else if ($errorIndex > 0) {

            return $this->parserEncryptXMLItem($responseContent, $this->ERROR_RESPONSE, $errorIndex);
        } else {

            return null;
        }
    }

    private function parserEncryptXMLItem($responseContent, $nodeName, $nodeIndex)
    {

        $signDataStartIndex = $nodeIndex + strlen($nodeName) + 1;

        $xmlStartNode = "<" . $this->ENCRYPT_XML_NODE_NAME . ">";
        $xmlEndNode = "</" . $this->ENCRYPT_XML_NODE_NAME . ">";

        $indexOfXmlNode = strpos($responseContent, $xmlEndNode);
        if ($indexOfXmlNode < 0) {

            $item = new EncryptParseItem();
            $item->encryptContent = null;
            $item->startIndex = 0;
            $item->endIndex = 0;
            return $item;
        }

        $startIndex = $signDataStartIndex + strlen($xmlStartNode);
        $bizContentLen = $indexOfXmlNode - $startIndex;
        $bizContent = substr($responseContent, $startIndex, $bizContentLen);

        $encryptParseItem = new EncryptParseItem();
        $encryptParseItem->encryptContent = $bizContent;
        $encryptParseItem->startIndex = $signDataStartIndex;
        $encryptParseItem->endIndex = $indexOfXmlNode + strlen($xmlEndNode);

        return $encryptParseItem;
    }


    function echoDebug($content)
    {

        if ($this->debugInfo) {
            echo "<br/>" . $content;
        }
    }
}
