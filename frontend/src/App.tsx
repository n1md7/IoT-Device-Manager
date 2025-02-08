import NavBar from './components/NavBar.tsx';
import PageHeader from './components/PageHeader.tsx';
import Welcome from './components/Welcome.tsx';
import AddNewSystem from './components/AddNewSystem.tsx';
import AddNewComponent from './components/AddNewComponent.tsx';
function App() {

  return (
    <div className="@container/main page-main h-dvh p-5 flex flex-col bg-dark">
      <div className="@container/nav">
        <NavBar />
      </div>
      <div className="@container/header">
        <PageHeader />
      </div>
      <div className="@container/body h-dvh">
        <div className='page-body'>
          <Welcome />
        </div>
      </div>
      <div className="@container/toolbar h-15">
        <div className="page-bottom">
          <AddNewSystem />
          <AddNewComponent />
        </div>
      </div>
    </div>
  )
}

export default App;
