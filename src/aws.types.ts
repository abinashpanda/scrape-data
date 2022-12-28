export type PartnerPathDetail = {
  path_tier: string
  path_stage: string
  path_name: string
}

export type Reference = {
  reference_id: string
  approval_date: string
  reference_url: string
  expiration_date: string
  record_type: string
  customer_name: string
  title: string
}

export type Solution = {
  solution_id: string
  validation_level_detailed: string
  offering_type_raw: string
  offering_status: string
  refiners: string[]
  availability: string
  record_type: string
  solution_url_dup: string
  solution_name: string[]
  offering_type: string
  created_date: string
  solution_url: string
  validation_level: string
  proposition: string
  description: string
  bd_use_case: string[]
}

export type Location = {
  country: string
  city: string
  street: string
  postalcode: string
  state: string
  location_type: string[]
  latlon: {
    lat: number
    lon: number
  }
}

export type AWSPartner = {
  _id: string
  _source: {
    customer_type: string
    aws_certifications_count: number
    partner_active: boolean
    industry?: string[]
    refiners?: string[]
    target_client_base?: string[]
    numberofemployees: number
    customer_launches_count: number
    segment?: string[]
    download_url?: string
    partner_path: {
      path_detail: PartnerPathDetail[]
    }
    services_count: number
    literal_name: string
    professional_service_types?: string[]
    solution_count: number
    current_program_status: string
    socio_economic_categories_count: number
    is_saas_vendor: string
    programs_count: number
    website: string
    competencies_count: number
    public_sector_categories_count: number
    competency_membership?: string[] /** AWS Competenencies */
    public_sector_program_categories?: string[]
    program_membership?: string[] /** Partner Programs */
    public_sector_contract_count: 0
    domain?: string[]
    service_membership?: string[] /** AWS Service Validations */
    reference_count: 41
    aws_certifications?: string[] /** AWS Certifications */
    use_case_expertise?: string[]
    brief_description?: string
    description?: string
    references?: Reference[]
    solutions?: Solution[]
    name: string
    name_aka: []
    office_address?: Location[]
    office_address_aka: []
    timestamp: string
    language: string
    partner_validated: true
    solutions_nested: Solution[]
    references_nested: Reference[]
    solutions_solution_count: number
    solutions_practice_count: number
    references_casestudy_count: number
    references_reference_count: number
  }
}
