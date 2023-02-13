import axios from 'axios'
import { AzurePartner } from './azure.types'
import papa from 'papaparse'
import fs from 'fs/promises'
import path from 'path'

const PAGE_SIZE = 100
const TOTAL_PARTNERS = 93338
const MAX_PAGES = Math.ceil(TOTAL_PARTNERS / PAGE_SIZE)

const filterParams = {
  sort: 0,
  pageSize: PAGE_SIZE,
  pageOffset: 0,
  onlyThisCountry: true,
  radius: 100,
  locationNotRequired: true,
}

const apiClient = axios.create({
  baseURL: 'https://main.prod.marketplacepartnerdirectory.azure.com/api/partners',
})

export async function parse() {
  const results: AzurePartner[] = []
  for (let i = 0; i < MAX_PAGES; i++) {
    const params = { ...filterParams, pageOffset: i * PAGE_SIZE }
    const paramString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join(';')
    console.log(`>>> 🕐\tFetching page ${i + 1} of ${MAX_PAGES}...`)
    try {
      const { data } = await apiClient.get<{ matchingPartners: { items: AzurePartner[] } }>(`?filter=${paramString}`)
      results.push(...data.matchingPartners.items)
      console.log(`>>> ✅\tFetched page ${i + 1} of ${MAX_PAGES}...`)
    } catch (error) {
      console.log(`>>> ❌\tError fetching page ${i + 1} of ${MAX_PAGES}...`)
    }
  }
  const csvData = results.map((item) => {
    return {
      Name: item.name,
      Description: item.description,
      'Industry Focus': item.industryFocus.join(', '),
      Products: item.product.join(', '),
      Solutions: item.solutions.join(', '),
      'Service Types': item.serviceType.join(', '),
      Country: item.location.address?.country ?? 'N/A',
      'Competency Level': item.competencySummary.competencyLevel,
      'Product Endorsements': item.productEndorsements.join(', '),
      'Service Type Endorsements': item.serviceTypeEndorsements.join(', '),
      'Solutions Endorsements': item.solutionsEndorsements.join(', '),
      'Industry Focus Endorsements': item.industryFocusEndorsements.join(', '),
      'LinkedIn URL': item.linkedInOrganizationProfile ?? 'N/A',
      Specializations: item.programQualificationsAsp.join(', '),
      'Azure Expert MSP': item.programQualificationsMsp?.includes('Azure Expert MSPs') ? 'Yes' : 'No',
    }
  })
  const csvContent = papa.unparse(csvData)
  await fs.writeFile(path.resolve(__dirname, 'partners-azure.csv'), csvContent, 'utf-8')
  console.log(`>>> 📁\tGenerated partners-azure.csv with ${csvData.length} partners...`)
}
