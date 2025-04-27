import { Company } from '@prisma/client';
import { prisma } from '../lib/prisma';

class CompanyController {
  async create(name: Company['name']) {
    const company = await prisma.company.create({ data: { name: name } });

    return company;
  }

  async findById(id: Company['id']) {
    const company = await prisma.company.findUnique({ where: { id: id } });

    return company;
  }
}

export default new CompanyController();
