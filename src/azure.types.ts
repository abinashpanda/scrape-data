export type AzurePartner = {
  id: string
  partnerId: string
  name: string
  description: string
  industryFocus: string[]
  product: string[]
  solutions: string[]
  serviceType: string[]
  logo: string
  location: {
    id: string
    address: {
      country: string
      region: string
      city: string
      state: string
      addressLine1: string
      addressLine2: string
      postalCode: string
    }
    latitude: number
    longitude: number
  }
  competencySummary: {
    competencyLevel: 2
  }
  seatCountRange: {
    lower: 0
    upper: 0
  }
  productEndorsements: string[]
  serviceTypeEndorsements: string[]
  solutionsEndorsements: string[]
  industryFocusEndorsements: string[]
  linkedInOrganizationProfile: string
  programQualificationsMsp: string[]
  programQualificationsAsp: string[]
  solutionsPartnerDesignations: string[]
  competencies: {
    gold: string[]
    silver: string[]
  }
  competenciesGold: string[]
  competenciesSilver: string[]
  referralPrograms: string[]
  daiOwnedLed: string[]
  daiThirdPartyAccreditation: string[]
}
