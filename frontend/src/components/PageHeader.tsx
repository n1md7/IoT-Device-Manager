type Props = {
  pageTitle: string;
};

const PageHeader = ({ pageTitle }: Props) => {
  return <h1 className="page-header">Manage your {pageTitle}</h1>;
};

export default PageHeader;
