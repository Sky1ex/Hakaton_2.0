import { ObjectCard } from './components/ObjectCard';
import { ObjectDetailsSidebar } from './components/ObjectDetailsSidebar';
import { ObjectDetails } from './components/ObjectDetails';
import { SearchAndFilter } from './components/SearchAndFilter';
import { CreateObjectForm } from './components/CreateObjectForm';
import { ErrorBoundary } from './components/ErrorBoundary';
import { UserProfile } from './components/UserProfile';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "./components/ui/pagination"
import { Building2 } from 'lucide-react';
import Logo from '/Logo.svg';
import { useApp } from './hooks/useApp';
import {ReactSVG} from 'react-svg';

function App() {
	const {
		// State
		objects,
		searchQuery,
		isInitialLoad,
		currentPage,
		totalPages,
		paginatedObjects,
		selectedObject,
		isDetailsOpen,
		
		// Actions
		handleSearchChange,
		handlePageChange,
		handlePreviousPage,
		handleNextPage,
		openDetails,
		closeDetails,
		
		// Filters
		cities,
		selectedCity,
		selectedResidentialComplex,
		handleCityChange,
		handleResidentialComplexChange,
	} = useApp();

	return (
		<div className="min-h-screen bg-gray-200/30">
			{/* Header */}
			<header className="border-b bg-white/90 backdrop-blur-sm shadow-sm border-gray-200">
				<div className="container mx-auto px-4 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							{/* <Building2 className="h-8 w-8 text-primary" /> */}
							<ReactSVG src={Logo} className="h-8 w-8 text-orange-500 drop-shadow-sm" />
							<div>
								<h1 className="text-2xl font-bold text-orange-500">
									Карточка проекта
								</h1>
							</div>
						</div>
						
						{/* User Profile */}
						<UserProfile />
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className={`transition-all duration-300 ease-in-out ${isDetailsOpen ? 'pr-0 lg:pr-[32rem]' : 'pr-0'}`}>
				<main className="container mx-auto px-4 py-6">
					<SearchAndFilter
						searchQuery={searchQuery}
						onSearchChange={handleSearchChange}
						selectedCity={selectedCity}
						onCityChange={handleCityChange}
						selectedResidentialComplex={selectedResidentialComplex}
						onResidentialComplexChange={handleResidentialComplexChange}
						cities={cities}
					/>

					{/* Results and Create Button */}
					<div className="mb-4 flex justify-between items-center">
						<p className="text-sm text-muted-foreground">
							Найдено объектов: <span className="font-semibold text-orange-500">{objects.length}</span>
							{totalPages > 1 && (
								<span className="ml-2">
									(страница <span className="font-semibold text-orange-500">{currentPage}</span> из <span className="font-semibold text-orange-500">{totalPages}</span>)
								</span>
							)}
						</p>
						<CreateObjectForm />
					</div>

					{/* Mobile: Simple scroll, Desktop: Container scroll */}
					<div className="lg:overflow-y-auto lg:scroll-container" style={{height: window.innerWidth >= 1024 ? 'calc(100vh - 390px)' : 'auto'}}>
						{paginatedObjects.length > 0 ? (
							<div className={`grid gap-6 ${
								isDetailsOpen 
									? 'grid-cols-1 md:grid-cols-1 lg:grid-cols-2' 
									: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
							}`}>
								{paginatedObjects.map((object) => (
									<ObjectCard
										key={object.id}
										object={object}
										onClick={() => openDetails(object)}
									/>
								))}
							</div>
						) : (
							<div className="text-center py-12">
								<Building2 className="h-12 w-12 text-orange-500 mx-auto mb-4" />
								<h3 className="text-lg font-semibold mb-2 text-foreground">
									{isInitialLoad ? 'Загрузка проектов...' : 
									 searchQuery ? 'Объекты не найдены' : 'Проекты не найдены'}
								</h3>
								<p className="text-muted-foreground">
									{isInitialLoad ? 'Получаем данные с сервера...' :
									 searchQuery 
										? 'Попробуйте изменить поисковый запрос'
										: 'На сервере пока нет проектов или произошла ошибка загрузки'
									}
								</p>
							</div>
						)}

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="mt-6 pb-6 lg:pb-0">
								<Pagination className='mb-0'>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious 
												href="#" 
												className={`hover:bg-secondary transition-colors duration-200 ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
												onClick={(e) => {
													e.preventDefault();
													handlePreviousPage();
												}}
											/>
										</PaginationItem>
										
										{/* Генерация номеров страниц */}
										{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
											let pageNumber;
											if (totalPages <= 5) {
												pageNumber = i + 1;
											} else if (currentPage <= 3) {
												pageNumber = i + 1;
											} else if (currentPage >= totalPages - 2) {
												pageNumber = totalPages - 4 + i;
											} else {
												pageNumber = currentPage - 2 + i;
											}
											
											return (
												<PaginationItem key={pageNumber}>
													<PaginationLink 
														href="#" 
														className='hover:bg-secondary transition-colors duration-200 cursor-pointer'
														isActive={currentPage === pageNumber}
														onClick={(e) => {
															e.preventDefault();
															handlePageChange(pageNumber);
														}}
													>
														{pageNumber}
													</PaginationLink>
												</PaginationItem>
											);
										})}
										
										{totalPages > 5 && currentPage < totalPages - 2 && (
											<PaginationItem>
												<PaginationEllipsis />
											</PaginationItem>
										)}
										
										<PaginationItem>
											<PaginationNext 
												href="#" 
												className={`hover:bg-secondary transition-colors duration-200 ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
												onClick={(e) => {
													e.preventDefault();
													handleNextPage();
												}}
											/>
										</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
					)}
					</div>
				</main>
			</div>

			{/* Object Details Sidebar (Desktop) */}
			<ErrorBoundary>
				<ObjectDetailsSidebar
					object={selectedObject}
					isOpen={isDetailsOpen}
					onClose={closeDetails}
				/>
			</ErrorBoundary>

			{/* Object Details (Mobile) */}
			<ErrorBoundary>
				<ObjectDetails
					object={selectedObject}
					isOpen={isDetailsOpen}
					onClose={closeDetails}
				/>
			</ErrorBoundary>
		</div>
	);
}

export default App;