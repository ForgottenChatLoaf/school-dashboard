import Sidebar from './Sidebar';
import Navbar from './Navbar';

const PageWrapper = ({ children, title }) => {
  return (
    <div className="flex h-screen bg-mesh overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <Navbar pageTitle={title} />
        <main className="flex-1 overflow-y-auto p-8 page-enter">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageWrapper;
