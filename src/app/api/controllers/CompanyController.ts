import { Company } from '@prisma/client';
import { prisma } from '../lib/prisma';

class CompanyController {
  async create(name: Company['name']) {
    const company = await prisma.company.create({ data: { name: name } });

    return company;
  }
}

export default new CompanyController();
