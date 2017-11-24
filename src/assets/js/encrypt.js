let rsaPublicKey = "-----BEGIN PUBLIC KEY----- MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyeRf1LtUjo+rlnjI3Mwb HEHcfaAbV02AehtsI+cWwLQ9gID4vVGHrotW5P1bU2LmK6PPPdB667hTzqoEsf1g odAx/kXrDnArGctqG5ghMLG16kapAN5nXxTB9l37ZXCmrZOG9xpeXmg2LtGxn8av GJqBpKWNDcBbCVx1gQ22Rnge+8/TUq/hw3BZqb7RnVNAiAdLixO2wtpa6XcPNGY/ vtYX8ZbJJNZl2C8FwyilCpB1fcGDlIxS4N2bzJ+M8Sl9Gw6mzckFBfdKsjNii/rN VC6uo0N6BbRAwuhwDWzsxkVTdH3LxfR5LhDIvfu3zCYT96w2seZIvo3tqNiFl3Fl 4QIDAQAB -----END PUBLIC KEY-----";
module.exports = function(str) {
  var crypt = new JSEncrypt();
  crypt.setKey(rsaPublicKey); //公钥
  return crypt.encrypt(str);
}
