export const GetAccountByDomain = `
query getAccountSettingsByDomain($domain: String!) {
  account: getAccountSettingsByDomain(domain: $domain) {
    id
    subdomain
    friendlyName
    description
    recaptchaSiteKey
  }
}
`;

export interface GetAccountByDomainData {
  account: {
    id: string;
    subdomain: string;
    friendlyName: string;
    description: string;
    recaptchaSiteKey: string;
  };
}
export interface GetAccountByDomainVariables {
  domain: string;
}

export default {
  GetAccountByDomain,
};
