import axios from 'axios'
import { AWSPartner } from './aws.types'
import fs from 'fs/promises'
import path from 'path'
import papa from 'papaparse'

const apiClient = axios.create({
  baseURL: 'https://api.finder.partners.aws.a2z.com',
})

const MAX_PAGES = process.env.MAX_PAGES ? Number.parseInt(process.env.MAX_PAGES) : 2
const PAGE_SIZE = process.env.PAGE_SIZE ? Number.parseInt(process.env.PAGE_SIZE) : 10

export async function parse() {
  const partners = []

  for (let pageCount = 0; pageCount < MAX_PAGES; pageCount += 1) {
    const { data } = await apiClient.get<{ message: { results: AWSPartner[] } }>('/search', {
      params: {
        size: PAGE_SIZE,
        from: pageCount * PAGE_SIZE,
      },
    })
    for (const item of data.message.results) {
      partners.push({
        name: item._source.name,
        logo: item._source.download_url ?? '',
        description: item._source.description ?? '',
        awsCompetency: item._source.competency_membership?.join(', ') ?? '',
        partnerPrograms: item._source.program_membership?.join(', ') ?? '',
        awsServices: item._source.service_membership?.join(', ') ?? '',
        awsCertifications: item._source.aws_certifications?.join(', ') ?? '',
        awsCompetencyCount: item._source.competencies_count ?? 0,
        partnerProgramsCount: item._source.programs_count ?? 0,
        awsServiceValicationsCount: item._source.services_count ?? 0,
        awsCertificationsCount: item._source.aws_certifications_count ?? 0,
        awsCustomerLaunchesCount: item._source.customer_launches_count ?? 0,
        tiers: item._source.partner_path?.path_detail?.map((item) => item.path_tier).join(', ') ?? '',
        currentTier: item._source.current_program_status,
      })
    }

    console.log(`⏲️ Fetched page ${pageCount + 1} of ${MAX_PAGES}...`)
  }

  const csv = papa.unparse(partners)
  await fs.writeFile(path.resolve(__dirname, 'partners-aws.csv'), csv, 'utf-8')
}
