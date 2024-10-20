
// import { useState } from "react";

const maxButtonsToShow = 5;

interface PaginationBtnProps {
	totalPages: number;
	currentPage: number;
    setCurrentPage: (page: number) => void; // New prop type for updating current page
}

const PaginationBtn: React.FC<PaginationBtnProps> = ({ totalPages, currentPage, setCurrentPage }) => {
	// const [currentPage, setCurrentPage] = useState(1);

	const getPaginationButtons = () => {
		const buttons = [];
		let startPage, endPage;

		if (totalPages <= maxButtonsToShow) {
			// If the total pages are less than or equal to max buttons, show all
			startPage = 1;
			endPage = totalPages;
		} else {
			// Calculate the start and end pages
			const halfMaxButtons = Math.floor(maxButtonsToShow / 2);
			startPage = Math.max(1, currentPage - halfMaxButtons);
			endPage = Math.min(totalPages, currentPage + halfMaxButtons);

			// Adjust if there are not enough pages on the left side
			if (currentPage - halfMaxButtons < 1) {
				endPage = Math.min(maxButtonsToShow, totalPages);
			}

			// Adjust if there are not enough pages on the right side
			if (currentPage + halfMaxButtons > totalPages) {
				startPage = Math.max(1, totalPages - maxButtonsToShow + 1);
			}
		}

		// Build buttons
		for (let i = startPage; i <= endPage; i++) {
			buttons.push(
				<button
					key={i}
					className={`mx-2 px-4 py-2 border rounded-md ${currentPage === i ? 'bg-blue-600 text-white' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
					onClick={() => setCurrentPage(i)}
				>
					{i}
				</button>
			);
		}

		// Add ellipses if needed
		if (startPage > 1) {
			buttons.unshift(
				<span className="mx-2 mt-1">...</span>
			);
		}
		if (endPage < totalPages) {
			buttons.push(
				<span className="mx-2 mt-1">...</span>
			);
		}

		return buttons;
	};

	return (
		<div className="flex justify-center mt-4">
			{getPaginationButtons()}
		</div>
	);
};

export default PaginationBtn
