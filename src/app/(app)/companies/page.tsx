import { getDashboardSummary } from "@/lib/data/dashboard";
import { CompanyCard, EmptyCompanies } from "@/components/companies/CompanyCard";
import { NewCompanyButton } from "@/components/companies/CompanyForm";

export default async function CompaniesPage() {
  const { companies } = await getDashboardSummary();

  return (
    <div className="animate-fade-in w-full min-w-0 space-y-6 xl:space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>
          <p className="text-muted-foreground">Manage the organizations you work with</p>
        </div>
        <NewCompanyButton />
      </div>

      {companies.length === 0 ? (
        <EmptyCompanies />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
}
