
import LoginPage from './Pages/LoginPage'
import SearchLanding from './Pages/SearchLanding'
import SearchDasboard from './Pages/SearchDashboard'
import IpsosAI from './Pages/IpsosAI'
import Resources from './Pages/Resources'
import PageLayout from './LayoutsOfThePages/MainLayout/PageLayout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProductionUpdates from './Pages/ProductionUpdates'
import HeroSectionPageLayout from './LayoutsOfThePages/FrontPageLayout/HeroSectionPageLayout'
import NewsEvents from './Pages/NewsEvents'
function App() {

  return (
    <BrowserRouter>
         <Routes>
          <Route path="*" element={<LoginPage />} />
           <Route index path="/login" element={<LoginPage />} />
           <Route element={<HeroSectionPageLayout />}> 
              <Route index path="/search" element={<SearchLanding />} />
           </Route>
           <Route element={<PageLayout />}>
            <Route index path="/searchDasboard" element={<SearchDasboard />} />
            <Route index path="/IpsosAI" element={<IpsosAI />} />
            <Route index path="/Resources" element={<Resources />} />
            <Route index path="/productionUpdates" element={<ProductionUpdates />} />
            <Route index path="/news" element={<NewsEvents />} />
            </Route>
         </Routes>
       </BrowserRouter>
  )
}

export default App
